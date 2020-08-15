import React from 'react';
import { Alert, Button, Form, Select, Layout, Table } from 'antd';
import { CSVLink } from 'react-csv';
import LodashUniqWith from 'lodash/uniqWith';
import LodashIsEq from 'lodash/isEqual';

import Blaseball from './services/Blaseball';
import sibr from './services/SIBR';
import { pitcherAPIs } from './config/APIConfig';
import { pitcherStatColumns } from './config/ColumnsConfig';

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

class PitcherStats extends React.Component {
    constructor (props) {
        super(props);
        this.state = { error: null, pitchers: [], teams: [], results: [] };
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
        Blaseball.getPlayers('rotation').then(/* istanbul ignore next */ data => {
            data && this.setState({ pitchers: data});
        }).catch(/* istanbul ignore next */ error => Promise.reject(error));
    }

    onFinish (values) {
        const { pitchers, teams } = this.state;

        if (values.api) {
            return sibr.getPlayerAPI(values, pitchers, teams)
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
      const { error, pitchers, teams, results, searchInput } = this.state;
      const csvLink = results && results.length ? (<CSVLink data={results}>Download CSV</CSVLink>) : '';
      const errorMessage = error ? <Alert closable message={error} type='error' /> : '';

      return (
            <Layout.Content>
                { errorMessage }
                <Form onFinish={this.onFinish} {...formLayout} style={{ padding: '10px 0' }}>
                    <Form.Item name='api' label='API'>
                        <Select placeholder='API' required options={pitcherAPIs} showSearch allowClear />
                    </Form.Item>
                    <Form.Item name='pitcherId' label='Pitcher'>
                        <Select placeholder='Pitcher' options={pitchers} showSearch allowClear optionFilterProp='searchKey' />
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
                        columns={pitcherStatColumns(pitchers, teams, searchInput, this.handleSearch, this.handleReset)}
                        />
                </div>
            </Layout.Content>
      );
    }
}

export default PitcherStats;
