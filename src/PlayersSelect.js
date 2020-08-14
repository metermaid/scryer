import React from 'react';

import Blaseball from './Blaseball';

class PlayersSelect extends React.PureComponent {
    constructor (props) {
        super(props);
        this.state = { players: null };
        this.getPlayers();
    }

    getPlayers() {
        Blaseball.getPlayers().then(/* istanbul ignore next */ data => {
            data && this.setState({
                players: data
            });
        })
        .catch(/* istanbul ignore next */ error => Promise.reject(error));
    }

    renderItems (data) {
        let body = [];

        data && data.forEach((value, index) => {
            body.push(value.name);
        });

        return body;
    }

    render () {
        const { players } = this.state;

        return (
            <div>
              { this.renderItems(players) }
            </div>);
    }
}

export default PlayersSelect;