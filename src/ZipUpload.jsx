// src/components/ZipUpload.js
import React, { useState } from 'react';
import JSZip from 'jszip';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';


function ZipUpload() {
  const [notFollowingBack, setNotFollowingBack] = useState([]);
  const [error, setError] = useState('');

  const extractJSON = async (zip, entryName) => {
    const entry = zip.file(entryName);
    if (!entry) return [];

    try {
      const data = await entry.async('string');
      return JSON.parse(data);
    } catch (e) {
      console.error(`Failed to parse JSON: ${e.message}`);
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
        followersData.map((v) => v.string_list_data[0]?.value || '')
      );

      const followingData = await extractJSON(
        zip,
        'connections/followers_and_following/following.json'
      );
      const following = new Set(
        followingData.relationships_following.map((v) => v.string_list_data[0]?.value || '')
      );

      const notFollowingBackList = [...following].filter((user) => !followers.has(user));
      setNotFollowingBack(notFollowingBackList);
      setError('');
    } catch (e) {
      setError(`Something went wrong: ${e.message}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <div className="flex items-center justify-center mb-4">
        <label
          htmlFor="upload"
          className="flex items-center cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <CloudArrowUpIcon className="h-6 w-6 mr-2" />
          Upload ZIP
        </label>
        <input
          id="upload"
          type="file"
          accept=".zip"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Not Following Back:
      </h2>
      <ul className="max-h-40 overflow-auto border rounded-md p-4 bg-gray-50 dark:bg-gray-700">
        {notFollowingBack.length > 0 ? (
          notFollowingBack.map((user, index) => (
            <li key={index} className="py-1 text-gray-800 dark:text-white">
              {user}
            </li>
          ))
        ) : (
          <li className="text-gray-500 dark:text-gray-400">No data available</li>
        )}
      </ul>
    </div>
  );
}

export default ZipUpload;
