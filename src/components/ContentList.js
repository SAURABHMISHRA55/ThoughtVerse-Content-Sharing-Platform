import React, { useState, useEffect } from 'react';
import { getContract } from './utils/contract';
import ContentView from './ContentView';

function ContentList({ account }) {
  const { signer } = account;
  const [contents, setContents] = useState([]);

  // Fetch all content from the contract
  useEffect(() => {
    const fetchContents = async () => {
      try {
        const contract = getContract(signer);
        const contentCount = await contract.getContentCount();

        const contentArray = [];
        for (let i = 1; i <= contentCount; i++) {
          const content = await contract.getContent(i);
          contentArray.push(content);
        }

        setContents(contentArray);
      } catch (error) {
        console.error('Error fetching contents:', error);
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

    fetchContents();
  }, [signer]);

  return (
    <div className="content-list">
      <h2 className="section-title">Available Content</h2>
      {contents.map((content) => (
        <ContentView key={content.id} content={content} account={account} />
      ))}
    </div>
  );
}

export default ContentList;
