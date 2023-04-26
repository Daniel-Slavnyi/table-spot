import axios from 'axios';
import { useState } from 'react';

export default function useReservation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = async ({
    slug,
    partySize,
    day,
    time,
    bookerEmail,
    bookerPhone,
    bookerFirstName,
    bookerLastName,
    bookerOccasion,
    bookerRequest,
  }: {
    slug: string;
    partySize: string;
    day: string;
    time: string;
    bookerEmail: string;
    bookerPhone: string;
    bookerFirstName: string;
    bookerLastName: string;
    bookerOccasion: string;
    bookerRequest: string;
  }) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/reserve/${slug}/availability`,
        {
          bookerEmail,
          bookerPhone,
          bookerFirstName,
          bookerLastName,
          bookerOccasion,
          bookerRequest,
        },
        {
          params: {
            partySize,
            day,
            time,
          },
        }
      );
      setIsLoading(false);
      setError(null);
      return data;
    } catch (error: any) {
      setIsLoading(false);
      setError(error.response.data.errorMessage);
    }
  };

  return {
    isLoading,
    error,
    createReservation,
  };
}
