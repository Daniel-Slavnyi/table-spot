'use client';

import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { partySize as partySizes, times } from '../../../../data';
import DatePicker from 'react-datepicker';

import useAvailabilities from '../../../../hooks/useAvailabilities';
import Link from 'next/link';
import {
  convertToDisplayTime,
  Time,
} from '../../../../utils/convertToDisplayTime';

export default function ReservationCard({
  openTime,
  closeTime,
  slug,
}: {
  openTime: string;
  closeTime: string;
  slug: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState(openTime);
  const [partySize, setPartySize] = useState('2');
  const [day, setDay] = useState(new Date().toISOString().split('T')[0]);
  const { isLoading, error, data, fetchAvailabilities } = useAvailabilities();
  console.log('data', data);

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split('T')[0]);
      return setSelectedDate(date);
    }
    return setSelectedDate(null);
  };

  const handleClick = () => {
    fetchAvailabilities({ slug, time, partySize, day });
  };

  const filterTimeByRestaurantOpenWindow = () => {
    const timesWithinWindow: typeof times = [];

    let isWithinWindow = false;

    times.forEach(item => {
      if (item.time === openTime) {
        isWithinWindow = true;
      }

      if (isWithinWindow) {
        timesWithinWindow.push(item);
      }

      if (item.time === closeTime) {
        isWithinWindow = false;
      }
    });

    return timesWithinWindow;
  };

  return (
    <div className="fixed max-lg:static w-[15%] max-lg:w-[100%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name=""
          className="py-3 border-b font-light"
          id=""
          value={partySize}
          onChange={e => {
            setPartySize(e.target.value);
          }}
        >
          {partySizes.map(item => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleChangeDate}
            className="border-b py-3 font-light text-reg w-24"
            dateFormat={'MMMM d'}
            wrapperClassName="w-[48%]"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            name=""
            id=""
            className="py-3 border-b font-light"
            value={time}
            onChange={e => {
              setTime(e.target.value);
            }}
          >
            {filterTimeByRestaurantOpenWindow().map(item => (
              <option key={item.time} value={item.time}>
                {item.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress className="text-white" />
          ) : (
            'Find a Time'
          )}
        </button>
      </div>
      {data && data.length ? (
        <div className="mt-4">
          <p className="text-reg">Select a time</p>
          <div className="flex flex-wrap mt-2">
            {data.map(item => {
              return item.available ? (
                <Link
                  key={item.time}
                  href={`/reserve/${slug}?date=${day}T${item.time}&partySize=${partySize}`}
                  className="bg-red-600 cursos-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
                >
                  <p className="text-sm font-bold">
                    {convertToDisplayTime(item.time as Time)}
                  </p>
                </Link>
              ) : (
                <div
                  key={item.time}
                  className="bg-gray-300 p-2 w-24 mb-3 mr-3 rounded"
                ></div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
