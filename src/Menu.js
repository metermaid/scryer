import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu as AntMenu } from 'antd';

class Menu extends React.Component {
    render() {
        const { location } = this.props;
        return (
            <AntMenu theme='dark' mode='horizontal' selectedKeys={[location.pathname]}>
                <AntMenu.Item key='/'><Link to='/'>Event Logs</Link></AntMenu.Item>
                <AntMenu.Item key='/batter'><Link to='/batter'>Batter Stats</Link></AntMenu.Item>
                <AntMenu.Item key='/pitcher'><Link to='/pitcher'>Pitcher Stats</Link></AntMenu.Item>
            </AntMenu>
        );
    }
}

export default withRouter(Menu);
