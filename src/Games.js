import React from 'react';
import { Alert, Button, Form, InputNumber, Layout, Table } from 'antd';
import { CSVLink } from 'react-csv';
import LodashUniqWith from 'lodash/uniqWith';
import LodashIsEq from 'lodash/isEqual';
import { gameAPIColumns } from './config/ColumnsConfig';

import Blaseball from './services/Blaseball';

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

class Games extends React.Component {
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
        Blaseball.getPlayers('lineup').then(/* istanbul ignore next */ data => {
            data && this.setState({ batters: data});
        }).catch(/* istanbul ignore next */ error => Promise.reject(error));
        Blaseball.getPlayers('rotation').then(/* istanbul ignore next */ data => {
            data && this.setState({ pitchers: data});
        }).catch(/* istanbul ignore next */ error => Promise.reject(error));
    }

    onFinish (values) {
        if (values.season && values.day) {
            return Blaseball.getGames(parseInt(values.season) - 1, parseInt(values.day) - 1)
                .then(results => {
                    this.setState({results: LodashUniqWith(results.concat(this.state.results), LodashIsEq), error: null });
                })
                .catch(/* istanbul ignore next */ error => this.setState({ error }));
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
      const { batters, pitchers, teams, error, results, searchInput } = this.state;
      const csvLink = results && results.length ? (<CSVLink data={results}>Download CSV</CSVLink>) : '';
      const errorMessage = error ? <Alert closable message={error} type='error' /> : '';

      return (
            <Layout.Content>
                { errorMessage }
                <Form onFinish={this.onFinish} {...formLayout} style={{ padding: '10px 0' }}>
                    <Form.Item name='season' label='Season' initialValue={4}>
                        <InputNumber placeholder={4} min={1} max={4} />
                    </Form.Item>

                    <Form.Item name='day' label='Day' initialValue={3}>
                        <InputNumber placeholder={2} min={1} max={1000} />
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
