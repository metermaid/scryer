import axios from 'axios';
import LodashGet from 'lodash/get';
import LodashFlatten from 'lodash/flatten';
import LodashSortBy from 'lodash/sortBy';

export const getPlayers = (type) => {
    const bonusPlayers = getBonusPlayers(type);
    return getPlayersFromBlaseball(type).then(data => LodashSortBy(LodashFlatten(data).concat(bonusPlayers), ['name']));
};

export const getTeams = () => {
    return axios.get(`https://blaseball.com/database/allTeams`)
        .then(response => response && response.data);
};

export const getPlayersFromBlaseball = (type) => {
    return getTeams().then(response => {
        let teamPromises = response.map(team => processTeam(team, type));
        return Promise.all(teamPromises);
    });
};

const processTeam = (team, type) => {
    const ids = LodashGet(team, type).join(',');
    return axios.get(`https://blaseball.com/database/players`, { params: { ids: ids }})
        .then(response => 
            response && response.data && response.data.map(player => {
                return {
                    value: player._id,
                    name: player.name,
                    label: `${player.name} (${String.fromCodePoint(team.emoji)} ${team.nickname})`,
                    team: team.nickname
                };
            }));
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
    getPlayers
};
