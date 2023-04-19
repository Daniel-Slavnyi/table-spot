import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../app/data";

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

    return res.json({searchTime})
}
