import React from 'react';
import {View, StyleSheet, Text, Animated, TouchableWithoutFeedback, AsyncStorage} from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';

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

class ActionStar extends React.Component {

    constructor(props) {
        super(props);
        this.startAnimated = this.startAnimated.bind(this);
        this.state = {
            sadScale: new Animated.Value(props.happy ? 0 : 1),
            sadOpacity: new Animated.Value(props.happy ? 0 : 1),

            happyScale: new Animated.Value(props.happy ? 1 : 0),
            happyOpacity: new Animated.Value(props.happy ? 1 : 0),
        };
    }

    startAnimated(isReverse = false) {
        ReactNativeHaptic.generate('impactMedium');
        // TODO: 星星按压稍缩小动效
        Animated.parallel([
            Animated.timing(
                this.state.sadScale, {
                    toValue: isReverse ? 1 : 0,
                    duration: 300,
                }),
            Animated.timing(
                this.state.sadOpacity, {
                    toValue: isReverse ? 1 : 0,
                    duration: 300,
                }),
            Animated.timing(
                this.state.happyScale, {
                    toValue: isReverse ? 0 : 1,
                    duration: 300,
                }),
            Animated.timing(
                this.state.happyOpacity, {
                    toValue: isReverse ? 0 : 1,
                    duration: 300,
                }),
        ], {
            useNativeDriver: true,
        }).start();
    }

    render(): React.ReactNode {
        return (
            <>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.startAnimated(false);
                        this.props.onStar(true);
                    }}
                >
                    <Animated.Image
                        style={{
                            ...style.star,
                            transform: [{scale: this.state.sadScale}],
                            opacity: this.state.sadOpacity
                        }}
                        source={require('../assets/picture/star_sad.png')}
                    />
                </TouchableWithoutFeedback>
                {/*=========================================================*/}
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.startAnimated(true);
                        this.props.onStar(false);
                    }}
                >
                    <Animated.Image style={{
                        ...style.star,
                        transform: [{scale: this.state.happyOpacity}],
                        opacity: this.state.happyOpacity
                    }} source={require('../assets/picture/star_happy.png')}/>
                </TouchableWithoutFeedback>
            </>
        );
    }
}

export default class BrowseItem extends React.Component {

    render(): React.ReactNode {
        const {title} = this.props;
        return (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <View style={{...style.container, ...this.props.style}}>
                    <ActionStar happy={this.props.isStar} onStar={async (isStar) => {
                        let detailFromDisk = await AsyncStorage.getItem(this.props.id);
                        let jsonData = JSON.parse(detailFromDisk);
                        let resultData = JSON.stringify({...jsonData, star: isStar});
                        await AsyncStorage.setItem(this.props.id, resultData);
                        console.log(isStar ? 'star ok' : 'un star ok')
                    }}/>
                    <Text style={style.title}>{title}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}