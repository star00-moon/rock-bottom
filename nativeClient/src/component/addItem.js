import React from 'react';
import {View, StyleSheet, Text, Animated, TouchableWithoutFeedback} from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';
import getColor from '../util/getColor';

const style = StyleSheet.create({
    container: {
        width: 154,
        height: 217,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    star: {
        width: 27,
        height: 27,
        position: 'absolute',
        top: 10,
        right: 10,
    },
    title: {
        fontSize: 28,
        color: '#595858',
    },
});

class ActionAdd extends React.Component {

    constructor(props) {
        super(props);
        this.startAnimated = this.startAnimated.bind(this);
    }

    state = {
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1),
    };

    startAnimated(type = '') {
        switch (type) {
            case 'press-in':
                Animated.timing(this.state.scale, {
                    toValue: 0.8,
                    duration: 300,
                }, {
                    useNativeDriver: true,
                }).start();
                break;
            case 'press-out':
                Animated.sequence(
                    [
                        Animated.parallel([
                            Animated.timing(
                                this.state.scale, {
                                    toValue: 3.4,
                                    duration: 180,
                                }),
                            Animated.timing(
                                this.state.opacity, {
                                    toValue: 0,
                                    duration: 180,
                                }),
                        ]),
                        Animated.parallel([
                            Animated.timing(
                                this.state.scale, {
                                    toValue: 1,
                                    duration: 10,
                                }),
                            Animated.timing(
                                this.state.opacity, {
                                    toValue: 1,
                                    duration: 10,
                                }),
                        ]),
                    ], {
                        useNativeDriver: true
                    }).start();

                break;
            default:
                break;
        }
    }

    render(): React.ReactNode {
        return (
            <>
                <TouchableWithoutFeedback
                    onPressIn={() => {this.startAnimated('press-in')}}
                    onPressOut={() => {this.startAnimated('press-out')}}
                    onPress={this.props.onPress}
                >
                    <Animated.Image
                        style={{
                            transform: [{scale: this.state.scale}],
                            opacity: this.state.opacity,
                        }}
                        source={require('../assets/picture/item_add.png')}
                    />
                </TouchableWithoutFeedback>
            </>
        );
    }
}


export default class AddItem extends React.Component {
    render(): React.ReactNode {
        return (
            <View style={{
                backgroundColor: '#FFFFFF',
                opacity: 0.33,
                width: 154,
                height: 217,
                borderRadius: 18,
                borderWidth: 6,
                borderColor: '#898989',
                justifyContent: 'center',
                alignItems: 'center',
                boxSizing: 'border-box',
                ...this.props.style,
            }}>
                <ActionAdd onPress={this.props.onPress}/>
            </View>
        )
    }
};