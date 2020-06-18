/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Example} from './example';
import {Welcome} from './welcome';

const Routes = {
    index: Welcome,
    rich: Example,
};

type Props = {};
type State = {
    routeKey: string,
};

class App extends Component<Props, State> {
    state = {
        routeKey: 'index',
        args: {},
    };

    push = (routeKey, args) => {
        Routes[routeKey] && this.setState({routeKey, args});
    };

    render() {
        let that = this;
        let {routeKey, args = {}} = that.state;
        let Comp = Routes[routeKey];
        return <Comp navigation={that} {...args} />;
    }
}

export default App;
