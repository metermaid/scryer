import axios from 'axios';
import LodashGet from 'lodash/get';
import LodashFlatten from 'lodash/flatten';
import LodashSortBy from 'lodash/sortBy';

import { checkCache, cachePromise, cacheService } from './CachingManager';

export const getPlayers = (type) => {
    const bonusPlayers = getBonusPlayers(type);
    return getPlayersFromBlaseball(type).then(data => LodashSortBy(LodashFlatten(data).concat(bonusPlayers), ['name']));
};

export const getTeams = () => {
    const dataKey = 'allTeams';
    const cache = checkCache(dataKey);

    /* istanbul ignore next line */
    if (cache) { return cache; }

    const results = axios.get(`https://blaseball.com/database/allTeams`)
        .then(response => cacheService(dataKey, response && response.data));

    return cachePromise(dataKey, results);
};

export const getPlayersFromBlaseball = (type) => {
    return getTeams().then(response => {
        let teamPromises = response.map(team => processTeam(team, type));
        return Promise.all(teamPromises);
    });
};

const processTeam = (team, type) => {
    const dataKey = `${team.nickname}${type}Members`;
    const cache = checkCache(dataKey);

    /* istanbul ignore next line */
    if (cache) { return cache; }
    const ids = LodashGet(team, type).join(',');
    const results = axios.get(`https://blaseball.com/database/players`, { params: { ids: ids }})
        .then(response => 
            cacheService(dataKey, response && response.data && response.data.map(player => {
                return {
                    value: player._id,
                    name: player.name,
                    searchKey: `${player.name} ${player._id} ${team.nickname}`,
                    label: `${player.name} (${String.fromCodePoint(team.emoji)} ${team.nickname})`,
                    team: team.nickname
                };
            })));

    return cachePromise(dataKey, results);
};

export const getTeamEmojis = (team) => {

};



const getBonusPlayers = (type) => {
    switch (type) {
        default:
            return [];
    }
};

export default {
    getPlayers,
    getTeams
};
