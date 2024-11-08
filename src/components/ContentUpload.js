import React, { useState } from 'react';
import { getContract } from './utils/contract';
import { parseEther } from 'ethers';

function ContentUpload({ account }) {
  // State variables
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState('');

  // Handle content submission
  const postContent = async (event) => {
    event.preventDefault();
    const { signer } = account;

    try {
      const contract = getContract(signer);

      // Posting fee and content price in wei
      const postingFee = parseEther('0.0002'); // 0.0001 ETH
      const contentPrice = parseEther(price || '0');

      // Post content to the contract
      const tx = await contract.postContent(
        title,
        body,
        contentPrice,
        { value: postingFee }
      );
      await tx.wait();

      alert('Content posted successfully!');
      // Clear the form
      setTitle('');
      setBody('');
      setPrice('');
    } catch (error) {
      console.error('Error posting content:', error);
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

  return (
    <div className="upload-content">
      <h2 className="section-title">Upload New Content</h2>
      <form onSubmit={postContent} className="content-form">
        <input
          type="text"
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />
        <textarea
          placeholder="Content"
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="textarea-field"
        ></textarea>
        <input
          type="text"
          placeholder="Price in ETH (e.g., 0.05)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-button">
          Post Content
        </button>
      </form>
    </div>

  );
}

export default ContentUpload;
