import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../data";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
    const { slug, partySize, day, time } = req.query as { slug: string; partySize: string; day: string; time: string }
    
    if (!partySize || !day || !time) {
        return res.status(400).json({errorMessage: "Invalid data provider"})
    }

    const searchTime = times.find(item => {
        return item.time === time
    })?.searchTimes

    if (!searchTime) {
        return res.status(400).json({errorMessage: "Invalid data provider"})
    }

    const bookings = await prisma.booking.findMany({
        where: {
            booking_time: {
                gte: new Date(`${day}T${searchTime[0]}`),
                lte: new Date(`${day}T${searchTime[searchTime.length - 1]}`)
            }
        },
        select: {
            number_of_people: true,
            booking_time: true,
            tabels: true
        }
    })

    const bookingTablesObj: { [key: string]: { [key: number]: true } } = {}
    
    bookings.forEach(item => {
        bookingTablesObj[item.booking_time.toISOString()] = item.tabels.reduce((obj, table) => {
            return {
                ...obj,
                [table.table_id]: true
            }
        }, {})
    })

    const restaurant = await prisma.restaurant.findUnique({
        where: {
            slug
        },
        select: {
            tables: true,
            open_time: true,
            close_time: true
        }
    })

    if (!restaurant) {
        return res.status(400).json({errorMessage: "Invalid data provider"})
    }

    const tabels = restaurant.tables;

    const serchTimesWithTables = searchTime.map(item => {
        return {
            date: new Date(`${day}T${item}`),
            time: item,
            tabels
        }
    })

    serchTimesWithTables.forEach(item => {
        item.tabels = item.tabels.filter(table => {
            if (bookingTablesObj[item.date.toISOString()]) {
                 if(bookingTablesObj[item.date.toISOString()][table.id]) return false
            }
            return true
        })
    })

    const availabilities = serchTimesWithTables.map(item => {
        const sumSeats = item.tabels.reduce((sum, table) => {
            return sum + table.seats
        }, 0)

        return {
            time: item.time,
            available: sumSeats >= parseInt(partySize)
        }
    }).filter(item => {
        const timeIsAfterOpeninHour = new Date(`${day}T${item.time}`) >= new Date(`${day}T${restaurant.open_time}`)
        const timeIsBeforeOpeninHour = new Date(`${day}T${item.time}`) <= new Date(`${day}T${restaurant.close_time}`)

        return timeIsAfterOpeninHour && timeIsBeforeOpeninHour 
    })

    return res.json({availabilities})
}
