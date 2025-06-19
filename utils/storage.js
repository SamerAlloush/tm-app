// utils/storage.js
//import { storage } from '../firebase/firebaseConfig';
//import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;
console.log('Upload API URL:', apiUrl); // Debug log

export const uploadFile = async (path, fileUri) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: path.split('/').pop(),
      type: 'application/octet-stream',
    });
    formData.append('path', path);
    const response = await fetch(`${apiUrl}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload file');
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};