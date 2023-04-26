import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import { findAvailableTables } from '../../../../services/restaurant/findAvailableTables';

const prisma = new PrismaClient();

export default async function hendler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    const {
      bookerEmail,
      bookerPhone,
      bookerFirstName,
      bookerLastName,
      bookerOccasion,
      bookerRequest,
    } = req.body;

    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validator.isLength(bookerFirstName, {
          min: 1,
          max: 20,
        }),
        errorMessage: 'First name is invalid',
      },
      {
        valid: validator.isLength(bookerLastName, {
          min: 1,
          max: 20,
        }),
        errorMessage: 'Last name is invalid',
      },
      {
        valid: validator.isEmail(bookerEmail),
        errorMessage: 'Email is invalid',
      },
      {
        valid: validator.isMobilePhone(bookerPhone),
        errorMessage: 'Mobile phone is invalid',
      },
    ];

    validationSchema.forEach(cheked => {
      if (!cheked.valid) {
        errors.push(cheked.errorMessage);
      }
    });

    if (errors.length) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
        id: true,
      },
    });

    if (!restaurant) {
      return res.status(400).json({ errorMessage: 'Restaurant is not found' });
    }

    if (
      new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
      new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
    ) {
      return res
        .status(400)
        .json({ errorMessage: 'Restaurant is not opened at that time' });
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

    const serchTimeWithTables = serchTimesWithTables.find(item => {
      return (
        item.date.toISOString() === new Date(`${day}T${time}`).toISOString()
      );
    });

    if (!serchTimeWithTables) {
      return res
        .status(400)
        .json({ errorMessage: 'Not availability, cannot book' });
    }

    const tableCount: { 2: number[]; 4: number[] } = { 2: [], 4: [] };

    serchTimeWithTables.tabels.forEach(item => {
      if (item.seats === 2) {
        tableCount[2].push(item.id);
      } else {
        tableCount[4].push(item.id);
      }
    });

    const tablesToBooks: number[] = [];
    let seatsRemaining = parseInt(partySize);

    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tableCount[4].length) {
          tablesToBooks.push(tableCount[4][0]);
          tableCount[4].shift();
          seatsRemaining = seatsRemaining - 4;
        } else {
          tablesToBooks.push(tableCount[2][0]);
          tableCount[2].shift();
          seatsRemaining = seatsRemaining - 2;
        }
      } else {
        if (tableCount[2].length) {
          tablesToBooks.push(tableCount[2][0]);
          tableCount[2].shift();
          seatsRemaining = seatsRemaining - 4;
        } else {
          tablesToBooks.push(tableCount[4][0]);
          tableCount[4].shift();
          seatsRemaining = seatsRemaining - 4;
        }
      }
    }

    const booking = await prisma.booking.create({
      data: {
        number_of_people: parseInt(partySize),
        booking_time: new Date(`${day}T${time}`),
        booker_email: bookerEmail,
        booker_phone: bookerPhone,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        booker_occasion: bookerOccasion,
        booker_request: bookerRequest,
        restaurant_id: restaurant.id,
      },
    });

    const bookingsOnTablesData = tablesToBooks.map(item => {
      return {
        table_id: item,
        booking_id: booking.id,
      };
    });

    await prisma.bookingsOnTables.createMany({
      data: bookingsOnTablesData,
    });

    return res.json({ booking });
  }
}

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-02-03&time=15:00:00.000Z&partySize=8
