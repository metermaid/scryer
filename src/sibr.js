import axios from 'axios';
import LodashPickBy from 'lodash/pickBy';
import LodashIdentity from 'lodash/identity';

export const getEvents = (params) => {
    const cleanedParams = LodashPickBy(params, LodashIdentity);
    return axios.get('https://cors-anywhere.herokuapp.com/https://api.blaseball-reference.com/v1/events', { params: cleanedParams })
        .then(response => response && response.data)
        .catch(/* istanbul ignore next */ error => Promise.reject(error));
};

export default {
    getEvents
};
