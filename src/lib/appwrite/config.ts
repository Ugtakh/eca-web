import { Client, Account, Avatars, Databases, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Your API Endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // Your project ID

const databases = new Databases(client);
const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

export { client, databases, account, avatars, storage };
