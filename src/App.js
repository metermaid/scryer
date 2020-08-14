import React from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Events from './Events';
import BatterStats from './BatterStats';
import PitcherStats from './PitcherStats';

class App extends React.Component {
    render() {
        return (
            <HashRouter basename='/'>
                <div className='App'>
                    <Layout>
                        <Layout.Header>
                            <h1>Blaseball Scryer</h1>
                            <Menu theme='dark' mode='horizontal'>
                                <Menu.Item key='1'><Link to='/'>Event Logs</Link></Menu.Item>
                                <Menu.Item key='2'><Link to='/batter'>Batter Stats</Link></Menu.Item>
                                <Menu.Item key='3'><Link to='/pitcher'>Pitcher Stats</Link></Menu.Item>
                            </Menu>
                        </Layout.Header>
                        <Route exact path='/' component={Home} />
                        <Route path='/batter' component={Batter} />
                        <Route path='/pitcher' component={Pitcher} />
                    </Layout>
                </div>
            </HashRouter>
        );
    }
}


const Home = () => <Events />
const Batter = () => <BatterStats />
const Pitcher = () => <PitcherStats />

export default App;
