'use client';

import React, { useEffect, useState } from 'react';
import useReservation from '../../../../hooks/useReservation';
import CircularProgress from '@mui/material/CircularProgress';

export default function Form({
  slug,
  date,
  partySize,
}: {
  slug: string;
  date: string;
  partySize: string;
}) {
  const [disabled, setDisabled] = useState(true);
  const [didBook, setDidBook] = useState(false);
  const [inputs, setInputs] = useState({
    bookerEmail: '',
    bookerPhone: '',
    bookerFirstName: '',
    bookerLastName: '',
    bookerOccasion: '',
    bookerRequest: '',
  });

  const { isLoading, error, createReservation } = useReservation();
  const [day, time] = date?.split('T');

  useEffect(() => {
    if (
      inputs.bookerEmail &&
      inputs.bookerFirstName &&
      inputs.bookerLastName &&
      inputs.bookerPhone
    ) {
      return setDisabled(false);
    }

    return setDisabled(true);
  }, [inputs]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async () => {
    const booking = await createReservation({
      slug,
      partySize,
      day,
      time,
      bookerEmail: inputs.bookerEmail,
      bookerPhone: inputs.bookerPhone,
      bookerFirstName: inputs.bookerFirstName,
      bookerLastName: inputs.bookerLastName,
      bookerOccasion: inputs.bookerOccasion,
      bookerRequest: inputs.bookerRequest,
      setDidBook,
    });
  };

  return (
    <div className="mt-10 flex flex-wrap justify-between w-[660px] max-md:w-[100%]">
      {didBook ? (
        <div>
          <h2>You are all booked up</h2>
          <p>Enjoy your reservation</p>
        </div>
      ) : (
        <>
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="First name"
            name="bookerFirstName"
            value={inputs.bookerFirstName}
            onChange={handleInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Last name"
            name="bookerLastName"
            value={inputs.bookerLastName}
            onChange={handleInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Phone number"
            name="bookerPhone"
            value={inputs.bookerPhone}
            onChange={handleInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Email"
            name="bookerEmail"
            value={inputs.bookerEmail}
            onChange={handleInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Occasion (optional)"
            name="bookerOccasion"
            value={inputs.bookerOccasion}
            onChange={handleInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Requests (optional)"
            name="bookerRequest"
            value={inputs.bookerRequest}
            onChange={handleInput}
          />
          <button
            disabled={disabled || isLoading}
            className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
            onClick={handleClick}
          >
            {isLoading ? <CircularProgress /> : 'Complete reservation'}
          </button>
          <p className="mt-4 text-sm">
            By clicking “Complete reservation” you agree to the OpenTable Terms
            of Use and Privacy Policy. Standard text message rates may apply.
            You may opt out of receiving text messages at any time.
          </p>
        </>
      )}
    </div>
  );
}
