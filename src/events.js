import React from 'react';
import { Alert, Button, Form, Input, Select, Table, Layout } from 'antd';
import { CSVLink } from 'react-csv';
import Blaseball from './services/Blaseball';
import sibr from './services/SIBR';
import { gameEventColumns } from './config/ColumnsConfig';

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const tableLayout = {
    bordered: true,
    scroll: { x: 'max-content' }
};

class Events extends React.Component {
    constructor (props) {
        super(props);
        this.state = { results: null, batters: [], pitchers: [], teams: [], searchText: '', searchedColumn: '' };
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
            data && this.setState({ batters: Blaseball.cleanList(data)});
        }).catch(/* istanbul ignore next */ error => Promise.reject(error));
        Blaseball.getPlayers('rotation').then(/* istanbul ignore next */ data => {
            data && this.setState({ pitchers: Blaseball.cleanList(data)});
        }).catch(/* istanbul ignore next */ error => Promise.reject(error));
    }

    onFinish (values) {
        const { batters, pitchers, teams } = this.state;
        const players = [...batters, ...pitchers];

        if (values.gameId || values.pitcherId || values.batterId) {
            const gameIdPath = values.gameId ? `gameId=${values.gameId}` : '';
            const batterIdPath = values.batterId ? `batterId=${values.batterId}` : '';
            const pitcherIdPath = values.pitcherId ? `pitcherId=${values.pitcherId}` : '';
            const pathname = `?${[gameIdPath, batterIdPath, pitcherIdPath].filter(Boolean).join('&')}`;
            this.props.history.push({ search: pathname });

            return sibr.getEvents(values, players, teams)
                .then(results => {
                    console.log(results);
                    this.setState({ results: results && results.results, error: null });
                })
                .catch(/* istanbul ignore next */ error => this.setState({ error }));
        } else {
            this.setState({ error: 'You need to select at least one of these three fields!' });
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
        const defaultGame = new URLSearchParams(search).get('gameId');
        const defaultPitcher = new URLSearchParams(search).get('pitcherId');
        const defaultBatter = new URLSearchParams(search).get('batterId');

        const { error, results, batters, pitchers, teams, searchInput } = this.state;
        const csvLink = results && results.length ? (<CSVLink data={results}>Download CSV</CSVLink>) : '';
        const errorMessage = error ? <Alert closable message={error} type='error' /> : '';

        return (
            <Layout.Content>
                { errorMessage }
                <Form onFinish={this.onFinish} {...formLayout} style={{ padding: '10px 0' }}>
                    <Form.Item name='gameId' label='Game' initialValue={defaultGame}>
                        <Input placeholder='dc767612-eb77-417b-8d2f-c21eb4dab868' />
                    </Form.Item>
                    <Form.Item name='pitcherId' label='Pitcher' initialValue={defaultPitcher}>
                        <Select placeholder='Pitcher' options={pitchers} showSearch allowClear optionFilterProp='searchkey' />
                    </Form.Item>
                    <Form.Item name='batterId' label='Batter' initialValue={defaultBatter}>
                        <Select placeholder='Batter' options={batters} showSearch allowClear optionFilterProp='searchkey' />
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
                        columns={gameEventColumns(batters, pitchers, teams, searchInput, this.handleSearch, this.handleReset)}
                        {...tableLayout} />
                </div>
            </Layout.Content>
        );
    }
}

export default Events;
