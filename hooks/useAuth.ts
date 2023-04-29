import axios from 'axios';
import { useContext } from 'react';
import { AuthenticationContext } from '../app/context/AuthContext';
import { removeCookies } from 'cookies-next';

const useAuth = () => {
  const { setAuthState } = useContext(AuthenticationContext);

  const signin = async (
    { email, password }: { email: string; password: string },
    handleClose: () => void
  ) => {
    setAuthState({ loading: true, data: null, error: null });
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
        {
          email,
          password,
        }
      );
      setAuthState({ loading: false, data: data, error: null });
      handleClose();
    } catch (error: any) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
    }
  };

  const signup = async (
    {
      firstName,
      lastName,
      email,
      phone,
      city,
      password,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      city: string;
      password: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({ loading: true, data: null, error: null });

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        {
          firstName,
          lastName,
          email,
          phone,
          city,
          password,
        }
      );
      setAuthState({ loading: false, data: data, error: null });
      handleClose();
    } catch (error: any) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
    }
  };

  const signout = () => {
    removeCookies('jwt');

    setAuthState({ loading: false, data: null, error: null });
  };

  return {
    signin,
    signup,
    signout,
  };
};

export default useAuth;
