import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import RequestAirdrop from './RequestAirdrop';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {

  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="app-container">
            <div className="app-header">
              <h1 className="app-title">Solana Wallet</h1>
              <p className="app-subtitle">Connect your wallet and request test SOL</p>
            </div>
            
            <div className="wallet-section">
              <div className="wallet-buttons">
                <WalletMultiButton />
                <WalletDisconnectButton />
              </div>
            </div>
            
            <div className="airdrop-section">
              <RequestAirdrop />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App
