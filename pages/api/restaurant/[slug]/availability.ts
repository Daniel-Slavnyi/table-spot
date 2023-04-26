import { NextApiRequest, NextApiResponse } from 'next';
import { times } from '../../../../data';
import { PrismaClient } from '@prisma/client';
import { findAvailableTables } from '../../../../services/restaurant/findAvailableTables';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { slug, partySize, day, time } = req.query as {
      slug: string;
      partySize: string;
      day: string;
      time: string;
    };

    if (!partySize || !day || !time) {
      return res.status(400).json({ errorMessage: 'Invalid data provider' });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
      },
    });

    if (!restaurant) {
      return res.status(400).json({ errorMessage: 'Invalid data provider' });
    }

    const serchTimesWithTables = await findAvailableTables({
      time,
      day,
      restaurant,
      res,
    });

    if (!serchTimesWithTables) {
      return res.status(400).json({ errorMessage: 'Invalid data provider' });
    }

    const availabilities = serchTimesWithTables
      .map(item => {
        const sumSeats = item.tabels.reduce((sum, table) => {
          return sum + table.seats;
        }, 0);

        return {
          time: item.time,
          available: sumSeats >= parseInt(partySize),
        };
      })
      .filter(item => {
        const timeIsAfterOpeninHour =
          new Date(`${day}T${item.time}`) >=
          new Date(`${day}T${restaurant.open_time}`);
        const timeIsBeforeOpeninHour =
          new Date(`${day}T${item.time}`) <=
          new Date(`${day}T${restaurant.close_time}`);

        return timeIsAfterOpeninHour && timeIsBeforeOpeninHour;
      });

    return res.json(availabilities);
  }
}
