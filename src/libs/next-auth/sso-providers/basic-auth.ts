/* eslint-disable sort-keys-fix/sort-keys-fix */
import CredentialsProvider from 'next-auth/providers/credentials';

import { authEnv } from '@/config/auth';

import { CommonProviderConfig } from './sso.config';

const provider = {
  id: 'basic-auth',
  provider: CredentialsProvider({
    ...CommonProviderConfig,
    authorize: async (credentials) => {
      const res = await fetch(
        authEnv.BASIC_AUTH_API_URL as string,
        {
          body: JSON.stringify({
            password: credentials.password,
            username: credentials.username,
          }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        },
      );

      const user = await res.json();

      // If no error and we have user data, return it
      if (res.ok && user && user.success) {
        return user;
      }
      // Return null if user data could not be retrieved
      return null;
    },

    credentials: {
      username: { label: 'Username', type: 'text' },
      password: { label: 'Password', type: 'password' },
    },

    name: 'Basic Auth',
  }),
};

export default provider;
