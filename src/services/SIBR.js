import axios from 'axios';
import LodashPickBy from 'lodash/pickBy';
import LodashOmit from 'lodash/omit';
import LodashIdentity from 'lodash/identity';
import LodashFind from 'lodash/find';
import LodashGet from 'lodash/get';
import { checkCache, cachePromise, cacheService } from './CachingManager';

export const getEvents = (params, players, teams) => {
    const cleanedParams = LodashPickBy(params, LodashIdentity);
    const dataKey = JSON.stringify(cleanedParams);
    const cache = checkCache(dataKey);

    /* istanbul ignore next line */
    if (cache) { return cache; }

    const results = axios.get('https://api.blaseball-reference.com/v1/events', { params: cleanedParams })
        .then(response => cacheService(dataKey, response && addEventCols(response.data, players, teams)))
        .catch(/* istanbul ignore next */ error => Promise.reject(error));

    return cachePromise(dataKey, results);
};

export const getPlayerAPI = (params, players, teams) => {
    const cleanedParams = LodashPickBy(params, LodashIdentity);
    const dataKey = JSON.stringify(cleanedParams);
    const cache = checkCache(dataKey);

    /* istanbul ignore next line */
    if (cache) { return cache; }

    const results = axios.get('https://api.blaseball-reference.com/v1' + params.api, { params: LodashOmit(cleanedParams, ['api']) })
        .then(response => cacheService(dataKey, response && addPlayerCols(response.data, players, teams)))
        .catch(/* istanbul ignore next */ error => Promise.reject(error));

    return cachePromise(dataKey, results);
};

const renderPlayer = (playerId, players) => {
  return LodashGet(LodashFind(players, { 'value': playerId}), 'name', playerId)
};

const renderPlayerWithTeam = (playerId, players, teamId, team) => {
    return `${renderPlayer(playerId, players)} (${renderTeam(teamId, team)})`;
};

const renderPlayerTeam = (playerId, players) => {
  return LodashGet(LodashFind(players, { 'value': playerId}), 'team', '')
};

const renderTeam = (teamId, teams) => {
  const team = LodashFind(teams, { 'id': teamId});
  return `${String.fromCodePoint(LodashGet(team, 'emoji', ''))} ${LodashGet(team, 'nickname', teamId)}`
};

const addEventCols = (data, players, teams) => {
    const { results, ...remainder } = data;
    return {
        results: results.map(row => {
            const newValues = {
                key: row.id,
                batter_team_name: row.batter_team_id ? renderTeam(row.batter_team_id, teams) : '',
                pitcher_team_name: row.pitcher_team_id ? renderTeam(row.pitcher_team_id, teams) : '',
                batter_name: row.batter_id ? renderPlayer(row.batter_id, players) : '',
                pitcher_name: row.pitcher_id ? renderPlayer(row.pitcher_id, players) : '',
                batter_with_team: row.batter_id && row.batter_team_id ? renderPlayerWithTeam(row.batter_id, players, row.batter_team_id, teams) : '',
                pitcher_with_team: row.pitcher_id && row.pitcher_team_id ? renderPlayerWithTeam(row.pitcher_id, players, row.pitcher_team_id, teams) : ''
            };
            return {...row, ...newValues};
        }),
        ...remainder
    };
};

const addPlayerCols = (data, players, teams) => {
    const { results, ...remainder } = data;
    return {
        results: results.map((row, index) => {
            const id = row.batter_id || row.pitcher_id || row.id || '';
            const newValues = {
                key: `${id}-${index}`,
                id: id,
                team_name: id ? renderPlayerTeam(id, players) : '',
                name: id ? renderPlayer(id, players) : '',
                count: row.count || row.value || ''
            };
            return {...row, ...newValues};
        }),
        ...remainder
    };
};

export default {
    getEvents,
    getPlayerAPI
};
