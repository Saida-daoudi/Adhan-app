export const getPrayerTimes = async (city, country) => {
    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
        if (!response.ok) {
            throw new Error('Failed to fetch prayer times');
        }
        const data = await response.json();
        if (data.code !== 200 || !data.data || !data.data.timings) {
            throw new Error('Invalid data received');
        }

        return data.data.timings; 
    } catch (error) {
        console.error(`Error fetching prayer times for ${city}, ${country}: ${error.message}`);
        return null; 
    }
};