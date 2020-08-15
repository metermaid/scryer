import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { Layout } from 'antd';
import About from './About';
import Menu from './Menu';
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
                            <Menu />
                        </Layout.Header>
                        <Route exact path='/' component={Home} />
                        <Route path='/batter' component={Batter} />
                        <Route path='/pitcher' component={Pitcher} />
                        <Route path='/about' component={About} />
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
