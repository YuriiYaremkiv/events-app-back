import { Storage } from '@google-cloud/storage';
import * as dotenv from 'dotenv';
dotenv.config();

export const storage = new Storage({
  projectId: process.env.STORAGE_PROJECT_ID,
  credentials: {
    client_email: process.env.STORAGE_CLIENT_EMAIL,
    private_key: process.env.STORAGE_PRIVATE_KEY,
  },
});

export const cloudConfig = {
  publicImagePath: (bucketName: string, fileName: string) =>
    `https://storage.googleapis.com/${bucketName}/${fileName}`,
  publicImagePathDefault:
    'https://storage.googleapis.com/chat-connect/avatar/no-user-image.jpg',
  publicToPrivatePath: (fileName) => {
    const fileCloudName = fileName.slice(fileName.lastIndexOf('/') + 1);
    return fileCloudName;
  },
};
