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
  scroll: { x: true }
};

class Events extends React.Component {
    constructor (props) {
        super(props);
        this.state = { results: null, batters: null, pitchers: null };
        this.onFinish = this.onFinish.bind(this);
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
        if (values.gameId || values.pitcherId || values.batterId) {
            return sibr.getEvents(values)
                .then(results => {
                    console.log(results);
                    this.setState({ results: results && results.results, error: null });
                })
                .catch(/* istanbul ignore next */ error => this.setState({ error }));
        } else {
            this.setState({ error: 'You need to select at least one of these three fields!' });
        }
    }

    render () {
      const { error, results, batters, pitchers, teams } = this.state;
      const csvLink = results && results.length ? (<CSVLink data={results}>Download CSV</CSVLink>) : '';
      const errorMessage = error ? <Alert closable message={error} type='error' /> : '';
      return (
            <Layout.Content>
                { errorMessage }
                <Form onFinish={this.onFinish} {...formLayout} style={{ padding: '10px 0' }}>
                    <Form.Item name='gameId' label='Game'>
                        <Input placeholder='dc767612-eb77-417b-8d2f-c21eb4dab868' />
                    </Form.Item>
                    <Form.Item name='pitcherId' label='Pitcher'>
                        <Select placeholder='Pitcher' options={pitchers} showSearch allowClear optionFilterProp='searchKey' />
                    </Form.Item>
                    <Form.Item name='batterId' label='Batter'>
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
                        columns={gameEventColumns(batters, pitchers, teams)}
                        {...tableLayout} />
                </div>
            </Layout.Content>
      );
    }
}

export default Events;
