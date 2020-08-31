import axios from 'axios';
import LodashGet from 'lodash/get';
import LodashFlatten from 'lodash/flatten';
import LodashSortBy from 'lodash/sortBy';
import LodashUniqBy from 'lodash/uniqBy';
import AllTeams from './../backups/allTeams';
import BackupBatters from './../backups/BackupBatters';
import BackupPitchers from './../backups/BackupPitchers';

import { checkCache, cachePromise, cacheService } from './CachingManager';

const backups = {
    'lineup': BackupBatters,
    'rotation': BackupPitchers
}

export const getPlayers = (type) => {
    return getPlayersFromBlaseball(type).then(data => cacheService(type + 'Players', LodashSortBy(LodashFlatten(data), ['name'])));
};

export const getGames = (season, day) => {
    const dataKey = 'games' + season + day;
    const cache = checkCache(dataKey);

    /* istanbul ignore next line */
    if (cache) { return cache; }

    const results = axios.get(`https://blaseballcors.herokuapp.com/https://www.blaseball.com/database/games`, { params: { season, day }})
        .then(response => cacheService(dataKey, response && response.data.map(game => parseGameObject(game))));

    return cachePromise(dataKey, results);
};

export const getTeams = () => {
    const dataKey = 'allTeams';
    const cache = checkCache(dataKey);

    /* istanbul ignore next line */
    if (cache) { return cache; }

    const results = axios.get(`https://blaseballcors.herokuapp.com/https://www.blaseball.com/database/allTeams`)
        .then(response => cacheService(dataKey, response && response.data))
        .catch((error) => {
            console.log(error);
            return AllTeams;
        });

    return cachePromise(dataKey, results);
};

export const getPlayersFromBlaseball = (type) => {
    return getTeams().then(response => {
        let teamPromises = response.map(team => processTeam(team, type));
        return Promise.all(teamPromises);
    });
};

const processTeam = (team, type) => {
    const dataKey = `${team.nickname}-${type}`;
    const cache = checkCache(dataKey);

    /* istanbul ignore next line */
    if (cache) { return cache; }
    const ids = LodashGet(team, type).join(',');
    const results = axios.get(`https://blaseballcors.herokuapp.com/https://www.blaseball.com/database/players`, { params: { ids: ids }})
        .then(response => 
            cacheService(dataKey, 
                response && response.data && LodashUniqBy(response.data.map(player => getPlayerObject(player, team, type)).concat(getBonusPlayers(backups[type], team, type)), 'id')
            ))
        .catch((error) => {
            console.log(error);
            return getBonusPlayers(backups[type], team, type);
        });

    return cachePromise(dataKey, results);
};

export const parseGameObject = (game) => {
    return {
        ...game,
        match: `${String.fromCodePoint(game.homeTeamEmoji)} ${game.homeTeamNickname} - ${String.fromCodePoint(game.awayTeamEmoji)} ${game.awayTeamNickname}`
    };
};

export const getPlayerObject = (player, team, type) => {
    return {
        ...player,
        label: `${player.name} (${String.fromCodePoint(team.emoji)} ${team.nickname})`,
        position: type,
        value: player.id,
        searchkey: `${player.name} ${player.id} ${team.nickname}`,
        team: team.fullName
    };
};

const getBonusPlayers = (playerList, team, type) => {
    return playerList.filter(player => !player.team.localeCompare(team.fullName) && !player.position.localeCompare(type))
        .map(player => getPlayerObject(player, team));
};

export default {
    getPlayers,
    getTeams,
    getGames
};
