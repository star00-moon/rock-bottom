import React from 'react';
import {createAppContainer} from 'react-navigation'; // 1.0.0-beta.27
import {OuterStack} from "./router";

const AppContainer = createAppContainer(OuterStack);

export default class App extends React.Component {

    render() {
        return <AppContainer/>;
    }
}
