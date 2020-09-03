import { parseGameObject } from './Blaseball';
import Games from './../backups/games';

export const getGamesByDay = (season, day) => {
    return Games.map(game => parseGameObject(game)).filter(game => game.season === season && game.day === day);
};

export const getGamesBySeason = (season) => {
    return Games.map(game => parseGameObject(game)).filter(game => game.season === season);
};

export default {
    getGamesBySeason,
    getGamesByDay
};