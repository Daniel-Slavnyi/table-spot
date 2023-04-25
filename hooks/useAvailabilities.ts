import axios from "axios";
import { useState } from "react";

export default function useAvailabilities() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState<{ time: string, available: boolean }[] | null>(null)

    const fetchAvailabilities = async ({ slug, partySize, day, time }:
        { slug: string, partySize: string, day: string, time: string }) => {
        setIsLoading(true)
        try {
        const { data } = await axios.get(`http://localhost:3000/api/restaurant/${slug}/availability`, {
            params: {
                partySize,
                day,
                time
            }
        })
            setIsLoading(false)
            setError(null)
            setData(data)
    } catch (error: any) {
            setIsLoading(false)
            setError(error.response.data.errorMessage)
    }
    }

    return {
        isLoading,
        error,
        data,
        fetchAvailabilities
    }
}

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?partySize=4&day=2023-04-21&time=23:30:00.000Z