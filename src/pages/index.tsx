import React, { useMemo } from 'react';
import { prop } from 'styled-tools';
import styled from '@emotion/styled';
import { Heading } from '@/components/HeadingWithUnderline/HeadingWithUnderline';
import { Flex, Text, Image } from '@chakra-ui/react';
import { Footer, FooterWrapper } from '@/components/footer';
import { Button } from '@/components/Button';
import Link from 'next/link';
import useUser from '@/lib/hooks/useUser';

const LaunchpadPage = () => {
  const { user } = useUser();
  const isLoggedIn = useMemo(() => !!user && user.isLoggedIn, [user]);

  return (
    <Flex flexDirection="column">
      <Flex
        backgroundImage="images/launchpad_bg.png"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Flex
          padding={['76px 16px 119px', '76px 16px 119px', '76px 115px 119px']}
          flexDirection="column"
          maxWidth="1440px"
          width="100%"
        >
          <Heading marginBottom={'48px'} color="#fff" withUnderline>
            HMC Launchpad
          </Heading>

          <HeaderFlex flexDirection={'column'}>
            <RegularText marginBottom={'16px'} color="#fff" fontSize={'14px'}>
              Heterogeneous Multi-Chain Launchpad is the first Polkadot-Native
              Launchpad.
            </RegularText>
          </HeaderFlex>
        </Flex>
      </Flex>
      <Flex
        margin="0 auto"
        flexDirection="column"
        maxWidth="1440px"
        width="100%"
      >
        <Flex
          position={'relative'}
          margin="-40px auto 0"
          padding={['40px 16px 0', '40px 16px 0', '40px 40px 0']}
          background="white"
          rowGap={10}
          flexDirection={['column', 'column', 'row']}
        >
          <Card>
            <Image
              width={'68px'}
              height={'68px'}
              src="/images/icon_person.png"
              alt="Polkapad"
              margin={'6px 0 24px 0px'}
              cursor="pointer"
            />
            <Header marginBottom={'10px'}>Register</Header>
            <RegularText marginBottom="30px">
              In order to participate in sales on Polkapad, you must sign up and
              KYC first.
            </RegularText>
            <Link href={isLoggedIn ? '/profile' : '/auth/register'}>
              <Button>Register</Button>
            </Link>
          </Card>
          <Card>
            <Image
              width={'68px'}
              height={'68px'}
              src="/images/icon_wallet.png"
              alt="Polkapad"
              margin={'6px 0 24px 0px'}
              cursor="pointer"
            />
            <Header marginBottom={'10px'}>Verify wallet</Header>
            <RegularText marginBottom="30px">
              Once you have registered and submitted your KYC, you must verify
              your wallet. This is the only wallet you will be able to use for
              sales.
            </RegularText>
            <Link href={isLoggedIn ? '/profile?wallet=true' : '/auth/register'}>
              <Button>Verify wallet</Button>
            </Link>
          </Card>
          <Card>
            <Image
              width={'68px'}
              height={'68px'}
              src="/images/icon_coins.png"
              alt="Polkapad"
              margin={'6px 0 24px 0px'}
              cursor="pointer"
            />
            <Header marginBottom={'10px'}>Check locker</Header>
            <RegularText marginBottom="30px">
              By staking or locking funds, you earn allocation in IDOs.
            </RegularText>
            <Link href="locker">
              <Button>Check locker</Button>
            </Link>
          </Card>
          <Card>
            <Image
              width={'68px'}
              height={'68px'}
              src="/images/icon_document.png"
              alt="Polkapad"
              margin={'6px 0 24px 0px'}
              cursor="pointer"
            />
            <Header marginBottom={'10px'}>To sale</Header>
            <RegularText marginBottom="30px">
              During the registration period, you must confirm your interest in
              participation. Once registration closes, you will not be able to
              register.
            </RegularText>
            <Link href="https://polkapad.network/#about_us_subscribe_form">
              <Button>Subscribe</Button>
            </Link>
          </Card>
        </Flex>
      </Flex>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </Flex>
  );
};

const RegularText = styled(Text)`
  font-family: Poppins;
  font-size: ${prop('fontSize', '12px')};
  color: ${prop('color', '#303030')};
`;

const Header = styled(Text)`
  font-family: Poppins;
  font-size: 24px;
  font-weight: 700;
  color: ${prop('color', '#303030')};
`;

const Card = styled(Flex)`
  position: relative;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  height: 300px;

  @media screen and (min-width: 48em) {
    width: 25%;
    padding: 0 15px;
  }
`;

const HeaderFlex = styled(Flex)`
  width: 100%;
  max-width: 380px;
`;
export default LaunchpadPage;
