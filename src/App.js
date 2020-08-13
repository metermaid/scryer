import React from 'react';
import { Button, Form, Input, Select, Table, Layout } from 'antd';
import Blaseball from './Blaseball';
import events from './events';
import columns from './columns';

//import PlayersSelect from './PlayersSelect';
import sibr from './sibr';

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const tableLayout = {
  scroll: { x: true }
};

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = { results: null, batters: null, pitchers: null };
        this.onFinish = this.onFinish.bind(this);
    }

    componentDidMount () {
        this.getPlayers();
    }

    getPlayers() {
        Blaseball.getPlayers('lineup').then(/* istanbul ignore next */ data => {
            data && this.setState({ batters: data});
        }).catch(/* istanbul ignore next */ error => Promise.reject(error));
        Blaseball.getPlayers('rotation').then(/* istanbul ignore next */ data => {
            data && this.setState({ pitchers: data});
        }).catch(/* istanbul ignore next */ error => Promise.reject(error));
    }

    onFinish (values) {
        sibr.getEvents(values)
            .then(results => {
                console.log(results);
                this.setState({ results: results && results.results });
            })
            .catch(/* istanbul ignore next */ error => Promise.reject(error));
    }

    render () {
      const { results, batters, pitchers } = this.state;
      return (
        <div className='App'>
            <Layout>
                <Layout.Header theme="dark" style={{ padding: '0 200px' }}>
                    <img src='logo192.png' className='logo' />
                    <h1>SIBR Scryer</h1>
                </Layout.Header>
                <Layout.Content style={{ padding: '0 200px' }}>
                    <Form onFinish={this.onFinish} {...formLayout} style={{ padding: '10px 0' }}>
                        <Form.Item name='gameId' label='Game (optional)'>
                            <Input placeholder='dc767612-eb77-417b-8d2f-c21eb4dab868' />
                        </Form.Item>
                        <Form.Item name='pitcherId' label='Pitcher (optional)'>
                            <Select placeholder='Pitcher' options={pitchers} showSearch allowClear optionFilterProp='label' />
                        </Form.Item>
                        <Form.Item name='batterId' label='Batter (optional)'>
                            <Select placeholder='Batter' options={batters} showSearch allowClear optionFilterProp='label' />
                        </Form.Item>
                        <Form.Item name='type' label='Type (optional)'>
                            <Select options={events.gameEvents} showSearch allowClear />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type='primary' htmlType='submit'>
                              Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    <div className='results-list'>
                        <Table dataSource={results} columns={columns.gameEventColumns} {...tableLayout} />
                    </div>
                </Layout.Content>
            </Layout>
        </div>
      );
    }
}

export default App;
