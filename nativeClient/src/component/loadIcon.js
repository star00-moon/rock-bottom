import React, {Component} from 'react';
import {Animated, Easing} from "react-native";

export default class LogoTitle extends Component {

    constructor(props) {
        super(props);
        this.startAnimated = this.startAnimated.bind(this);
    }

    state = {
        opacity: new Animated.Value(0.5),
        scale: new Animated.Value(1),
    };

    componentDidMount(): void {
        this.startAnimated();
    }

    startAnimated() {
        Animated.sequence(
            [
                Animated.parallel([
                    Animated.timing(
                        this.state.opacity, {
                            toValue: 0.3,
                            duration: 600,
                            easing: Easing.bezier(0.51, 0.21, 0.78, 0.54)
                        }),
                    Animated.timing(
                        this.state.scale, {
                            toValue: 1.7,
                            duration: 1200,
                            easing: Easing.bezier(0.51, 0.21, 0.78, 0.54)
                        }),
                ]),
                Animated.parallel([
                    Animated.timing(
                        this.state.opacity, {
                            toValue: 0.4,
                            duration: 700,
                            easing: Easing.linear,
                        }),
                    Animated.timing(
                        this.state.scale, {
                            toValue: 1.2,
                            duration: 1200,
                            easing: Easing.linear,
                        }),
                ])
            ], {
                useNativeDriver: true,
            }
        ).start(this.startAnimated)
    }

    render() {
        return (
            <>
                <Animated.Text style={{
                    fontSize: 73,
                    color: '#816DE3',
                    position: 'absolute',
                    zIndex: 2,
                    ...this.props.style,
                }}>{this.props.content}</Animated.Text>
                <Animated.View style={{
                    width: 73,
                    height: 73,
                    borderRadius: 50,
                    backgroundColor: '#816DE3',
                    opacity: this.state.opacity,
                    transform: [{scale: this.state.scale}],
                    position: 'absolute',
                    zIndex: 1,
                }}/>
            </>
        );
    }
}
