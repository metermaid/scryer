import React from 'react';
import { gameEvents } from './EventsConfig';
import { Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import LodashFind from 'lodash/find';
import LodashGet from 'lodash/get';
import LodashSortBy from 'lodash/sortBy';

export const renderEvents = (eventId) => {
  return LodashGet(LodashFind(gameEvents, { 'value': eventId}), 'text', eventId);
};

export const renderArray = (array) => {
  return array.map(line => (<div>{line}</div>));
};

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
        setTimeout(() => searchInput.select(), 100);
      }
    }
  });

export const gameEventColumns = (batters, pitchers, teams, searchInput, handleSearch, handleReset) => {
  return [
    {
      'dataIndex': 'id',
      'title': 'ID',
      'sorter': (a, b) => a.id - b.id
    },
    {
      'dataIndex': 'game_id',
      'title': 'Game ID',
      'sorter': (a, b) => a.game_id.localeCompare(b.game_id),
      ...getColumnSearchProps('game_id', searchInput, handleSearch, handleReset)
    },
    {
      'dataIndex': 'event_type',
      'title': 'Event Type',
      'render': (text, record, index) => renderEvents(text),
      'filters': gameEvents,
      'onFilter': (value, record) => value.localeCompare(record.event_type) === 0,
      'sorter': (a, b) => a.event_type.localeCompare(b.event_type)
    },
    {
      'dataIndex': 'event_text',
      'title': 'Event Text',
      'render': (text, record, index) => renderArray(text),
      'width': 200,
      ...getColumnSearchProps('event_text', searchInput, handleSearch, handleReset)
    },
    {
      'dataIndex': 'batter_name',
      'title': 'Batter Name',
      'filters': batters.map(row => { return { value: row.name, text: row.name } }),
      'onFilter': (value, record) => value.localeCompare(record.batter_name) === 0
    },
    {
      'dataIndex': 'batter_team_name',
      'title': 'Batter Team Name',
      'filters': LodashSortBy(teams.map(row => { return { value: row.nickname, text: row.fullName } }), ['text']),
      'onFilter': (value, record) => record.batter_team_name.includes(value)
    },
    {
      'dataIndex': 'pitcher_name',
      'title': 'Pitcher Name',
      'filters': pitchers.map(row => { return { value: row.name, text: row.name } }),
      'onFilter': (value, record) => value.localeCompare(record.pitcher_name) === 0
    },
    {
      'dataIndex': 'pitcher_team_name',
      'title': 'Pitcher Team Name',
      'filters': LodashSortBy(teams.map(row => { return { value: row.nickname, text: row.fullName } }), ['text']),
      'onFilter': (value, record) => record.pitcher_team_name.includes(value)
    },
    {
      'dataIndex': 'inning',
      'title': 'Inning'
    },
    {
      'dataIndex': 'home_score',
      'title': 'Home Score'
    },
    {
      'dataIndex': 'away_score',
      'title': 'Away Score'
    },
    {
      'dataIndex': 'home_strike_count',
      'title': 'Home Strike Count'
    },
    {
      'dataIndex': 'away_strike_count',
      'title': 'Away Strike Count'
    },
    {
      'dataIndex': 'outs_before_play',
      'title': 'Outs before Play'
    },
    {
      'dataIndex': 'batter_count',
      'title': 'Batter Count'
    },
    {
      'dataIndex': 'pitches',
      'title': 'Pitches'
    },
    {
      'dataIndex': 'total_strikes',
      'title': 'Total Strikes'
    },
    {
      'dataIndex': 'total_balls',
      'title': 'Total Balls'
    },
    {
      'dataIndex': 'bases_hit',
      'title': 'Bases Hit'
    },
    {
      'dataIndex': 'runs_batted_in',
      'title': 'Runs Batted In'
    },
    {
      'dataIndex': 'outs_on_play',
      'title': 'Outs on Play'
    },
    {
      'dataIndex': 'errors_on_play',
      'title': 'Errors on Play'
    },
    {
      'dataIndex': 'batter_base_after_play',
      'title': 'Batter Base After Play'
    },
    {
      'dataIndex': 'additional_context',
      'title': 'Additional Context'
    }
  ];
};

export const batterStatColumns = () => {
    return [
      {
        'dataIndex': 'api',
        'title': 'API'
      },
      {
        'dataIndex': 'batter_id',
        'title': 'Batter ID'
      },
      {
        'dataIndex': 'batter_name',
        'title': 'Batter Name'
      },
      {
        'dataIndex': 'batter_team_name',
        'title': 'Batter Team Name'
      },
      {
        'dataIndex': 'count',
        'title': 'Count'
      }
    ];
};

export const pitcherStatColumns = () => {
    return [
      {
        'dataIndex': 'api',
        'title': 'API'
      },
      {
        'dataIndex': 'pitcher_id',
        'title': 'Pitcher ID'
      },
      {
        'dataIndex': 'pitcher_name',
        'title': 'Pitcher Name'
      },
      {
        'dataIndex': 'pitcher_team_name',
        'title': 'Pitcher Team Name'
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