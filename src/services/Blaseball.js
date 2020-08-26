import axios from 'axios';
import LodashGet from 'lodash/get';
import LodashFlatten from 'lodash/flatten';
import LodashSortBy from 'lodash/sortBy';
import LodashUniq from 'lodash/uniq';

import { bonusPlayers, backupPlayers } from './Players';
import { checkCache, cachePromise, cacheService } from './CachingManager';

export const getPlayers = (type) => {
    return getPlayersFromBlaseball(type).then(data => LodashSortBy(LodashFlatten(data), ['name'])).catch((error) => getBackupPlayers(type));
};

export const getGames = (season, day) => {
    const dataKey = 'games' + season + day;
    const cache = checkCache(dataKey);

    /* istanbul ignore next line */
    if (cache) { return cache; }

    const results = axios.get(`https://cors-anywhere.herokuapp.com/https://blaseball.com/database/games`, { params: { season, day }})
        .then(response => cacheService(dataKey, response && response.data));

    return cachePromise(dataKey, results);
};

export const getTeams = () => {
    const dataKey = 'allTeams';
    const cache = checkCache(dataKey);

    /* istanbul ignore next line */
    if (cache) { return cache; }

    const results = axios.get(`https://cors-anywhere.herokuapp.com/https://blaseball.com/database/allTeams`)
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
    const results = axios.get(`https://cors-anywhere.herokuapp.com/https://blaseball.com/database/players`, { params: { ids: ids }})
        .then(response => 
            cacheService(dataKey, 
                response && response.data && LodashUniq(response.data.map(player => getPlayerObject(player, team)).concat(getBonusPlayers(team, type)))
            ));

    return cachePromise(dataKey, results);
};

export const getPlayerObject = (player, team) => {
    return {
        value: player.id,
        name: player.name,
        searchkey: `${player.name} ${player.id} ${team.nickname}`,
        label: `${player.name} (${String.fromCodePoint(team.emoji)} ${team.nickname})`,
        team: team.fullName
    };
};

const getBackupPlayers = (type) => {
    return backupPlayers.filter(player => !player.position.localeCompare(type)).map(player => ({
        value: player.id,
        name: player.name,
        searchkey: `${player.name} ${player.id}`,
        label: `${player.name}`,
        team: player.team
    }));
};

const getBonusPlayers = (team, type) => {
    return bonusPlayers.filter(player => !player.team.localeCompare(team.fullName) && !player.position.localeCompare(type))
        .map(player => getPlayerObject(player, team));
};

export default {
    getPlayers,
    getTeams,
    getGames
};
