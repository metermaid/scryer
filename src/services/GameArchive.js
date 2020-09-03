import { parseGameObject } from './Blaseball';
import Games from './../backups/games';

export const getGamesFromArchive = () => {
    return Games.map(game => parseGameObject(game)).reverse();
};

export const getLastDay = () => {
    const lastSeason = Math.max(...Games.map(game => game.season));
    const lastDay = Math.max(...Games.filter(game => game.season === lastSeason).map(game => game.day));

    return { lastSeason, lastDay };
};

export default {
    getGamesFromArchive,
    getLastDay
};