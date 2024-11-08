// src/components/OwnerDashboard.js
import React, { useState, useEffect } from 'react';
import { getContract } from './utils/contract';
import { parseEther, formatEther } from 'ethers';

function OwnerDashboard({ account }) {
  const { signer, accountAddress } = account;
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [contractBalance, setContractBalance] = useState('0');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [platformShare, setPlatformShare] = useState('');
  const [newPlatformShare, setNewPlatformShare] = useState('');
  const [postingFee, setPostingFee] = useState('');
  const [newPostingFee, setNewPostingFee] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch contract data
  const fetchContractData = async () => {
    try {
      const contract = getContract(signer);

      // Get the contract owner address
      const owner = await contract.owner();
      setOwnerAddress(owner);

      // Get the contract balance
      const balance = await contract.provider.getBalance(contract.address);
      setContractBalance(formatEther(balance));

      // Get the current access fee platform share
      const share = await contract.accessFeePlatformShare();
      setPlatformShare((Number(share) / 10000).toString()); // Assuming share is in basis points

      // Get the current posting fee
      const fee = await contract.postingFee();
      setPostingFee(formatEther(fee));
    } catch (error) {
      console.error('Error fetching contract data:', error);
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
  };

  // Withdraw specific amount
  const withdrawFunds = async () => {
    try {
      setIsLoading(true);
      const contract = getContract(signer);
      const amountInWei = parseEther(withdrawAmount);

      const tx = await contract.withdraw(amountInWei);
      await tx.wait();

      alert('Withdrawal successful!');
      setWithdrawAmount('');
      fetchContractData();
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      //alert('Error withdrawing funds: ' + error.message);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Withdraw all funds
  const withdrawAllFunds = async () => {
    try {
      setIsLoading(true);
      const contract = getContract(signer);

      const tx = await contract.withdrawAll();
      await tx.wait();

      alert('All funds withdrawn successfully!');
      fetchContractData();
    } catch (error) {
      console.error('Error withdrawing all funds:', error);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Set Access Fee Platform Share
  const updatePlatformShare = async () => {
    try {
      if (!newPlatformShare || isNaN(newPlatformShare)) {
        alert('Please enter a valid platform share percentage.');
        return;
      }

      setIsLoading(true);
      const contract = getContract(signer);

      const tx = await contract.setAccessFeePlatformShare(newPlatformShare);
      await tx.wait();

      alert('Platform share updated successfully!');
      setNewPlatformShare('');
      fetchContractData();
    } catch (error) {
      console.error('Error updating platform share:', error);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Set Posting Fee
  const updatePostingFee = async () => {
    try {
      if (!newPostingFee || isNaN(newPostingFee)) {
        alert('Please enter a valid posting fee amount.');
        return;
      }

      setIsLoading(true);
      const contract = getContract(signer);
      const feeInWei = parseEther(newPostingFee);

      const tx = await contract.setPostingFee(feeInWei);
      await tx.wait();

      alert('Posting fee updated successfully!');
      setNewPostingFee('');
      fetchContractData();
    } catch (error) {
      console.error('Error updating posting fee:', error);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContractData();
  }, []);

  // Wait until ownerAddress is fetched
  if (!ownerAddress) {
    return <p>Loading...</p>;
  }

  // Check if the user is the owner
  if (accountAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
    return <p>You are not authorized to view this page.</p>;
  }

  return (
    <div className="owner-dashboard">
      <h2 className="section-title">Owner Dashboard</h2>
      <p className="contract-balance">Contract Balance: {contractBalance} ETH</p>

      {/* Withdraw Funds Section */}
      <div className="withdraw-section">
        <h3>Withdraw Funds</h3>
        <input
          type="text"
          placeholder="Amount to withdraw in ETH"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          className="input-field"
        />
        <button onClick={withdrawFunds} className="submit-button" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Withdraw Funds'}
        </button>
        <button onClick={withdrawAllFunds} className="submit-button" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Withdraw All Funds'}
        </button>
      </div>

      {/* Set Access Fee Platform Share Section */}
      <div className="platform-share-section">
        <h3>Access Fee Platform Share</h3>
        <p>Current Platform Share: {platformShare}%</p>
        <input
          type="text"
          placeholder="New Platform Share Percentage (e.g., 2.5)"
          value={newPlatformShare}
          onChange={(e) => setNewPlatformShare(e.target.value)}
          className="input-field"
        />
        <button onClick={updatePlatformShare} className="submit-button" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Update Platform Share'}
        </button>
      </div>

      {/* Set Posting Fee Section */}
      <div className="posting-fee-section">
        <h3>Posting Fee</h3>
        <p>Current Posting Fee: {postingFee} ETH</p>
        <input
          type="text"
          placeholder="New Posting Fee in ETH (e.g., 0.001)"
          value={newPostingFee}
          onChange={(e) => setNewPostingFee(e.target.value)}
          className="input-field"
        />
        <button onClick={updatePostingFee} className="submit-button" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Update Posting Fee'}
        </button>
      </div>
    </div>
  );
}

export default OwnerDashboard;
