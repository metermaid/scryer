import React from 'react';
import { Layout, Table } from 'antd';
import { CSVLink } from 'react-csv';
import LodashFind from 'lodash/find';

import { gameAPIColumns } from './config/ColumnsConfig';

import { getGamesFromArchive, getLastDay } from './services/GameArchive';
import Blaseball from './services/Blaseball';

class Games extends React.Component {
    constructor (props) {
        super(props);
        this.state = { pitchers: [], teams: [], results: [] };
        this.getGame = this.getGame.bind(this);
        this.getGames = this.getGames.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount () {
        this.getPlayers();
        this.getGames();
    }

    getPlayers() {
        Blaseball.getTeams().then(/* istanbul ignore next */ data => {
            data && this.setState({ teams: data});
        }).catch(/* istanbul ignore next */ error => Promise.reject(error));
        Blaseball.getPlayers('lineup').then(/* istanbul ignore next */ data => {
            data && this.setState({ batters: data});
        }).catch(/* istanbul ignore next */ error => Promise.reject(error));
        Blaseball.getPlayers('rotation').then(/* istanbul ignore next */ data => {
            data && this.setState({ pitchers: data});
        }).catch(/* istanbul ignore next */ error => Promise.reject(error));
    }

    getGame(season, day) {
        return Blaseball.getGames(season, day)
            .then(results => {
                this.setState({results: results.concat(this.state.results), error: null });
                return results;
            })
            .catch(/* istanbul ignore next */ error => console.log(error));
    }

    getGames (values) {
        const { lastSeason, lastDay } = getLastDay();
        const localGet = getGamesFromArchive();
        this.setState({results: localGet, error: null });

        const days = Array(150 - lastDay + 1).fill().map((_, idx) => lastDay + idx);

        return days.reduce(async (previousPromise, nextDay) => {
            const results = await previousPromise;

            const validResults = results && results.length && LodashFind(results, (result) => result.gameStart);

            if (typeof results === "boolean" || validResults) {
                return this.getGame(lastSeason, nextDay);
            } else {
                return Promise.resolve([]);
            }
        }, Promise.resolve(true));
    }

    handleChange (pagination, filters, sorter) {
        Object.keys(filters).forEach((key) => (filters[key] === null) && delete filters[key]);
        const pathValues = new URLSearchParams(filters);
        this.props.history.push({ search: pathValues.toString() });
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter
        });
    };

    handleSearch (selectedKeys, confirm, dataIndex) {
        confirm();
    }

    handleReset (clearFilters) {
        clearFilters();
    }

    render () {
        const search = new URLSearchParams(this.props.location.search);

        const { batters, pitchers, teams, results, searchInput } = this.state;
        const csvLink = results && results.length ? (<CSVLink data={results}>Download CSV</CSVLink>) : '';

        return (
            <Layout.Content>
                <div className='results-list'>
                    {csvLink}
                    <Table dataSource={results}
                        bordered
                        columns={gameAPIColumns(batters, pitchers, teams, searchInput, this.handleSearch, this.handleReset, search)}
                        pagination={{ defaultPageSize: 50 }}
                        scroll={{ x: 'max-content' }}
                        onChange={this.handleChange}
                        />
                </div>
            </Layout.Content>
        );
    }
}

export default Games;
