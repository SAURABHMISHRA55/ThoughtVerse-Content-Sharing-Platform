import React, { useState } from 'react';
import { getContract } from './utils/contract';

function ProfileCreation({ account }) {
  // State variables
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  // Create user profile
  const createProfile = async (event) => {
    event.preventDefault();
    const { signer } = account;

    try {
      const contract = getContract(signer);

      const tx = await contract.createProfile(username, bio);
      await tx.wait();

      alert('Profile created successfully!');
      // Clear the form
      setUsername('');
      setBio('');
    } catch (error) {
      console.error('Error creating profile:', error);
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
    <div className="create-profile">
      <h2 className="section-title">Create Your Profile</h2>
      <form onSubmit={createProfile} className="profile-form">
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="textarea-field"
        ></textarea>
        <button type="submit" className="submit-button">
          Create Profile
        </button>
      </form>
    </div>

  );
}

export default ProfileCreation;
