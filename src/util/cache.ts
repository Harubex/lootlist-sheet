import { log } from "../util";

/**
 * An object that centralizes cache key names.
 */
const cacheKeys = {
    lootDrops: "loot-drops",
    attendance: "attendance",
    lootLists: "loot-lists",
    alts: "alts"
};

/**
 * Clears the cache. Yeah.
 */
function cacheClear() {
    const cache = CacheService.getScriptCache();
    for (const key in cacheKeys) {
        cache.remove(cacheKeys[key]);
    }
}

/**
 * Retrieves data from the cache, attempting to convert it back into what it was originally.
 * @param name The key to retrieve data for.
 * @returns The data found, or null if nothing was found.
 */
function cacheGet<T>(name: string): T {
    const cache = CacheService.getScriptCache();
    const cacheItem = cache.get(name);
    if (cacheItem != null) {
        return JSON.parse(cacheItem);
    }
    return null;
}

/**
 * Attempts to store data, converting it to a string before doing so.
 * @param name The key to assign data for.
 * @param data The data to store.
 */
function cachePut(name: string, data: any): void {
    if (data === undefined || data === null) {
        throw new Error("Don't cache null/undefined values.");
    }
    const dataType = typeof data;
    let storedData = data;
    if (dataType === "object" || dataType === "number" || dataType === "boolean" || dataType === "string") {
        storedData = JSON.stringify(data);
    } else {
        throw new Error(`Why are you trying to cache a ${dataType}?`);
    }

    try {
        const cache = CacheService.getScriptCache();
        const cacheItem = cache.put(name, storedData, 600);
        if (cacheItem != null) {
            return cacheItem;
        }
    } catch (e) {
        log("Unable to cache data with length: " + String(storedData).length);
        log(e);
    }
}

/**
 * Attempts to return the cached value, running the provided function only if no cached value was found.
 * @param name The key to assign data for.
 * @param fn The function that generates the data to cache.
 */
function cached<T>(name: string, fn: () => T): T {
    const cachedItem = cacheGet<T>(name);
    if (cachedItem) {
        return cachedItem;
    }
    const res = fn();
    cachePut(name, res);
    return res;
}

export {
    cacheKeys,
    cachePut,
    cacheGet,
    cacheClear,
    cached
};
