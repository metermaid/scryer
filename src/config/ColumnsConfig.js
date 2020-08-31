import React from 'react';
import { Link } from 'react-router-dom';
import { weatherTypes, gameEvents } from './EventsConfig';
import { Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import LodashFind from 'lodash/find';
import LodashGet from 'lodash/get';
import LodashSortBy from 'lodash/sortBy';

export const renderEvents = (eventId) => {
  return LodashGet(LodashFind(gameEvents, { 'value': eventId}), 'text', eventId);
};


export const renderWeather = (weatherId) => {
  return LodashGet(LodashFind(weatherTypes, { 'value': weatherId}), 'text', weatherId);
};

export const renderArray = (array) => {
  return array.map(line => (<div>{line}</div>));
};

export const renderPlayer = (playerId, players) => {
  return LodashGet(LodashFind(players, { 'value': playerId}), 'label', playerId)
};

export const renderTeam = (teamId, teams) => {
  const team = LodashFind(teams, { 'id': teamId});
  return `${String.fromCodePoint(LodashGet(team, 'emoji', ''))} ${LodashGet(team, 'nickname', teamId)}`
};

const getColumnAlphaSortProps = (field_name) => ({
  sorter: (a, b) => LodashGet(a, field_name, '').localeCompare(LodashGet(b, field_name, ''))
});

const getColumnNumericalSortProps = (field_name) => ({
  sorter: (a, b) => LodashGet(a, field_name) - LodashGet(b, field_name),
});

const getColumnPlayerFilterProps = (players, field_name) => ({
  filters: players.map(row => { return { value: row.name, text: row.name } }),
  onFilter: (value, record) => value.localeCompare(LodashGet(record, field_name)) === 0
});

const getColumnTeamFilterProps = (teams, field_name) => ({
  filters: LodashSortBy(teams.map(row => { return { value: row.nickname, text: row.fullName } }), ['text']),
  onFilter: (value, record) => LodashGet(record, field_name).includes(value)
});

const getColumnSearchProps = (dataIndex, searchInput, handleSearch, handleReset) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput && searchInput.select(), 100);
      }
    }
  });

const getColumnGameAPISearchProps = (dataIndex, searchInput, handleSearch, handleReset) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? parseInt(record[dataIndex]) + 1 === parseInt(value) : false,
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput && searchInput.select(), 100);
      }
    }
  });

const getColumnNumericalSortAndSearchProps = (field_name, searchInput, handleSearch, handleReset) => ({
  sorter: (a, b) => LodashGet(a, field_name) - LodashGet(b, field_name),
  ...getColumnSearchProps(field_name, searchInput, handleSearch, handleReset)
});

export const gameEventColumns = (batters, pitchers, teams, searchInput, handleSearch, handleReset, advancedMode) => {
  const getColumnNumericalSortAndSearchPropsShim = (field_name) => {
    return advancedMode ? getColumnNumericalSortAndSearchProps(field_name, searchInput, handleSearch, handleReset) : {}
  };
  const advancedModeColumnsHead = advancedMode ? [
    {
      'dataIndex': 'game_id',
      'title': 'Game ID',
      ...getColumnSearchProps('game_id', searchInput, handleSearch, handleReset)
    },
    {
      'dataIndex': 'id',
      'title': 'Event ID',
      ...getColumnNumericalSortAndSearchPropsShim('id')
    },
    {
      'dataIndex': 'event_type',
      'title': 'Event Type',
      'render': (text, record, index) => renderEvents(text),
      'filters': gameEvents,
      'onFilter': (value, record) => value.localeCompare(record.event_type) === 0,
      ...getColumnAlphaSortProps('event_type')
    }
  ] : [];
  const advancedModeColumnsTeamInfo = advancedMode ? [
    {
      'dataIndex': 'batter_name',
      'title': 'Batter Name',
      ...getColumnPlayerFilterProps(batters, 'batter_name'),
      ...getColumnAlphaSortProps('batter_name')
    },
    {
      'dataIndex': 'batter_team_name',
      'title': 'Batter Team',
      ...getColumnTeamFilterProps(teams, 'batter_team_name'),
      ...getColumnAlphaSortProps('batter_team_name')
    },
    {
      'dataIndex': 'pitcher_name',
      'title': 'Pitcher Name',
      ...getColumnPlayerFilterProps(pitchers, 'pitcher_name'),
      ...getColumnAlphaSortProps('pitcher_name')
    },
    {
      'dataIndex': 'pitcher_team_name',
      'title': 'Pitcher Team',
      ...getColumnTeamFilterProps(teams, 'pitcher_team_name'),
      ...getColumnAlphaSortProps('pitcher_team_name')
    }
  ] : [
    {
      'dataIndex': 'batter_with_team',
      'title': 'Batter (Team)'
    },
    {
      'dataIndex': 'pitcher_with_team',
      'title': 'Pitcher (Team)'
    }
  ];
  const advancedModeColumnsScore = advancedMode ? [
    {
      'dataIndex': 'home_score',
      'title': 'Home Score',
      ...getColumnNumericalSortAndSearchPropsShim('home_score'),
    },
    {
      'dataIndex': 'away_score',
      'title': 'Away Score',
      ...getColumnNumericalSortAndSearchPropsShim('away_score'),
    }
  ] : [
    {
      'title': 'Score',
      'render': (text, record, index) => {
        return `${record.home_score} - ${record.away_score}`
      }
    }
  ];
  const advancedModeColumnsTail = advancedMode ? [
    {
      'dataIndex': 'pitches',
      'title': 'Pitches',
      ...getColumnAlphaSortProps(['pitches', 0]),
      'sorter': (a, b) => LodashGet(a, 'pitches', []).join('').localeCompare(LodashGet(b, 'pitches', []).join('')),
      ...getColumnSearchProps('pitches', searchInput, handleSearch, handleReset)
    },
    {
      'dataIndex': 'bases_hit',
      'title': 'Bases Hit',
      ...getColumnNumericalSortAndSearchPropsShim('bases_hit'),
    },
    {
      'dataIndex': 'runs_batted_in',
      'title': 'Runs Batted In',
      ...getColumnNumericalSortAndSearchPropsShim('runs_batted_in'),
    },
    {
      'dataIndex': 'outs_on_play',
      'title': 'Outs on Play',
      ...getColumnNumericalSortAndSearchPropsShim('outs_on_play'),
    },
    {
      'dataIndex': 'errors_on_play',
      'title': 'Errors on Play',
      ...getColumnNumericalSortAndSearchPropsShim('errors_on_play'),
      ...getColumnSearchProps('errors_on_play', searchInput, handleSearch, handleReset)
    },
    {
      'dataIndex': 'batter_base_after_play',
      'title': 'Batter Base After Play',
      ...getColumnNumericalSortAndSearchPropsShim('batter_base_after_play')
    }
  ] : [];
  return [
    {
      'dataIndex': 'id',
      'render': (text, record, index) => '',
      'sorter': (a, b) => LodashGet(a, 'id') - LodashGet(b, 'id')
    },
    {
      'dataIndex': 'season',
      'title': 'Season',
      ...getColumnNumericalSortAndSearchPropsShim('season')
    },
    {
      'dataIndex': 'day',
      'title': 'Day',
      ...getColumnNumericalSortAndSearchPropsShim('day')
    },
    ...advancedModeColumnsHead,
    {
      'dataIndex': 'inning',
      'title': 'Inning',
      ...getColumnNumericalSortAndSearchPropsShim('inning')
    },
    ...advancedModeColumnsScore,
    {
      'dataIndex': 'event_text',
      'title': 'Event Text',
      'render': (text, record, index) => renderArray(text),
      'width': 200,
      ...getColumnSearchProps('event_text', searchInput, handleSearch, handleReset)
    },
    ...advancedModeColumnsTeamInfo,
    {
      'dataIndex': 'outs_before_play',
      'title': advancedMode ? 'Outs Before Play' : 'Outs',
      ...getColumnNumericalSortAndSearchPropsShim('outs_before_play'),
    },
    {
      'dataIndex': 'total_strikes',
      'title': 'Strikes',
      ...getColumnNumericalSortAndSearchPropsShim('total_strikes'),
    },
    {
      'dataIndex': 'total_balls',
      'title': 'Balls',
      ...getColumnNumericalSortAndSearchPropsShim('total_balls'),
    },
    {
      'dataIndex': 'additional_context',
      'title': 'Additional Context',
      ...getColumnSearchProps('additional_context', searchInput, handleSearch, handleReset)
    },
    ...advancedModeColumnsTail
  ];
};

export const playerStatColumns = (batters, teams, searchInput, handleSearch, handleReset) => {
    return [
      {
        'dataIndex': 'api',
        'title': 'API',
        ...getColumnAlphaSortProps('api'),
        ...getColumnSearchProps('api', searchInput, handleSearch, handleReset)
      },
      {
        'dataIndex': 'id',
        'title': 'Player ID',
        ...getColumnAlphaSortProps('id'),
        ...getColumnSearchProps('id', searchInput, handleSearch, handleReset)
      },
      {
        'dataIndex': 'name',
        'title': 'Player Name',
        ...getColumnAlphaSortProps('name'),
        ...getColumnPlayerFilterProps(batters, 'name')
      },
      {
        'dataIndex': 'team_name',
        'title': 'Team Name',
        ...getColumnAlphaSortProps('team_name'),
        ...getColumnTeamFilterProps(teams, 'team_name')
      },
      {
        'dataIndex': 'count',
        'title': 'Count',
        ...getColumnNumericalSortProps('count'),
        ...getColumnSearchProps('count', searchInput, handleSearch, handleReset)
      }
    ];
};

export const gameAPIColumns = (batters, pitchers, teams, searchInput, handleSearch, handleReset) => {
    return [
      {
        'dataIndex': 'id',
        'title': 'id',
        'render': (text, record, index) => (
          <Link to={{'pathname': '/', 'search': `?gameId=${text}`}}>{ text }</Link>
        )
      },
      {
        'dataIndex': 'season',
        'title': 'season',
        'render': (text, record, index) => text+1,
        ...getColumnNumericalSortProps('season'),
        ...getColumnGameAPISearchProps('season', searchInput, handleSearch, handleReset)
      },
      {
        'dataIndex': 'day',
        'title': 'day',
        'render': (text, record, index) => text+1,
        ...getColumnNumericalSortProps('day'),
        ...getColumnGameAPISearchProps('day', searchInput, handleSearch, handleReset)
      },
      {
        'dataIndex': 'match',
        'title': 'match',
        ...getColumnTeamFilterProps(teams, 'match'),
        ...getColumnSearchProps('match', searchInput, handleSearch, handleReset)
      },
      {
        'dataIndex': 'homeScore',
        'title': 'homeScore',
        ...getColumnNumericalSortAndSearchProps('homeScore')
      },
      {
        'dataIndex': 'awayScore',
        'title': 'awayScore',
        ...getColumnNumericalSortAndSearchProps('awayScore')
      },
      {
        'dataIndex': 'homeOdds',
        'title': 'homeOdds',
        ...getColumnNumericalSortAndSearchProps('homeOdds')
      },
      {
        'dataIndex': 'awayOdds',
        'title': 'awayOdds',
        ...getColumnNumericalSortAndSearchProps('awayOdds')
      },
      {
        'dataIndex': 'homePitcher',
        'title': 'homePitcher',
        'render': (text, record, index) => renderPlayer(text, pitchers),
        ...getColumnPlayerFilterProps(pitchers, 'homePitcher'),
        ...getColumnAlphaSortProps('homePitcher')
      },
      {
        'dataIndex': 'awayPitcher',
        'title': 'awayPitcher',
        'render': (text, record, index) => renderPlayer(text, pitchers),
        ...getColumnPlayerFilterProps(pitchers, 'awayPitcher'),
        ...getColumnAlphaSortProps('awayPitcher')
      },
      {
        'dataIndex': 'homeStrikes',
        'title': 'homeStrikes',
        ...getColumnNumericalSortAndSearchProps('homeStrikes')
      },
      {
        'dataIndex': 'awayStrikes',
        'title': 'awayStrikes',
        ...getColumnNumericalSortAndSearchProps('awayStrikes')
      },
      {
        'dataIndex': 'inning',
        'title': 'inning',
        ...getColumnNumericalSortAndSearchProps('inning')
      },
      {
        'dataIndex': 'outcomes',
        'title': 'outcomes'
      },
      {
        'dataIndex': 'shame',
        'title': 'shame'
      },
      {
        'dataIndex': 'weather',
        'title': 'weather',
        'render': (text, record, index) => renderWeather(text)
      }
    ];
};

export default {
    gameAPIColumns,
    gameEventColumns,
    playerStatColumns
};