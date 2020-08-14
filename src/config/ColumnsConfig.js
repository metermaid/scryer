import { gameEvents } from './EventsConfig';
import LodashFind from 'lodash/find';
import LodashGet from 'lodash/get';

export const renderPlayer = (playerId, players) => {
  return LodashGet(LodashFind(players, { 'value': playerId}), 'label', playerId)
};

export const renderTeam = (teamId, teams) => {
  const team = LodashFind(teams, { '_id': teamId});
  return `${String.fromCodePoint(LodashGet(team, 'emoji', ''))} ${LodashGet(team, 'nickname', teamId)}`
};

export const renderEvents = (eventId) => {
  return LodashGet(LodashFind(gameEvents, { 'value': eventId}), 'text', eventId);
};

export const gameEventColumns = (batters, pitchers, teams) => {
  return [
    {
      'dataIndex': 'id',
      'title': 'id',
      'sorter': (a, b) => a.id - b.id
    },
    {
      'dataIndex': 'game_id',
      'title': 'game id',
      'sorter': (a, b) => a.game_id.localeCompare(b.game_id)
    },
    {
      'dataIndex': 'event_type',
      'title': 'event type',
      'render': (text, record, index) => renderEvents(text),
      'filters': gameEvents,
      'onFilter': (value, record) => value.localeCompare(record.event_type) === 0,
      'sorter': (a, b) => a.event_type.localeCompare(b.event_type)
    },
    {
      'dataIndex': 'event_text',
      'title': 'event text'
    },
    {
      'dataIndex': 'inning',
      'title': 'inning'
    },
    {
      'dataIndex': 'batter_id',
      'title': 'batter id',
      'render': (text, record, index) => renderPlayer(text, batters)
    },
    {
      'dataIndex': 'batter_team_id',
      'title': 'batter team id',
      'render': (text, record, index) => renderTeam(text, teams)
    },
    {
      'dataIndex': 'pitcher_id',
      'title': 'pitcher id',
      'render': (text, record, index) => renderPlayer(text, pitchers)
    },
    {
      'dataIndex': 'pitcher_team_id',
      'title': 'pitcher team id',
      'render': (text, record, index) => renderTeam(text, teams)
    },
    {
      'dataIndex': 'home_score',
      'title': 'home score'
    },
    {
      'dataIndex': 'away_score',
      'title': 'away score'
    },
    {
      'dataIndex': 'home_strike_count',
      'title': 'home strike count'
    },
    {
      'dataIndex': 'away_strike_count',
      'title': 'away strike count'
    },
    {
      'dataIndex': 'outs_before_play',
      'title': 'outs before play'
    },
    {
      'dataIndex': 'batter_count',
      'title': 'batter count'
    },
    {
      'dataIndex': 'pitches',
      'title': 'pitches'
    },
    {
      'dataIndex': 'total_strikes',
      'title': 'total strikes'
    },
    {
      'dataIndex': 'total_balls',
      'title': 'total balls'
    },
    {
      'dataIndex': 'bases_hit',
      'title': 'bases hit'
    },
    {
      'dataIndex': 'runs_batted_in',
      'title': 'runs batted in'
    },
    {
      'dataIndex': 'outs_on_play',
      'title': 'outs on play'
    },
    {
      'dataIndex': 'errors_on_play',
      'title': 'errors on play'
    },
    {
      'dataIndex': 'batter_base_after_play',
      'title': 'batter base after play'
    },
    {
      'dataIndex': 'additional_context',
      'title': 'Additional Context'
    }
  ];
};

export const batterStatColumns = (batters) => {
    return [
      {
        'dataIndex': 'api',
        'title': 'API'
      },
      {
        'dataIndex': 'batter_id',
        'title': 'Batter ID',
        'render': (text, record, index) => renderPlayer(text, batters)
      },
      {
        'dataIndex': 'count',
        'title': 'Count'
      }
    ];
};

export const pitcherStatColumns = (pitchers) => {
    return [
      {
        'dataIndex': 'api',
        'title': 'API'
      },
      {
        'dataIndex': 'pitcher_id',
        'title': 'Pitcher ID',
        'render': (text, record, index) => renderPlayer(text, pitchers)
      },
      {
        'dataIndex': 'count',
        'title': 'Count'
      }
    ];
};

export default {
    gameEventColumns,
    batterStatColumns,
    pitcherStatColumns
};