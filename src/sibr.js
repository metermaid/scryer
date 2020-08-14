import axios from 'axios';
import LodashPickBy from 'lodash/pickBy';
import LodashIdentity from 'lodash/identity';
import { checkCache, cachePromise, cacheService } from './CachingManager';

export const getEvents = (params) => {
    const cleanedParams = LodashPickBy(params, LodashIdentity);
    const dataKey = JSON.stringify(cleanedParams);
    const cache = checkCache(dataKey);

    /* istanbul ignore next line */
    if (cache) { return cache; }

    const results = axios.get('https://cors-anywhere.herokuapp.com/https://api.blaseball-reference.com/v1/events', { params: cleanedParams })
        .then(response => cacheService(dataKey, response && response.data))
        .catch(/* istanbul ignore next */ error => Promise.reject(error));

    return cachePromise(dataKey, results);
};

export default {
    getEvents
};
