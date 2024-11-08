// src/App.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ConnectWallet from './components/ConnectWallet';
import ProfileCreation from './components/ProfileCreation';
import ContentUpload from './components/ContentUpload';
import ContentList from './components/ContentList';
import OwnerDashboard from './components/OwnerDashboard';
import { getContract } from './components/utils/contract';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [showOwnerDashboard, setShowOwnerDashboard] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState('');
  const [accountAddress, setAccountAddress] = useState('');

  // Check if the connected account is the contract owner
  useEffect(() => {
    const checkIfOwner = async () => {
      if (account && account.signer) {
        try {
          const contract = getContract(account.signer);
          const owner = await contract.owner();
          setOwnerAddress(owner);
          const address = await account.signer.getAddress();
          setAccountAddress(address);
          setIsOwner(owner.toLowerCase() === address.toLowerCase());
        } catch (error) {
          console.error('Error checking owner:', error);
          setIsOwner(false);
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
      }
    };
    checkIfOwner();
  }, [account]);

  // Wait until ownerAddress and accountAddress are fetched
  if (account && !ownerAddress) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {!account ? (
        <ConnectWallet setAccount={setAccount} />
      ) : (
        <>
          {/* Navigation */}
          <div className="header-strip">
            <div className="header-left">
              <span className="company-name">Thought Verse</span>
              <button className="nav-button" onClick={() => setShowOwnerDashboard(false)}>
                Home
              </button>
            </div>
            <div className="header-right">
              {isOwner && (
                <button className="nav-button" onClick={() => setShowOwnerDashboard(true)}>
                  Owner Dashboard
                </button>
              )}
            </div>
          </div>

          {/* Conditional Rendering */}
          {!showOwnerDashboard ? (
            <>
              <ProfileCreation account={account} />
              <ContentUpload account={account} />
              <ContentList account={account} />
            </>
          ) : (
            <OwnerDashboard account={account} />
          )}
        </>
      )}
    </div>

  );
}

export default App;
