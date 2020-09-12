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
    decodeCache = {};
    const cache = CacheService.getScriptCache();
    for (const key in cacheKeys) {
        cache.remove(cacheKeys[key]);
        // jank, make dynamic
        for (let chunk = 0; chunk < 10; chunk++) {
            cache.remove(cacheKeys[key] + "-" + chunk);
        }
    }
}

let decodeCache = {};

/**
 * Retrieves data from the cache, attempting to convert it back into what it was originally.
 * @param name The key to retrieve data for.
 * @returns The data found, or null if nothing was found.
 */
function cacheGet<T>(name: string): T {
    const cache = CacheService.getScriptCache();
    let cacheItem = cache.get(name);
    if (decodeCache[name]) {
        //log("cached item " + name + ": " + decodeCache[name])
        return decodeCache[name];
    } else if (cacheItem != null) {
        return (decodeCache[name] = JSON.parse(cacheItem));
    } else {
        const chunks: string[] = [];
        cacheItem = cache.get(name + "-1");
        for (let chunk = 1; cacheItem != null; chunk++, cacheItem = cache.get(name + "-" + chunk)) {
            log(chunk + " chunk");
            log(cacheItem.substr(0, 50).trim());
            chunks.push(cacheItem);
        }
        if (chunks.length > 0) {
            const joined = chunks.join("");
            log(joined.substr(joined.length - 50))
            return (decodeCache[name] = JSON.parse(joined));
        }
    }
    return null;
}

/**
 * Attempts to store data, converting it to a string before doing so.
 * @param name The key to assign data for.
 * @param data The data to store.
 */
function cachePut(name: string, data: any, chunk = 0): void {
    if (data === undefined || data === null) {
        throw new Error("Don't cache null/undefined values.");
    }
    const dataType = typeof data;
    let storedData = data;
    if (dataType === "object" || dataType === "number" || dataType === "boolean") {
        storedData = JSON.stringify(data);
    } else if (dataType !== "string") {
        throw new Error(`Why are you trying to cache a ${dataType}?`);
    }

    try {
        const cache = CacheService.getScriptCache();
        const keyName = chunk > 0 ? name + "-" + chunk : name;

        log("Adding key " + keyName);
        const cacheItem = cache.put(keyName, storedData, 600);
        if (cacheItem != null) {
            return cacheItem;
        }
    } catch (e) {
        const dataString = String(storedData);
        log("Unable to cache data '" + name + "' with length: " + dataString.length);
        log(e);

        const half = Math.ceil(dataString.length / 2);
        const first = dataString.substring(0, half);
        const second = dataString.substring(half);
        cachePut(name, first, chunk + 1);
        cachePut(name, second, chunk + 2);
    }
}

/**
 * Attempts to return the cached value, running the provided function only if no cached value was found.
 * @param name The key to assign data for.
 * @param fn The function that generates the data to cache.
 */
function cached<T>(name: string, fn: () => T): T {
    try {
        const cachedItem = cacheGet<T>(name);
        if (cachedItem) {
            return cachedItem;
        }
    } catch (e) {
        log("Caching fucked up: " + e);
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
