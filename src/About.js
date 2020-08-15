import React from 'react';
import { Layout } from 'antd';

class About extends React.Component {
    render () {
      return (
            <Layout.Content className="site-layout-background">
                <p>Scryer is built to interact with SIBR's datablase, and would literally be nothing without SIBR. For more information on SIBR, <a href="https://github.com/Society-for-Internet-Blaseball-Research/sibr-faq"> visit the FAQ</a>.</p>
                <p>There are some features of the datablase API that are not built into scryer, so you may be interested in <a href="https://api.blaseball-reference.com/docs">using it directly</a>.</p>
                <p>A non-exhaustive list of people who are owed credits for the datablase include: Corvimae, lilserf, Sakimori, iliana, shibboh, tehstone.</p>
                <p>For feedback or questions, contact risky#9552 on the SIBR or blaseball discords.</p>
            </Layout.Content>
      );
    }
}

export default About;
