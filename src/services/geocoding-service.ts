import { cache } from "../utils/cache";

export interface Coordinates {
  latitude: number;
  longitude: number;
  name: string;
}

export const geocodingService = {
  getCoordinates: async (locationName: string): Promise<Coordinates | null> => {
    const cached = cache.get(`coords-${locationName}`);
    if (cached) return cached;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`,
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const coords = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          name: data[0].display_name,
        };
        cache.set(`coords-${locationName}`, coords);
        return coords;
      }

      return null;
    } catch (error) {
      console.error("Ошибка геокодирования:", error);
      return null;
    }
  },

  getQuickCoordinates: (locationName: string): Coordinates | null => {
    const popularLocations: { [key: string]: Coordinates } = {
      рим: { latitude: 41.9028, longitude: 12.4964, name: "Рим, Италия" },
      париж: { latitude: 48.8566, longitude: 2.3522, name: "Париж, Франция" },
      лондон: {
        latitude: 51.5074,
        longitude: -0.1278,
        name: "Лондон, Великобритания",
      },
      берлин: { latitude: 52.52, longitude: 13.405, name: "Берлин, Германия" },
      прага: { latitude: 50.0755, longitude: 14.4378, name: "Прага, Чехия" },
      москва: { latitude: 55.7558, longitude: 37.6173, name: "Москва, Россия" },
      "нью-йорк": {
        latitude: 40.7128,
        longitude: -74.006,
        name: "Нью-Йорк, США",
      },
      токио: { latitude: 35.6762, longitude: 139.6503, name: "Токио, Япония" },
      италия: { latitude: 41.8719, longitude: 12.5674, name: "Италия" },
      франция: { latitude: 46.6034, longitude: 1.8883, name: "Франция" },
      германия: { latitude: 51.1657, longitude: 10.4515, name: "Германия" },
      испания: { latitude: 40.4637, longitude: -3.7492, name: "Испания" },
    };

    const lowerCaseLocation = locationName.toLowerCase();

    if (popularLocations[lowerCaseLocation]) {
      return popularLocations[lowerCaseLocation];
    }

    for (const [key, coords] of Object.entries(popularLocations)) {
      if (lowerCaseLocation.includes(key)) {
        return coords;
      }
    }

    return null;
  },
};
