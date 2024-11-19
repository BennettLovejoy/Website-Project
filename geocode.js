// Improved geocoding function with rate limiting and error handling
class GeocodingService {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.rateLimit = 1000; // 1 request per second to respect API limits
    }

    async geocodeAddress(address) {
        const encodedAddress = encodeURIComponent(address);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
            }
            console.warn(`No results found for address: ${address}`);
            return null;
        } catch (error) {
            console.error(`Geocoding failed for ${address}:`, error);
            return null;
        }
    }

    async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        
        while (this.queue.length > 0) {
            const { school, resolve } = this.queue.shift();
            const address = `${school['Street Address']}, ${school['City']}, ${school['State']} ${school['ZIP']}`;
            
            const location = await this.geocodeAddress(address);
            resolve(location);
            
            await new Promise(resolve => setTimeout(resolve, this.rateLimit));
        }
        
        this.processing = false;
    }

    queueGeocode(school) {
        return new Promise(resolve => {
            this.queue.push({ school, resolve });
            this.processQueue();
        });
    }
}

const geocodingService = new GeocodingService();
