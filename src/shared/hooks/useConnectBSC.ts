import {
  DOT_BSC,
  KSM_BSC,
  network,
  networkName,
  rpcUrls,
  blockExplorerUrls,
  WCProviderConfig,
} from '@/config/network';
import { useEthers, useTokenBalance } from '@usedapp/core';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { Balance, UserContext } from '../providers/userContext';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { sendMetricsStartedConnectionBinance } from '@/services/metrics';

const WALLET_CONNECT_KEY = 'walletconnect';
const WALLET_CONNECT_DEEPLINK_KEY = 'WALLETCONNECT_DEEPLINK_CHOICE';

export enum BSCProvider {
  METAMASK = 'METAMASK',
  WALLETCONNECT = 'WALLETCONNECT',
}

export const useConnectBSC = () => {
  const {
    activateBrowserWallet,
    activate,
    account,
    chainId,
    deactivate: disconnectBSC,
    library,
  } = useEthers();

  const connected = !!chainId;
  const userContext = useContext(UserContext);
  const dotBalance = useTokenBalance(DOT_BSC, account);
  const ksmBalance = useTokenBalance(KSM_BSC, account);

  const isMetamask = useMemo(() => {
    return library?.connection.url === 'metamask';
  }, [library?.connection.url]);

  const walletName = useMemo(() => {
    return isMetamask ? 'Metamask' : 'WalletConnect';
  }, [isMetamask]);

  const connectToBSC = useCallback(
    async (provider: BSCProvider = BSCProvider.METAMASK) => {
      try {
        if (provider === BSCProvider.METAMASK) {
          await activateBrowserWallet();

          if (chainId !== network) {
            const requestArguments = getNetworkArguments(
              network,
              networkName,
              rpcUrls,
              blockExplorerUrls,
            );

            await window.ethereum.request(requestArguments);
          }
        }
        if (provider === BSCProvider.WALLETCONNECT) {
          const provider = new WalletConnectProvider(WCProviderConfig);
          await provider.enable();
          await activate(provider);
        }

        sendMetricsStartedConnectionBinance();
      } catch (e) {
        console.error(e);
      }
    },
    [activate, activateBrowserWallet, chainId],
  );

  const switchToBSC = useCallback(async () => {
    const requestArguments = getNetworkArguments(
      network,
      networkName,
      rpcUrls,
      blockExplorerUrls,
    );

    await window.ethereum.request(requestArguments);
  }, []);

  useEffect(() => {
    if (localStorage.getItem(WALLET_CONNECT_KEY)) {
      connectToBSC(BSCProvider.WALLETCONNECT);
    }
  }, []);

  useEffect(() => {
    if (account && dotBalance && ksmBalance && !userContext?.bsc?.address) {
      userContext.setContext({
        ...userContext,
        bsc: {
          address: account as string,
          balance: {
            bsc: new Balance(dotBalance),
            polka: new Balance(ksmBalance),
          },
        },
      });
    }
  }, [account, dotBalance, ksmBalance, userContext]);

  const deactivate = useCallback(() => {
    userContext.setContext({
      ...userContext,
      bsc: {},
    });
    disconnectBSC();
    localStorage.removeItem(WALLET_CONNECT_KEY);
    localStorage.removeItem(WALLET_CONNECT_DEEPLINK_KEY);
  }, [disconnectBSC, userContext]);

  const getNetworkArguments = (
    chainId: number,
    chainName: string,
    rpcUrls: string[],
    blockExplorerUrls: string[],
  ) => {
    return {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${Number(chainId).toString(16)}`,
          chainName,
          nativeCurrency: {
            name: 'Binance Chain Native Token',
            symbol: 'BNB',
            decimals: 18,
          },
          rpcUrls,
          blockExplorerUrls,
        },
      ],
    };
  };

  return {
    disconnectFromBSC: deactivate,
    connectToBSC,
    dotBalance,
    ksmBalance,
    connected,
    account,
    chainId,
    switchToBSC,
    walletName,
    isMetamask,
  };
};
