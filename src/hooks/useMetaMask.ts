// src/hooks/useMetaMask.ts
import { useState, useEffect, useCallback } from 'react';

interface MetaMaskState {
  isInstalled: boolean;
  isConnected: boolean;
  address: string | null;
  ethBalance: string | null;
  error: string | null;
  connecting: boolean;
}

const useMetaMask = () => {
  const [state, setState] = useState<MetaMaskState>({
    isInstalled: false,
    isConnected: false,
    address: null,
    ethBalance: null,
    error: null,
    connecting: false,
  });

  useEffect(() => {
    const isInstalled = typeof window.ethereum !== 'undefined';
    setState(prev => ({ ...prev, isInstalled }));
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) return;
    setState(prev => ({ ...prev, connecting: true, error: null }));
    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

      const address = accounts[0];

      const balanceHex = (await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      })) as string;

      // Convert Wei to ETH
      const balanceWei = BigInt(balanceHex);
      const balanceEth = (Number(balanceWei) / 1e18).toFixed(4);

      setState(prev => ({
        ...prev,
        isConnected: true,
        address,
        ethBalance: balanceEth,
        connecting: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Failed to connect to MetaMask.',
        connecting: false,
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState(prev => ({
      ...prev,
      isConnected: false,
      address: null,
      ethBalance: null,
    }));
  }, []);

  return { ...state, connect, disconnect };
};

export default useMetaMask;