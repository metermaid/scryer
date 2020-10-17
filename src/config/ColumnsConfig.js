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
  sorter: (a, b) => {
    const a_field = LodashGet(a, field_name, '');
    return a_field ? a_field.localeCompare(LodashGet(b, field_name, '')) : -1;
  }
});

const getColumnArraySortProps = (field_name) => ({
  sorter: (a, b) => LodashGet(a, field_name, []).join().localeCompare(LodashGet(b, field_name, '').join())
});

const getColumnNumericalSortProps = (field_name) => ({
  sorter: (a, b) => LodashGet(a, field_name) - LodashGet(b, field_name)
});

const getColumnPlayerFilterProps = (players, field_name) => ({
  filters: players.map(row => { return { value: row.name, text: row.name } }),
  onFilter: (value, record) => LodashGet(record, field_name).includes(value)
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

const getColumnZeroIndexedSearchProps = (dataIndex, searchInput, handleSearch, handleReset) => ({
    ...getColumnSearchProps(dataIndex, searchInput, handleSearch, handleReset),
    onFilter: (value, record) =>
      record[dataIndex] ? parseInt(record[dataIndex]) + 1 === parseInt(value) : false
  });

const getColumnNumericalSortAndSearchProps = (field_name, searchInput, handleSearch, handleReset) => ({
  ...getColumnNumericalSortProps(field_name),
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
      'render': (text, record, index) => text+1,
      ...getColumnNumericalSortProps('season'),
      ...getColumnZeroIndexedSearchProps('season', searchInput, handleSearch, handleReset)
    },
    {
      'dataIndex': 'day',
      'title': 'Day',
      'render': (text, record, index) => text+1,
      ...getColumnNumericalSortProps('day'),
      ...getColumnZeroIndexedSearchProps('day', searchInput, handleSearch, handleReset)
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
      'dataIndex': 'outs_on_play',
      'title': 'Outs',
      ...getColumnNumericalSortAndSearchPropsShim('outs_on_play'),
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

export const gameAPIColumns = (batters, pitchers, teams, searchInput, handleSearch, handleReset, search) => {
    const getColumnNumericalSortAndSearchPropsShim = (field_name) => {
      return getColumnNumericalSortAndSearchProps(field_name, searchInput, handleSearch, handleReset)
    };

    const getSearchParams = (column) => {
      const searchParams = search.get(column);
      return searchParams ? searchParams.split(',') : null;
    }
    return [
      {
        'dataIndex': 'id',
        'title': 'Game ID',
        'render': (text, record, index) => (
          <Link to={{'pathname': '/', 'search': `?gameId=${text}`}}>{ text }</Link>
        )
      },
      {
        'dataIndex': 'season',
        'title': 'Season',
        'render': (text, record, index) => text+1,
        ...getColumnNumericalSortProps('season'),
        ...getColumnZeroIndexedSearchProps('season', searchInput, handleSearch, handleReset)
      },
      {
        'dataIndex': 'day',
        'title': 'Day',
        'defaultFilteredValue': getSearchParams('day'),
        'render': (text, record, index) => text+1,
        ...getColumnNumericalSortProps('day'),
        ...getColumnZeroIndexedSearchProps('day', searchInput, handleSearch, handleReset)
      },
      {
        'dataIndex': 'match',
        'title': 'Match',
        'defaultFilteredValue': getSearchParams('match'),
        ...getColumnTeamFilterProps(teams, 'match'),
        ...getColumnAlphaSortProps('match')
      },
      {
        'dataIndex': 'homeScore',
        'title': 'Home Score',
        'defaultFilteredValue': getSearchParams('homeScore'),
        ...getColumnNumericalSortAndSearchPropsShim('homeScore')
      },
      {
        'dataIndex': 'awayScore',
        'title': 'Away Score',
        'defaultFilteredValue': getSearchParams('awayScore'),
        ...getColumnNumericalSortAndSearchPropsShim('awayScore')
      },
      {
        'dataIndex': 'homeOdds',
        'title': 'Home Odds',
        'defaultFilteredValue': getSearchParams('homeOdds'),
        ...getColumnNumericalSortAndSearchPropsShim('homeOdds')
      },
      {
        'dataIndex': 'awayOdds',
        'title': 'Away Odds',
        'defaultFilteredValue': getSearchParams('awayOdds'),
        ...getColumnNumericalSortAndSearchPropsShim('awayOdds')
      },
      {
        'dataIndex': 'homePitcher',
        'title': 'Home Pitcher',
        'defaultFilteredValue': getSearchParams('homePitcherName'),
        'render': (text, record, index) => renderPlayer(text, pitchers),
        ...getColumnPlayerFilterProps(pitchers, 'homePitcherName'),
        ...getColumnAlphaSortProps('homePitcherName')
      },
      {
        'dataIndex': 'awayPitcher',
        'title': 'Away Pitcher',
        'defaultFilteredValue': getSearchParams('awayPitcherName'),
        'render': (text, record, index) => renderPlayer(text, pitchers),
        ...getColumnPlayerFilterProps(pitchers, 'awayPitcherName'),
        ...getColumnAlphaSortProps('awayPitcherName')
      },
      {
        'dataIndex': 'inning',
        'title': 'Inning',
        'defaultFilteredValue': getSearchParams('inning'),
        ...getColumnNumericalSortAndSearchPropsShim('inning')
      },
      {
        'dataIndex': 'outcomes',
        'title': 'Outcomes',
        'defaultFilteredValue': getSearchParams('outcomes'),
        ...getColumnArraySortProps('outcomes'),
        'filters': [
          {value: "any", text: "Any"},
          {value: "incinerate", text: "Incineration" },
          {value: "eanut", text: "Peanut" },
          {value: "shuffle", text: "Shuffle" },
          {value: "eedback", text: "Feedback" },
          {value: "Reverberating", text: "Reverberating" },
          {value: "siphon", text: "Siphon" }
        ],
        'render': (text, record, index) => renderArray(text),
        'onFilter': (value, record) => {
          const outcomes = LodashGet(record, 'outcomes', []);
          return outcomes && Array.isArray(outcomes) && outcomes.length > 0 && (value === "any" ||
            outcomes.findIndex(outcome => outcome && outcome.includes(value)) >= 0);
        }
      },
      {
        'dataIndex': 'shame',
        'title': 'Shame',
        'defaultFilteredValue': getSearchParams('shame'),
        'render': (text, record, index) => text ? "TRUE" : "FALSE",
        ...getColumnNumericalSortProps('shame'),
        filters: [{value: true, text: "TRUE"}, {value: false, text: "FALSE" }],
        onFilter: (value, record) => LodashGet(record, 'shame') === value
      },
      {
        'dataIndex': 'weatherName',
        'title': 'Weather',
        'defaultFilteredValue': getSearchParams('weatherName'),
        ...getColumnAlphaSortProps('weatherName'),
        filters: weatherTypes,
        onFilter: (value, record) => LodashGet(record, 'weather') === value
      }
    ];
};

export default {
    gameAPIColumns,
    gameEventColumns,
    playerStatColumns
};