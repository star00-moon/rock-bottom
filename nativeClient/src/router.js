import React, {Component} from 'react';
import {createStackNavigator} from "react-navigation";
import Home from './page/home';
import Detail from './page/detail';
import AddModal from './component/addScreen'

const MainStack = createStackNavigator(
    {
        Home: {
            screen: Home,
        },
        Details: {
            screen: Detail,
        },
    },
    {
        initialRouteName: 'Home',
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#816DE3',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: '#E5DDDD',
                fontSize: 17,
            },
        },
    }
);

export const RootStack = createStackNavigator(
    {
        Main: {
            screen: MainStack,
        },
        AddModal: {
            screen: AddModal,
        },
    },
    {
        mode: 'modal',
        headerMode: 'none',
    }
);

export class OuterStack extends Component {
    static router = RootStack.router;

    render(): React.ReactNode {
        const {navigation} = this.props;

        return (
            <>
                <RootStack navigation={navigation}/>
            </>
        );
    }
}