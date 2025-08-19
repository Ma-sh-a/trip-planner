const CACHE_PREFIX = "trip-planner-";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа

export const cache = {
  set: (key: string, data: any) => {
    const item = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  },

  get: (key: string) => {
    const itemStr = localStorage.getItem(CACHE_PREFIX + key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return item.data;
  },
};
