import { cacheKey, loadData, saveData } from './LocalStorage';

const cacheTTL = 60000;

let cachedPromises = {};
let cachedServices = {};

const checkCachedPromises = (dataKey) => cachedPromises[dataKey + 'Promise'];

const resetCachedPromise = (dataKey) => {
    cachedPromises[dataKey + 'Promise'] = false;
};

const checkCachedServices = (dataKey) => {
    const inMemoryCache = cachedServices && cachedServices[dataKey];
    const inMemoryData = inMemoryCache && inMemoryCache.data;
    const currentTime = Date.parse(new Date());

    if (inMemoryCache && currentTime <= inMemoryCache.expires) {
        return inMemoryData;
    } else {
        const localStore = loadData(cacheKey);

        const localCache = localStore && localStore[dataKey];
        const localData = localCache && localCache.data;

        if (localData && Date.parse(new Date()) <= localCache.expires) {
            localStore && Object.entries(localStore).forEach(([key, storageItem]) => {
                if (!cachedServices[key] || currentTime <= storageItem.expires) {
                    cachedServices[key] = storageItem;
                }
            });

            return localData;
        }
    }
    return false;
};

export function checkCache (dataKey) {
    const cachedService = checkCachedServices(dataKey);

    if (cachedService) {
        return Promise.resolve(cachedService);
    }

    return checkCachedPromises(dataKey) || false;
}

export function cachePromise (dataKey, promise) {
    cachedPromises[dataKey + 'Promise'] = promise;
    return promise;
}

export function cacheService (dataKey, data) {
    if (!data) { return data; }

    const now = new Date();
    const cacheData = {
        data: data,
        expires: now.setSeconds(now.getSeconds() + cacheTTL)
    };

    const originalCacheData = loadData(cacheKey);
    const newCache = Object.assign({}, originalCacheData, {[dataKey]: cacheData});
    saveData(cacheKey, newCache);
    cachedServices[dataKey] = cacheData;

    resetCachedPromise(dataKey);

    return data;
}

export default {
    cachePromise,
    cacheService,
    checkCache
};
