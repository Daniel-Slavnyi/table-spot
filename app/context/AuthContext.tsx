'use client';

import React, { useState, createContext, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import axios from 'axios';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  phone: string;
}

interface State {
  loading: boolean;
  data: User | null;
  error: string | null;
}

interface AuthState extends State {
  setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

export const AuthenticationContext = createContext<AuthState>({
  loading: false,
  data: null,
  error: null,
  setAuthState: () => {},
});

export default function AuthContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState<State>({
    loading: true,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    setAuthState({ loading: true, data: null, error: null });

    try {
      const jwt = getCookie('jwt');

      if (!jwt) {
        return setAuthState({ loading: false, data: null, error: null });
      }

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

      setAuthState({ loading: false, data: data, error: null });
    } catch (error: any) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        ...authState,
        setAuthState,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
