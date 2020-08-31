import React from 'react';
import { Alert, Button, Form, Select, Layout, Table } from 'antd';
import { CSVLink } from 'react-csv';
import LodashUniqWith from 'lodash/uniqWith';
import LodashIsEq from 'lodash/isEqual';

import Blaseball from './services/Blaseball';
import sibr from './services/SIBR';
import { batterAPIs } from './config/APIConfig';
import { playerStatColumns } from './config/ColumnsConfig';

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

class BatterStats extends React.Component {
    constructor (props) {
        super(props);
        this.state = { error: null, batters: [], teams: [], results: [] };
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
    }

    onFinish (values) {
        const { batters, teams } = this.state;

        if (values.api) {
            const pathname = `?api=${values.api}&id=${values.batterId}`;
            this.props.history.push({ search: pathname });
            return sibr.getPlayerAPI(values, batters, teams)
                .then(results => {
                    console.log(results);
                    if (results && results.results) {
                        const newResultsWithAPI = results.results.map(result => { return {...result, api: values.api }});
                        this.setState({results: LodashUniqWith(this.state.results.concat(newResultsWithAPI), LodashIsEq), error: null });
                    }
                })
                .catch(/* istanbul ignore next */ error => this.setState({ error }));
        } else {
            this.setState({ error: 'You need to select an API!' });
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
        const defaultAPI = new URLSearchParams(search).get('api');
        const defaultID = new URLSearchParams(search).get('id');
        const { error, batters, teams, results, searchInput } = this.state;
        const csvLink = results && results.length ? (<CSVLink data={results}>Download CSV</CSVLink>) : '';
        const errorMessage = error ? <Alert closable message={error} type='error' /> : '';

        return (
            <Layout.Content>
                { errorMessage }
                <Form onFinish={this.onFinish} {...formLayout} style={{ padding: '10px 0' }}>
                    <Form.Item name='api' label='API' initialValue={defaultAPI}>
                        <Select placeholder='API' required options={batterAPIs} showSearch allowClear />
                    </Form.Item>
                    <Form.Item name='batterId' label='Batter' initialValue={defaultID}>
                        <Select placeholder='Batter' options={batters} showSearch allowClear optionFilterProp='searchKey' />
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
                        scroll={{ x: 'max-content' }}
                        columns={playerStatColumns(batters, teams, searchInput, this.handleSearch, this.handleReset)}
                        />
                </div>
            </Layout.Content>
        );
    }
}

export default BatterStats;
