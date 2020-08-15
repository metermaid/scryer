import axios from 'axios';
import LodashGet from 'lodash/get';
import LodashFlatten from 'lodash/flatten';
import LodashSortBy from 'lodash/sortBy';

import { checkCache, cachePromise, cacheService } from './CachingManager';

const bonusPlayers = [
  {
    "_id": "b86237bb-ade6-4b1d-9199-a3cc354118d9",
    "name": "Hurley Pacheco",
    "team": "Boston Flowers",
    "position": "lineup"
  },
  {
    "_id": "f9c0d3cb-d8be-4f53-94c9-fc53bcbce520",
    "name": "Matteo Prestige",
    "team": "Charleston Shoe Thieves",
    "position": "rotation"
  },
  {
    "_id": "8e1fd784-99d5-41c1-a6c5-6b947cec6714",
    "name": "Velasquez Meadows",
    "team": "Hellmouth Sunbeams",
    "position": "lineup"
  },
  {
    "_id": "d5b6b11d-3924-4634-bd50-76553f1f162b",
    "name": "Ogden Mendoza",
    "team": "Breckenridge Jazz Hands",
    "position": "rotation"
  },
  {
    "_id": "76c4853b-7fbc-4688-8cda-c5b8de1724e4",
    "name": "Lars Mendoza",
    "team": "Dallas Steaks",
    "position": "lineup"
  },
  {
    "_id": "70a458ed-25ca-4ff8-97fc-21cbf58f2c2a",
    "name": "Trevino Merritt",
    "team": "Canada Moist Talkers",
    "position": "lineup"
  },
  {
    "_id": "40db1b0b-6d04-4851-adab-dd6320ad2ed9",
    "name": "Scrap Murphy",
    "team": "New York Millennials",
    "position": "rotation"
  },
  {
    "_id": "80a2f015-9d40-426b-a4f6-b9911ba3add8",
    "name": "Paul Barnes",
    "team": "San Francisco Lovers",
    "position": "rotation"
  },
  {
    "_id": "03097200-0d48-4236-a3d2-8bdb153aa8f7",
    "name": "Bennett Browning",
    "team": "Seattle Garages",
    "position": "lineup"
  },
  {
    "_id": "c83f0fe0-44d1-4342-81e8-944bb38f8e23",
    "name": "Langley Wheeler",
    "team": "Dallas Steaks",
    "position": "lineup"
  },
  {
    "_id": "57448b62-f952-40e2-820c-48d8afe0f64d",
    "name": "Jessi Wise",
    "team": "Hawaii Fridays",
    "position": "lineup"
  },
  {
    "_id": "6fc3689f-bb7d-4382-98a2-cf6ddc76909d",
    "name": "Cedric Gonzalez",
    "team": "Philly Pies",
    "position": "lineup"
  },
  {
    "_id": "3afb30c1-1b12-466a-968a-5a9a21458c7f",
    "name": "Dickerson Greatness",
    "team": "Houston Spies",
    "position": "lineup"
  },
  {
    "_id": "c83a13f6-ee66-4b1c-9747-faa67395a6f1",
    "name": "Zi Delacruz",
    "team": "Dallas Steaks",
    "position": "lineup"
  },
  {
    "_id": "262c49c6-8301-487d-8356-747023fa46a9",
    "name": "Alexandria Dracaena",
    "team": "Breckenridge Jazz Hands",
    "position": "lineup"
  },
  {
    "_id": "b3d518b9-dc68-4902-b68c-0022ceb25aa0",
    "name": "Hendricks Rangel",
    "team": "Hawaii Fridays",
    "position": "lineup"
  },
  {
    "_id": "1ba715f2-caa3-44c0-9118-b045ea702a34",
    "name": "Juan Rangel",
    "team": "Philly Pies",
    "position": "lineup"
  },
  {
    "_id": "2b1cb8a2-9eba-4fce-85cf-5d997ec45714",
    "name": "Isaac Rubberman",
    "team": "Boston Flowers",
    "position": "lineup"
  },
  {
    "_id": "90c6e6ca-77fc-42b7-94d8-d8afd6d299e5",
    "name": "Miki Santana",
    "team": "Houston Spies",
    "position": "lineup"
  },
  {
    "_id": "bd549bfe-b395-4dc0-8546-5c04c08e24a5",
    "name": "Sam Solis",
    "team": "Hawaii Fridays",
    "position": "rotation"
  },
  {
    "_id": "a1628d97-16ca-4a75-b8df-569bae02bef9",
    "name": "Chorby Soul",
    "team": "New York Millennials",
    "position": "lineup"
  },
  {
    "_id": "4941976e-31fc-49b5-801a-18abe072178b",
    "name": "Sebastian Sunshine",
    "team": "Hawaii Fridays",
    "position": "lineup"
  },
  {
    "_id": "b4505c48-fc75-4f9e-8419-42b28dcc5273",
    "name": "Sebastian Townsend",
    "team": "Charleston Shoe Thieves",
    "position": "lineup"
  },
  {
    "_id": "472f50c0-ef98-4d05-91d0-d6359eec3946",
    "name": "Rhys Trombone",
    "team": "Hellmouth Sunbeams",
    "position": "lineup"
  },
  {
    "_id": "7b0f91aa-4d66-4362-993d-6ff60f7ce0ef",
    "name": "Blankenship Fischer",
    "team": "Charleston Shoe Thieves",
    "position": "lineup"
  },
  {
    "_id": "5b9727f7-6a20-47d2-93d9-779f0a85c4ee",
    "name": "Kennedy Alstott",
    "team": "Canada Moist Talkers",
    "position": "lineup"
  },
  {
    "_id": "43bf6a6d-cc03-4bcf-938d-620e185433e1",
    "name": "Miguel Javier",
    "team": "San Francisco Lovers",
    "position": "lineup"
  },
  {
    "_id": "f44a8b27-85c1-44de-b129-1b0f60bcb99c",
    "name": "Atlas Jonbois",
    "team": "Charleston Shoe Thieves",
    "position": "lineup"
  },
  {
    "_id": "c86b5add-6c9a-40e0-aa43-e4fd7dd4f2c7",
    "name": "Sosa Elftower",
    "team": "Yellowstone Magic",
    "position": "lineup"
  },
  {
    "_id": "bca38809-81de-42ff-94e3-1c0ebfb1e797",
    "name": "Famous Oconnor",
    "team": "Yellowstone Magic",
    "position": "rotation"
  },
  {
    "_id": "773712f6-d76d-4caa-8a9b-56fe1d1a5a68",
    "name": "Natha Kath",
    "team": "Los Angeles Tacos",
    "position": "rotation"
  },
  {
    "_id": "3d4545ed-6217-4d7a-9c4a-209265eb6404",
    "name": "Tiana Cash",
    "team": "Seattle Garages",
    "position": "lineup"
  },
  {
    "_id": "0fe896e1-108c-4ce9-97be-3470dde73c21",
    "name": "Bryanayah Chang",
    "team": "Boston Flowers",
    "position": "lineup"
  },
  {
    "_id": "d74a2473-1f29-40fa-a41e-66fa2281dfca",
    "name": "Landry Violence",
    "team": "Hades Tigers",
    "position": "lineup"
  },
  {
    "_id": "d744f534-2352-472b-9e42-cd91fa540f1b",
    "name": "Tyler Violet",
    "team": "Canada Moist Talkers",
    "position": "lineup"
  },
  {
    "_id": "3064c7d6-91cc-4c2a-a433-1ce1aabc1ad4",
    "name": "Jorge Ito",
    "team": "Boston Flowers",
    "position": "lineup"
  }
];

export const getPlayers = (type) => {
    return getPlayersFromBlaseball(type).then(data => LodashSortBy(LodashFlatten(data), ['name']));
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
            cacheService(dataKey, 
                response && response.data && response.data.map(player => getPlayerObject(player, team)).concat(getBonusPlayers(team, type))
            ));

    return cachePromise(dataKey, results);
};

export const getPlayerObject = (player, team) => {
    return {
        value: player._id,
        name: player.name,
        searchkey: `${player.name} ${player._id} ${team.nickname}`,
        label: `${player.name} (${String.fromCodePoint(team.emoji)} ${team.nickname})`,
        team: team.nickname
    };
};

const getBonusPlayers = (team, type) => {
    return bonusPlayers.filter(player => !player.team.localeCompare(team.fullName) && !player.position.localeCompare(type))
        .map(player => getPlayerObject(player, team));
};

export default {
    getPlayers,
    getTeams
};
