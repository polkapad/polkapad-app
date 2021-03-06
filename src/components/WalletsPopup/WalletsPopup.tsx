import { Modal, Text } from '@chakra-ui/react';
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useCallback } from 'react';
import { BSCProvider, useConnectBSC } from '@/shared/hooks/useConnectBSC';
import { WalletPopupItem } from '@/components/WalletsPopup/components/WalletPopupItem';
import { Button } from '@/components/Button';
import { GoogleDocsViewer } from '@/components/GoogleDocsViewer/GoogleDocsViewer';
import styled from '@emotion/styled';
import { useSubstrate } from '@/shared/providers/substrate';
import { useDisclosure } from '@chakra-ui/hooks';
import { PolkaInstallModal } from '@/components/PolkaConnectButton/components/PolkaInstallModal';
import { isProduction } from '@/shared/utils/general';

interface WalletsPopupProps {
  isOpen: boolean;
  isPolka?: boolean;
  onClose: () => void;
}

export const WalletsPopup = ({
  isOpen,
  isPolka,
  onClose,
}: WalletsPopupProps) => {
  const isMetamaskAvailable = !!window.ethereum;
  const { connectToBSC } = useConnectBSC();
  const { connectToPolka, canUseWallet } = useSubstrate();
  const {
    isOpen: isPolkaInstallOpen,
    onOpen: onPolkaInstallOpen,
    onClose: onPolkaInstallClose,
  } = useDisclosure();

  const onMetamaskConnect = useCallback(() => {
    connectToBSC(BSCProvider.METAMASK);
    onClose();
  }, [connectToBSC, onClose]);

  const onWalletConnect = useCallback(() => {
    connectToBSC(BSCProvider.WALLETCONNECT);
    onClose();
  }, [connectToBSC, onClose]);

  const onPolkaConnect = useCallback(() => {
    if (canUseWallet) {
      connectToPolka();
      onClose();
    } else {
      onPolkaInstallOpen();
    }
  }, [canUseWallet, connectToPolka, onClose, onPolkaInstallOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minWidth={['100%', '500px']}>
          <ModalHeader fontSize="24px" paddingLeft="70px" marginTop="32px">
            {isPolka ? 'Connect a Polkadot wallet' : 'Connect an EVM Wallet'}
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody padding="0px 70px" marginBottom="32px">
            {!isPolka && (
              <>
                <WalletPopupItem
                  text={isMetamaskAvailable ? 'Metamask' : 'Install Metamask'}
                  icon="/images/metamask.svg"
                  onClick={onMetamaskConnect}
                />
                <WalletPopupItem
                  onClick={onWalletConnect}
                  text="Wallet connect"
                  icon="/images/wallet_connect.svg"
                />
                <WalletPopupItem
                  isComingSoon
                  text="Binance Wallet"
                  icon="/images/icon_bsc.png"
                />
                <WalletPopupItem
                  isComingSoon
                  text="Fortmatic"
                  icon="/images/fortmatic.png"
                />
              </>
            )}
            {isPolka && (
              <>
                <WalletPopupItem
                  text="Polkadot.js"
                  icon="/images/polka_icon.svg"
                  onClick={onPolkaConnect}
                />
                <WalletPopupItem
                  isComingSoon
                  text="Talisman"
                  icon="/images/talisman_icon.svg"
                />
                <WalletPopupItem
                  isComingSoon
                  text="Subwallet"
                  icon="/images/subwallet_icon.png"
                />
                <WalletPopupItem
                  isComingSoon
                  text="Clover"
                  icon="/images/clover_icon.svg"
                />
              </>
            )}
            <Text
              marginTop="24px"
              fontFamily="Poppins"
              fontSize="12px"
              color="secondary.text"
            >
              By connecting a wallet, you agree to the
              <GoogleDocsViewer
                title="Terms and Service"
                fileUrl="https://drive.google.com/file/d/1QxeZEdb-QzQy5Ra6eD8kJcmPS1khLiAq/preview"
                control={(props) => (
                  <DocUrl {...props}> Terms & Conditions</DocUrl>
                )}
              />{' '}
              and acknowledge that you have read and understand our
              <GoogleDocsViewer
                title="Privacy Policy"
                fileUrl="https://drive.google.com/file/d/1kO34-LSkXup8c3vsspK0XILTKvKoxw8k/preview"
                control={(props) => <DocUrl {...props}> Privacy Policy</DocUrl>}
              />
              .
            </Text>
          </ModalBody>
          {!isProduction && (
            <ModalFooter
              padding="20px 70px"
              borderTop="1px solid var(--chakra-colors-primary-border)"
            >
              <Button variant="primary">Learn how to connect</Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
      <PolkaInstallModal
        isOpen={isPolkaInstallOpen}
        onClose={onPolkaInstallClose}
      />
    </>
  );
};

const DocUrl = styled.span`
  cursor: pointer;
  font-weight: 900;

  &:hover {
    text-decoration: underline;
  }
`;
