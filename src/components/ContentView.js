import React, { useState, useEffect } from 'react';
import { getContract } from './utils/contract';
import { formatEther, parseEther } from 'ethers';

function ContentView({ content, account }) {
  const { signer } = account;
  const [fullContent, setFullContent] = useState(null);
  const [tipAmount, setTipAmount] = useState('');
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [isTipping, setIsTipping] = useState(false);

  // Fetch creator's profile
  useEffect(() => {
    const fetchCreatorProfile = async () => {
      try {
        const contract = getContract(signer);
        const profile = await contract.profiles(content.creator);
        setCreatorProfile(profile);
      } catch (error) {
        console.error('Error fetching creator profile:', error);
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

    fetchCreatorProfile();
  }, [content.creator, signer]);

  // Access full content
  const accessContent = async () => {
    try {
      const contract = getContract(signer);
      const accessFee = content.price; // Price in wei

      const tx = await contract.accessContent(content.id, { value: accessFee });
      await tx.wait();

      // Fetch the full content after purchase
      const updatedContent = await contract.getContent(content.id);
      setFullContent(updatedContent);
    } catch (error) {
      console.error('Error accessing content:', error);
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

  // Tip the content creator
  const tipCreator = async () => {
    try {
      if (!tipAmount || isNaN(tipAmount) || Number(tipAmount) <= 0) {
        alert('Please enter a valid tip amount.');
        return;
      }

      setIsTipping(true);

      const contract = getContract(signer);
      const tipAmountWei = parseEther(tipAmount);

      const tx = await contract.tipCreator(content.creator, {
        value: tipAmountWei,
      });
      await tx.wait();

      alert('Tip sent successfully!');
      setTipAmount('');
    } catch (error) {
      console.error('Error tipping creator:', error);
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
      setIsTipping(false);
    }
  };

  // Render content
  const renderContent = () => (
    <div className="content-view">
      {/* Creator's Profile */}
      {creatorProfile && (
        <div className="creator-profile">
          <h4 className="creator-name">
            Creator: {creatorProfile.username}
          </h4>
          <p className="creator-bio">{creatorProfile.bio}</p>
        </div>
      )}

      {/* Content Title */}
      <h3 className="content-title">{content.title}</h3>
      <p className="content-price">
        Price: {formatEther(content.price)} ETH
      </p>

      {/* Content Body */}
      {fullContent || content.hasAccess ? (
        <>
          <p className="content-body">{content.body}</p>
        </>
      ) : (
        <>
          {/* Content Preview */}
          <p className="content-preview">
            {content.body.substring(0, 100)}...
          </p>
          <button onClick={accessContent} className="access-button">
            Access Full Content for {formatEther(content.price)} ETH
          </button>
        </>
      )}

      {/* Tipping Section */}
      <div className="tipping-section">
        <input
          type="text"
          placeholder="Tip Amount in ETH"
          value={tipAmount}
          onChange={(e) => setTipAmount(e.target.value)}
          className="input-field"
        />
        <button
          onClick={tipCreator}
          disabled={isTipping}
          className="tip-button"
        >
          {isTipping ? 'Sending Tip...' : 'Tip Creator'}
        </button>
      </div>
    </div>

  );

  return <div>{renderContent()}</div>;
}

export default ContentView;
