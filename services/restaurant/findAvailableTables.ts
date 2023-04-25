import { PrismaClient, Table } from '@prisma/client';
import { times } from '../../data';
import { NextApiResponse } from 'next';

const prisma = new PrismaClient();

export const findAvailableTables = async ({
  time,
  day,
  restaurant,
  res,
}: {
  time: string;
  day: string;
  restaurant: {
    tables: Table[];
    open_time: string;
    close_time: string;
  };
  res: NextApiResponse;
}) => {
  const searchTime = times.find(item => {
    return item.time === time;
  })?.searchTimes;

  if (!searchTime) {
    return res.status(400).json({ errorMessage: 'Invalid data provider' });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTime[0]}`),
        lte: new Date(`${day}T${searchTime[searchTime.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tabels: true,
    },
  });

  const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};

  bookings.forEach(item => {
    bookingTablesObj[item.booking_time.toISOString()] = item.tabels.reduce(
      (obj, table) => {
        return {
          ...obj,
          [table.table_id]: true,
        };
      },
      {}
    );
  });

  const tabels = restaurant.tables;

  const serchTimesWithTables = searchTime.map(item => {
    return {
      date: new Date(`${day}T${item}`),
      time: item,
      tabels,
    };
  });

  serchTimesWithTables.forEach(item => {
    item.tabels = item.tabels.filter(table => {
      if (bookingTablesObj[item.date.toISOString()]) {
        if (bookingTablesObj[item.date.toISOString()][table.id]) return false;
      }
      return true;
    });
  });

  return serchTimesWithTables;
};
