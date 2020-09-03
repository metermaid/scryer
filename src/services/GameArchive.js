import { parseGameObject } from './Blaseball';

const context1 = require.context(`./../backups/games/1`, false, /\.json$/);
const context2 = require.context(`./../backups/games/2`, false, /\.json$/);
const context3 = require.context(`./../backups/games/3`, false, /\.json$/);
const context4 = require.context(`./../backups/games/4`, false, /\.json$/);

const getKey = (filePath) => {
  return parseInt(filePath.split('/').pop().split('.').shift()) - 1;
}

export const loadSeasonJson = (requireContext) => {
  const json = {};
  requireContext.keys().forEach((key) => {
    const obj = requireContext(key);
    const simpleKey = getKey(key);
    json[simpleKey] = obj.map(game => parseGameObject(game));
  });
  return json;
}

export const loadJson = () => {
  return {
    0: loadSeasonJson(context1),
    1: loadSeasonJson(context2),
    2: loadSeasonJson(context3),
    3: loadSeasonJson(context4)
  }
};

export default {
    loadJson
};