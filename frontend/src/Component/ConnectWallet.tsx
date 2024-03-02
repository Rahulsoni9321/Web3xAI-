import { useWeb3Modal } from '@web3modal/react';

const ConnectWallet = () => {
  const { open } = useWeb3Modal();

  return (
    <button className='btn btn-primary' onClick={() => open()}>Connect Wallet</button>
  );
};

export default ConnectWallet;