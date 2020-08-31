import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import About from './About';
import Menu from './Menu';
import Events from './Events';
import BatterStats from './BatterStats';
import PitcherStats from './PitcherStats';
import Games from './Games';

class App extends React.Component {
    render() {
        return (
            <BrowserRouter basename='/'>
                <div className='App'>
                    <Layout>
                        <Layout.Header>
                            <h1>Blaseball Scryer</h1>
                            <Menu />
                        </Layout.Header>
                        <Switch>
                            <Route path='/batter' component={BatterStats} />
                            <Route path='/pitcher' component={PitcherStats} />
                            <Route path='/games' component={Games} />
                            <Route path='/about' component={About} />
                            <Route path='/' component={Events} />
                        </Switch>
                    </Layout>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
