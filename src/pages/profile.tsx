import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Heading } from '@/components/HeadingWithUnderline/HeadingWithUnderline';
import WalletCard from '@/components/WalletCard/WalletCard';
import useUser from '@/lib/hooks/useUser';
import {
  Button as ChakraButton,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Image,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
} from '@chakra-ui/react';

import {
  BsFillCheckCircleFill,
  BsFillExclamationCircleFill,
} from 'react-icons/bs';
import { FormInput } from '@/components/FormInput/FormInput';
import { MdEmail } from 'react-icons/md';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaUser } from 'react-icons/fa';
import { Button } from '@/components/Button';

import successful_kyc from '../assets/successful_kyc.svg';
import { useRouter } from 'next/router';
import fetchJson from '@/lib/fetchJson';
import { Footer, FooterWrapper } from '@/components/footer';
import {
  gtagSendStartKyc,
  gtagSendSuccessKyc,
  gtagSendWalletAdded,
} from '@/services/analytics';
import { serviceUrl } from '@/config/env';

import supportIcon from '@/assets/support.svg';
import styled from '@emotion/styled';
import { KYCStatus, KycStatusTypes } from '@/pages/api/kycStatus';
import {
  mailchimpSendFinishedKyc,
  mailchimpSendStartKyc,
  mailchimpSendWalletAdded,
} from '@/services/mailchimp';

const tabs = ['Profile details', 'Verify wallet', 'KYC Verification'];

const KYC_STATUS_POLL_INTERVAL = 10000;

interface IFormInput {
  email: string;
  name: string;
}

const schema = object()
  .shape({
    email: string().required('Email is required').email('Email is invalid'),
    name: string().required('Name is required'),
  })
  .required();

const ProfilePage = () => {
  const { user } = useUser({
    redirectTo: '/auth/login',
  });
  const intervalID = useRef<NodeJS.Timer | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [kycStatus, setKycStatus] = useState<KycStatusTypes | null | undefined>(
    user?.kycStatus,
  );
  const [wallets, setWallets] = useState<{ name: string; value: string }[]>([]);
  const router = useRouter();
  const isKYCAccepted = kycStatus === KycStatusTypes.ACCEPTED;
  const isKYCBlocked = kycStatus === KycStatusTypes.BLOCKED;

  const getKycStatus = useCallback(async () => {
    const newStatus: KYCStatus = await fetchJson('/api/kycStatus');

    if (newStatus.kycStatus !== kycStatus) {
      setKycStatus(newStatus.kycStatus);
    }
  }, [kycStatus]);

  // Init
  useEffect(() => {
    if (!kycStatus && user?.kycStatus) {
      setKycStatus(user.kycStatus);
    }
  }, [getKycStatus, kycStatus, user?.kycStatus]);

  useEffect(() => {
    if (kycStatus === KycStatusTypes.IN_PROGRESS && !intervalID.current) {
      intervalID.current = setInterval(getKycStatus, KYC_STATUS_POLL_INTERVAL);
    }

    if (kycStatus !== KycStatusTypes.IN_PROGRESS && intervalID.current) {
      clearInterval(intervalID.current);
      intervalID.current = null;
    }

    if (kycStatus === KycStatusTypes.ACCEPTED && user?.email) {
      mailchimpSendFinishedKyc(user?.email);
    }
  }, [getKycStatus, kycStatus]);

  useEffect(() => {
    return () => {
      if (intervalID.current) {
        clearInterval(intervalID.current);
        intervalID.current = null;
      }
    };
  }, []);

  const walletsAreVerified = useMemo(() => wallets.length === 2, [wallets]);

  const selectTab = useCallback((index) => {
    setSelectedTab(index);
  }, []);

  const { control, reset } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        name: user.name,
      });
    }
  }, [user, reset]);

  const startKyc = useCallback(async () => {
    if (typeof window !== 'undefined') {
      setKycStatus(KycStatusTypes.IN_PROGRESS);
      const kyc = await fetch('/api/kyc').then((data) => data.json());
      gtagSendStartKyc();

      if (user?.email) {
        mailchimpSendStartKyc(user.email);
      }

      window.open(kyc.iframeUrl);
    }
  }, [user?.email]);

  const fetchWallets = useCallback(async () => {
    const wallets: Array<{
      name: string;
      value: string;
    }> = await fetchJson(`https://${serviceUrl}/wallets`, {}, user?.token);
    setWallets(wallets);
    gtagSendWalletAdded();

    if (user?.email) {
      mailchimpSendWalletAdded(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (user?.token?.length && !wallets.length) fetchWallets();
  }, [fetchWallets, user?.token?.length, wallets?.length]);

  useEffect(() => {
    if (router.query.kyc) {
      if (router.query.kyc === 'true') {
        setSelectedTab(2);
      } else if (router.query.kyc === 'success') {
        gtagSendSuccessKyc();

        if (user?.email) {
          mailchimpSendFinishedKyc(user.email);
        }
      }
    }

    if (router.query.wallet) {
      setSelectedTab(1);
    }
  }, [router, setSelectedTab]);

  const tabContent = [
    <Flex
      flexBasis="356px"
      as="form"
      flexDirection="column"
      gap="28px"
      key="details"
      minHeight="366px"
    >
      <FormControl isInvalid={false} isDisabled>
        <FormLabel htmlFor="name">Name</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none" width="55px" height="100%">
            <Flex
              height="21px"
              width="100%"
              justifyContent="center"
              alignItems="center"
              borderRight="1px solid #E0E0E0"
            >
              <Icon as={FaUser} height="21px" width="21px" color="#49C7DA" />
            </Flex>
          </InputLeftElement>
          <FormInput fieldName="name" hasError={false} control={control} />
        </InputGroup>
      </FormControl>
      <FormControl isInvalid={false} isDisabled>
        <FormLabel htmlFor="email">Email</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none" width="55px" height="100%">
            <Flex
              height="21px"
              width="100%"
              justifyContent="center"
              alignItems="center"
              borderRight="1px solid #E0E0E0"
            >
              <Icon as={MdEmail} height="21px" width="21px" color="#49C7DA" />
            </Flex>
          </InputLeftElement>
          <FormInput fieldName="email" hasError={false} control={control} />
        </InputGroup>
      </FormControl>
    </Flex>,
    <Flex
      paddingBottom="100px"
      width={['100%', '100%', '466px']}
      flexDirection="column"
      key="wallet"
      alignItems={'flex-end'}
    >
      <WalletCard type="eth" wallets={wallets} verifyCallback={fetchWallets} />
      <WalletCard
        type="polka"
        wallets={wallets}
        verifyCallback={fetchWallets}
      />
      {user && !isKYCAccepted && (
        <Button
          width="120px"
          marginTop="20px"
          variant="primary"
          onClick={() => selectTab(2)}
          disabled={!walletsAreVerified}
        >
          To KYC
        </Button>
      )}
    </Flex>,
    <Flex
      flexBasis={isKYCAccepted ? '404px' : '800px'}
      height="550px"
      flexDirection="column"
      gap={isKYCAccepted ? '28px' : '9px'}
      key="kyc"
    >
      {isKYCAccepted && (
        <>
          <Flex alignItems="center" gap="30px">
            <Image src={successful_kyc} color="#49C7DA" />
            <Text color="#303030" fontWeight="700" fontSize="24px">
              You have been successfully verified!
            </Text>
          </Flex>
          <Flex flexDirection="column" marginTop="30px">
            <Text
              color="#303030"
              fontWeight="400"
              fontSize="14px"
              marginBottom="60px"
            >
              Now that you have verified your identity, you can participate in
              sales, feel free to go to the launchpad.
            </Text>
            <Button variant="primary" onClick={() => router.push('/locker')}>
              Ready to Lock
            </Button>
          </Flex>
        </>
      )}
      {!isKYCAccepted && (
        <>
          <Heading
            color="#303030"
            fontFamily="Poppins"
            fontSize="24px"
            fontWeight="700"
          >
            Individual KYC verification
          </Heading>
          <Text marginBottom="40px" color="#303030" maxWidth={468}>
            Each account has 3 KYC credits. You can start KYC only after
            verifying wallets.
          </Text>
          <Button
            variant={isKYCBlocked ? 'secondary' : 'primary'}
            onClick={startKyc}
            disabled={!walletsAreVerified || isKYCBlocked}
            width={158}
          >
            {isKYCBlocked ? 'KYC blocked' : 'Start KYC'}
          </Button>
        </>
      )}
    </Flex>,
  ];

  return (
    <Fragment>
      {' '}
      <Flex
        padding={['40px 16px', '40px 16px', '76px 155px 0']}
        flexDirection="column"
        position="relative"
      >
        <Heading marginBottom={101} withUnderline>
          User Profile
        </Heading>

        <Flex flexDirection={['column', 'column', 'column', 'row']}>
          <Flex
            direction={['column', 'row', 'row', 'column']}
            gap="30px"
            flexBasis="30%"
            mr={[0, 0, 0, '20px']}
            mb={['20px', '20px', '20px', 0]}
          >
            {tabs.map((tab, index) => (
              <Flex
                gap="11px"
                alignItems="center"
                justifyContent="flex-start"
                cursor="pointer"
                key={index}
                onClick={() => selectTab(index)}
              >
                <Icon
                  as={
                    index === 0 ||
                    (index === 2 && isKYCAccepted) ||
                    (index === 1 && wallets && wallets.length === 2)
                      ? BsFillCheckCircleFill
                      : BsFillExclamationCircleFill
                  }
                  color={
                    index === 0 ||
                    (index === 2 && isKYCAccepted) ||
                    (index === 1 && wallets && wallets.length === 2)
                      ? '#49C7DA'
                      : '#FFCC15'
                  }
                />
                <Text
                  color={index === selectedTab ? '#49C7DA' : '#303030'}
                  fontWeight="600"
                  fontSize="14px"
                  lineHeight="21px"
                >
                  {tab}
                </Text>
              </Flex>
            ))}
          </Flex>
          <SupportButton
            top={['50px', '76px']}
            right={['10px', '96px']}
            _hover={{ backgroundColor: '#00BAD6' }}
            as="a"
            href="mailto:support@polkapad.network"
          >
            <Image src={supportIcon} width="20px" height="20px" />
          </SupportButton>
          {/* TabContent */}
          {tabContent[selectedTab]}
        </Flex>
      </Flex>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </Fragment>
  );
};

const SupportButton = styled(ChakraButton)`
  border-radius: 100%;
  background-color: #49c7da;
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  position: absolute;
  cursor: pointer;
  padding: 0;
`;

export default ProfilePage;
