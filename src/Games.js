import React from 'react';
import { Alert, Button, Form, InputNumber, Layout, Table } from 'antd';
import { CSVLink } from 'react-csv';
import LodashFind from 'lodash/find';
import LodashIsEq from 'lodash/isEqual';
import LodashUniqWith from 'lodash/uniqWith';

import { gameAPIColumns } from './config/ColumnsConfig';

import { getGamesBySeason } from './services/GameArchive';
import Blaseball from './services/Blaseball';

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

class Games extends React.Component {
    constructor (props) {
        super(props);
        this.state = { error: null, pitchers: [], teams: [], results: [] };
        this.getGame = this.getGame.bind(this);
        this.onFinish = this.onFinish.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount () {
        this.getPlayers();
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
                this.setState({results: LodashUniqWith(results.concat(this.state.results), LodashIsEq), error: null });
                return results;
            })
            .catch(/* istanbul ignore next */ error => console.log(error));
    }

    onFinish (values) {
        const dayPath = values.day ? `&day=${values.day}` : '';
        const pathname = `?season=${values.season}${dayPath}`;
        this.props.history.push({ search: pathname });
        if (values.season && values.day) {
            return this.getGame(parseInt(values.season) - 1, parseInt(values.day) - 1);
        } else if (values.season) {
            const localGet = getGamesBySeason(parseInt(values.season) - 1);
            console.log(localGet);
            if (localGet.length > 0) {
                this.setState({results: LodashUniqWith(localGet.concat(this.state.results), LodashIsEq), error: null });
                return Promise.resolve(localGet);
            } else {
                const days = Array.from(Array(150).keys());
                days.reduce(async (previousPromise, nextDay) => {
                    const results = await previousPromise;

                    const validResults = results && results.length && LodashFind(results, (result) => result.gameStart);

                    if (typeof results === "boolean" || validResults) {
                        return this.getGame(parseInt(values.season) - 1, nextDay);
                    } else {
                        return Promise.resolve([]);
                    }
                }, Promise.resolve(true));
            }
        }
    }

    handleSearch (selectedKeys, confirm, dataIndex) {
        confirm();
        this.setState({ searchText: selectedKeys[0], searchedColumn: dataIndex });
    }

    handleReset (clearFilters) {
        clearFilters();
        this.setState({ searchText: '' });
    }

    render () {
        const search = this.props.location.search;
        const defaultSeason = new URLSearchParams(search).get('season') || 4;
        const defaultDay = new URLSearchParams(search).get('day') || '';

        const { batters, pitchers, teams, error, results, searchInput } = this.state;
        const csvLink = results && results.length ? (<CSVLink data={results}>Download CSV</CSVLink>) : '';
        const errorMessage = error ? <Alert closable message={error} type='error' /> : '';

        return (
            <Layout.Content>
                { errorMessage }
                <Form onFinish={this.onFinish} {...formLayout} style={{ padding: '10px 0' }}>
                    <Form.Item name='season' label='Season' initialValue={defaultSeason}>
                        <InputNumber placeholder={5} min={1} max={5} />
                    </Form.Item>

                    <Form.Item name='day' label='Day' initialValue={defaultDay}>
                        <InputNumber placeholder={3} min={1} max={150} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type='primary' htmlType='submit'>
                          Submit
                        </Button>
                    </Form.Item>
                </Form>
                <div className='results-list'>
                    {csvLink}
                    <Table dataSource={results} 
                        bordered
                        columns={gameAPIColumns(batters, pitchers, teams, searchInput, this.handleSearch, this.handleReset)}
                        scroll={{ x: 'max-content' }}
                        />
                </div>
            </Layout.Content>
        );
    }
}

export default Games;
