import axios from 'axios';
import LodashGet from 'lodash/get';
import LodashFind from 'lodash/find';
import LodashFlatten from 'lodash/flatten';
import LodashPick from 'lodash/pick';
import LodashSortBy from 'lodash/sortBy';
import LodashUniqBy from 'lodash/uniqBy';
import AllTeams from './../backups/allTeams';
import { weatherTypes } from './../config/EventsConfig';
import { checkCache, cachePromise, cacheService } from './CachingManager';

export const getPlayers = (type) => {
    return getPlayersFromBlaseball(type).then(data => cacheService(type + 'Players', LodashSortBy(LodashFlatten(data), ['name'])));
};

export const getGames = (season, day) => {
    const dataKey = 'games' + season + day;
    const cache = checkCache(dataKey);
    let results;

    /* istanbul ignore next line */
    if (cache) { return cache; }
    results = axios.get(`https://cors-proxy.blaseball-reference.com/database/games`, { params: { season, day }})
        .then(response => cacheService(dataKey, response && response.data.map(game => parseGameObject(game))));

    return cachePromise(dataKey, results);
};

export const getTeams = () => {
    const dataKey = 'allTeams';
    const cache = checkCache(dataKey);

    /* istanbul ignore next line */
    if (cache) { return cache; }

    const results = axios.get(`https://cors-proxy.blaseball-reference.com/database/allTeams`)
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
    const ids = LodashGet(team, type).concat(getBonusPlayers(team, type)).join(',');
    const results = axios.get(`https://cors-proxy.blaseball-reference.com/database/players`, { params: { ids: ids }})
        .then(response => 
            cacheService(dataKey, 
                response && response.data && LodashUniqBy(response.data.map(player => getPlayerObject(player, team, type)), 'id')
            ));

    return cachePromise(dataKey, results);
};

export const parseGameObject = (game) => {
    const homeTeam = AllTeams.find(someTeam => someTeam.id.includes(game.homeTeam));
    const awayTeam = AllTeams.find(someTeam => someTeam.id.includes(game.awayTeam));
    return {
        ...game,
        weatherName: LodashGet(LodashFind(weatherTypes, { 'value': game.weather}), 'text'),
        match: `${String.fromCodePoint(homeTeam.emoji)} ${homeTeam.nickname} - ${String.fromCodePoint(awayTeam.emoji)} ${awayTeam.nickname}`
    };
};

export const getPlayerObject = (player, team, type) => {
    return {
        id: player.id,
        name: player.name,
        label: `${player.name} (${String.fromCodePoint(team.emoji)} ${team.nickname})`,
        position: type,
        value: player.id,
        searchkey: `${player.name} ${player.id} ${team.nickname}`,
        team: team.fullName
    };
};

const getBonusPlayers = (team, type) => {
    return LodashGet(AllTeams.find(someTeam => someTeam.id.includes(team.id)), type, []);
};

const cleanList = (playerList) => {
    return playerList.map(player => LodashPick(player, ['value', 'searchkey', 'label', 'name']));
};

export default {
    cleanList,
    getPlayers,
    getTeams,
    getGames
};
