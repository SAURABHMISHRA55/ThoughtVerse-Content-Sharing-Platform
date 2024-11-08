import React from 'react';
import { BrowserProvider } from 'ethers';


function ConnectWallet({ setAccount }) {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Initialize ethers.js
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accountAddress = await signer.getAddress();

        // Set account state
        setAccount({ provider, signer, accountAddress });
      } catch (error) {
        console.error('Error connecting wallet:', error);
        let message = 'An error occurred while creating the profile.';

        if (error.errorName) {
          message = error.errorName;
          if (error.errorArgs && error.errorArgs.length > 0) {
            message += ': ' + error.errorArgs.join(', ');
          }
        } else if (error.reason) {
          message = error.reason;
        } else if (error.data && error.data.message) {
          message = error.data.message;
        } else if (error.message) {
          message = error.message;
        }

        alert(message);
      }
    } else {
      alert('MetaMask not detected. Please install MetaMask and try again.');
    }
  };

  return (
    <div className="landing-page">
      {/* Header with strip background */}
      <div className="header-strip">
        <span className="company-name">Thought Verse</span>
      </div>

      {/* Main content */}
      <div className="content">
        <h2 className="title">Welcome to the Thought Verse</h2>
        <p className="description">
          Discover, create, and share your thoughts with the world. Join our
          platform and connect with like-minded individuals.
        </p>
        <button onClick={connectWallet} className="connect-button">
          Connect Wallet
        </button>
      </div>
    </div>

  );
}

export default ConnectWallet;
