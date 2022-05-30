import React from 'react';
import { prop } from 'styled-tools';
import styled from '@emotion/styled';
import { Heading } from '@/components/HeadingWithUnderline/HeadingWithUnderline';
import { Flex, Text, Image } from '@chakra-ui/react';
import { Button } from '@/components/Button';

const LaunchpadPage = () => {
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
          padding="76px 115px 119px"
          flexDirection="column"
          maxWidth="1440px"
          width="100%"
        >
          <Heading marginBottom={'48px'} color="#fff" withUnderline>
            Launchpad
          </Heading>

          <Flex flexDirection={'column'} width={'380px'}>
            <RegularText marginBottom={'16px'} color="#fff" fontSize={'14px'}>
              Stakers will receive their yield rewards only at the end of their
              Staking Period when they unstake/restake their tokens.
            </RegularText>
            <RegularText color="#fff" fontSize={'14px'}>
              Unstaking before the predefined period was reached will Unstake
            </RegularText>
          </Flex>
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
          margin="0 auto"
          padding="0px 40px 0px 40px"
          zIndex={2}
        >
          <Line />
          <Card marginRight={'90px'}>
            <Image
              width={'68px'}
              height={'68px'}
              src="/images/icon_person.png"
              alt="Polkapad"
              margin={'6px 0 24px 0px'}
              cursor="pointer"
            />
            <Header marginBottom={'10px'}>Sign Up and KYC</Header>
            <RegularText marginBottom="30px">
              In order to participate in sales on Avalaunch, you must sign up
              and KYC first. You can still stake and earn PLPD without
              registering.
            </RegularText>
            <Button variant="primary">START THE KYC PROCCESS</Button>
          </Card>
          <Card marginRight={'90px'}>
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
            <Button variant="primary">START THE KYC PROCCESS</Button>
          </Card>
          <Card marginRight={'90px'}>
            <Image
              width={'68px'}
              height={'68px'}
              src="/images/icon_coins.png"
              alt="Polkapad"
              margin={'6px 0 24px 0px'}
              cursor="pointer"
            />
            <Header marginBottom={'10px'}>Stake PLPD</Header>
            <RegularText marginBottom="30px">
              By staking PLPD, you earn allocation in IDOs. If you do not want
              to participate in sales, you can still benefit from staking.
            </RegularText>
            <Button variant="primary">START THE KYC PROCCESS</Button>
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
            <Header marginBottom={'10px'}>Register for Sale</Header>
            <RegularText marginBottom="30px">
              During the registration period, you must confirm your interest in
              participation. Once registration closes, you will not be able to
              register.
            </RegularText>
            <Button variant="primary">START THE KYC PROCCESS</Button>
          </Card>
        </Flex>
        <Flex padding="90px 119px 112px 119px">
          <Heading marginBottom={'112px'} withUnderline>
            Ongoing Sales
          </Heading>
        </Flex>
      </Flex>
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
  width: 228px;
  flex-direction: column;
`;

const Line = styled(Flex)`
  position: absolute;
  left: 0;
  top: -40px;
  height: 41px;
  width: 100%;
  background-color: #fff;
  flex-direction: column;
`;

export default LaunchpadPage;