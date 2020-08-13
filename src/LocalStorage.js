/**
 * Sonata Protomatter config keys
 */
export const configKey = 'config';
export const cacheKey = 'cache';

/**
 * Clear localStorage cache
 */
export const clearCache = () => {
    localStorage.removeItem(cacheKey);
};

/**
 * Load Application state
 */
export const loadState = () => {
    return loadData(stateKey);
};

/**
 * Save Application state
 */
export const saveState = (state) => {
    clearCache();

    // Save new state
    saveData(stateKey, state);
};

/**
 * Load data from local storage via data key
 * @param {*} key
 */
export const loadData = (key) => {
    try {
        const serializedData = localStorage.getItem(key);

        if (serializedData === null) {
            return undefined;
        }

        return JSON.parse(serializedData);
    } catch (error) {
        return undefined;
    }
};

/**
 * Save data to local storage
 * @param {*} key
 * @param {*} data
 */
export const saveData = (key, data) => {
    try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
    } catch (error) {
        /* istanbul ignore next line */
        return error;
    }
};
