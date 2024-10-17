import React, { useState } from 'react';
import JSZip from 'jszip';

function ZipUpload() {
  const [notFollowingBack, setNotFollowingBack] = useState([]);
  const [error, setError] = useState('');

  const extractJSON = async (zip, entryName) => {
    const entry = zip.file(entryName);
    if (!entry) {
      console.warn(`Entry ${entryName} not found.`);
      return [];
    }

    try {
      const data = await entry.async('string');
      return JSON.parse(data);
    } catch (e) {
      console.error(`Failed to parse JSON from ${entryName}: ${e.message}`);
      return [];
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const zip = await JSZip.loadAsync(file);

      const followersData = await extractJSON(
        zip,
        'connections/followers_and_following/followers_1.json'
      );
      const followers = new Set(
        followersData.map((value) => value.string_list_data[0]?.value || '')
      );

      const followingData = await extractJSON(
        zip,
        'connections/followers_and_following/following.json'
      );
      const following = new Set(
        followingData.relationships_following.map(
          (value) => value.string_list_data[0]?.value || ''
        )
      );

      const notFollowingBackList = [...following].filter(
        (user) => !followers.has(user)
      );
      setNotFollowingBack(notFollowingBackList);
      setError('');
    } catch (e) {
      setError(`Something went wrong: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Instagram Follow Checker
        </h1>
        <input
          type="file"
          accept=".zip"
          onChange={handleFileUpload}
          className="mb-4 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <h2 className="text-xl font-semibold mt-6 mb-4">
          Not Following Back:
        </h2>
        <ul className="max-h-40 overflow-auto border rounded-md p-4">
          {notFollowingBack.map((user, index) => (
            <li key={index} className="text-gray-800 py-1">
              {user}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ZipUpload;
