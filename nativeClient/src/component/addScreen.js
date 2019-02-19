import React from "react";
import {Animated, AlertIOS, Text, TouchableWithoutFeedback, View, AsyncStorage} from "react-native";
import sub, {INSERT_N} from '../util/sub';
import ReactNativeHaptic from "react-native-haptic";
import LoadIcon from "./loadIcon";
import isUrl from '../util/isUrl';
import getColor from '../util/getColor';

const isAction = (obj) => {
    if (isUrl(obj)) {
        return obj;
    } else if (obj['null']) {
        return obj['null'];
    } else {
        return false;
    }
};

class RotateAdd extends React.Component {
    constructor(props) {
        super(props);
        this.startAnimated = this.startAnimated.bind(this);
    }

    state = {
        rotate: new Animated.Value(0),
        scale: new Animated.Value(1),
    };

    componentDidMount(): void {
        this.startAnimated('in');
    }

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
            case 'close':
                Animated.parallel([
                    Animated.timing(
                        this.state.rotate, {
                            toValue: 0,
                            duration: 210,
                        }),
                    Animated.timing(
                        this.state.scale, {
                            toValue: 1,
                            duration: 210,
                        }),
                ], {
                    useNativeDriver: true,
                }).start();
                break;
            case 'in':
                Animated.timing(
                    this.state.rotate, {
                        toValue: 135,
                        duration: 300,
                    }, {
                        useNativeDriver: true,
                    }
                ).start();
                break;
            default:
                break;
        }
    }

    render(): React.ReactNode {
        return (
            <>
                <TouchableWithoutFeedback
                    onPressIn={() => {
                        this.startAnimated('press-in')
                    }}
                    onPressOut={() => {
                        this.startAnimated('close')
                    }}
                    onPress={this.props.onPress}
                >
                    <Animated.Image
                        style={{
                            transform: [{scale: this.state.scale},
                                {
                                    rotate: this.state.rotate.interpolate({
                                        inputRange: [0, 135],
                                        outputRange: ['0deg', '135deg']
                                    })
                                }],
                            width: 28,
                            height: 28,
                            ...this.props.style,
                        }}
                        source={require('../assets/picture/item_add.png')}
                    />
                </TouchableWithoutFeedback>
            </>
        );
    }

}

class ClassificationSelection extends React.Component {
    constructor(props) {
        super(props);
        this.startAnimated = this.startAnimated.bind(this);
    }

    state = {
        classification: {},
        lastClassification: [],
        translateX: new Animated.Value(88),
        opacity: new Animated.Value(0),
    };

    async componentDidMount(): void {
        const response = await fetch(`http://wangyijie.tk/api/get/classification?subject=${this.props.subject}`);
        const data = await response.json();
        setTimeout(() => {
            this.setState({lastClassification: [data.classification]});
            this.setState({classification: data.classification});
            this.startAnimated('in');
        }, 600);
    }

    startAnimated(type = '') {
        switch (type) {
            case 'in':
                Animated.parallel([
                    Animated.timing(
                        this.state.opacity, {
                            toValue: 1,
                            duration: 300,
                        }
                    ),
                    Animated.timing(
                        this.state.translateX, {
                            toValue: 0,
                            duration: 300,
                        }),
                ], {
                    useNativeDriver: true,
                }).start();
                break;
            case 'close':
                Animated.parallel([
                    Animated.timing(
                        this.state.opacity, {
                            toValue: 0,
                            duration: 300,
                        }
                    ),
                    Animated.timing(
                        this.state.translateX, {
                            toValue: -88,
                            duration: 300,
                        }),
                ], {
                    useNativeDriver: true,
                }).start();
                break;
            default:
                break;
        }
    }

    render(): React.ReactNode {
        const classification = Object.keys(this.state.classification);
        classification.push('$BACK_BUTTON$');
        return (
            <>
                {classification.length > 1 ?
                    <Animated.View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: this.state.opacity,
                        transform: [{translateX: this.state.translateX}],
                    }}>
                        <>
                            <Text style={{
                                fontSize: 43,
                                color: '#9B9999',
                            }}>进一步选择</Text>
                            <View style={{
                                marginLeft: 19.5,
                                marginRight: 19.5,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                {classification.map((item, index) => {
                                    return (
                                        <TouchableWithoutFeedback onPress={() => {
                                            if (index !== classification.length - 1) {
                                                ReactNativeHaptic.generate('impactMedium');
                                                const action = isAction(this.state.classification[item]);
                                                if (action) {
                                                    const http_fl = action.split('/')[1];
                                                    const http_id = action.split('/')[3];
                                                    AlertIOS.prompt('确认', `是否添加该练习${item}?`, [
                                                        {
                                                            text: '取消',
                                                            style: 'cancel'
                                                        },
                                                        {
                                                            text: '确定', onPress: async (title) => {
                                                                this.setState({classification: []});
                                                                let response = await fetch(`http://wangyijie.tk/api/user/get/range?id=${http_id}&fl=${http_fl}&count=20`);
                                                                let data = await response.json();
                                                                console.log(data);
                                                                if (!data.why) {
                                                                    let ids = data.join(',');
                                                                    response = await fetch(`http://wangyijie.tk/service/detail/get?title=${title}&id=${ids}`);
                                                                    let Redata = await response.json();
                                                                    console.log(Redata);

                                                                    let allID = await AsyncStorage.getItem('all_key');
                                                                    if (!allID) {
                                                                        allID = []
                                                                    } else {
                                                                        allID = allID.split('@@')
                                                                    }
                                                                    const thisID = Math.random() * 200 + 'wyj';
                                                                    allID.push(thisID);
                                                                    const DATA = {
                                                                        path: Redata,
                                                                        ids: data,
                                                                        color: getColor(),
                                                                        name: title,
                                                                        star: false
                                                                    };
                                                                    await AsyncStorage.setItem(thisID, JSON.stringify(DATA));
                                                                    await AsyncStorage.setItem('all_key', allID.join('@@'));

                                                                    console.log(allID, '@@ALL_ID');
                                                                    console.log(DATA, '@@DATA');

                                                                    this.props.onAdd(DATA, thisID);

                                                                    this.startAnimated('close');
                                                                    setTimeout(() => {
                                                                        this.props.onClose('close')
                                                                    }, 180);
                                                                    console.log(this.state.lastClassification, 'close');
                                                                } else {
                                                                    AlertIOS.alert('注意', data.why);
                                                                    this.startAnimated('close');
                                                                    setTimeout(() => {
                                                                        this.props.onClose('close')
                                                                    }, 180);
                                                                    console.log(this.state.lastClassification, 'close');
                                                                }
                                                            }
                                                        }
                                                    ])
                                                } else if (index !== classification.length - 1) {
                                                    let lastClassification = this.state.lastClassification;
                                                    lastClassification.push(this.state.classification[item]);
                                                    this.setState({lastClassification: lastClassification});
                                                    this.setState({classification: this.state.classification[item]});
                                                    console.log(this.state.lastClassification)
                                                }
                                            }
                                        }} key={index}>
                                            <View style={{
                                                padding: 13,
                                                backgroundColor: '#d8d8d8',
                                                borderRadius: 17,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                margin: 2.5,
                                                marginTop: 7,
                                            }}>
                                                {index === classification.length - 1 ? <RotateAdd onPress={() => {
                                                        ReactNativeHaptic.generate('impactMedium');
                                                        let lastClassification = this.state.lastClassification;
                                                        lastClassification.pop();
                                                        let nowCount = lastClassification.length;
                                                        this.setState({lastClassification: lastClassification});
                                                        if (nowCount !== 0) {
                                                            this.setState({classification: this.state.lastClassification[nowCount - 1]});
                                                            this.startAnimated('in');
                                                            console.log(this.state.lastClassification);
                                                        } else {
                                                            this.startAnimated('close');
                                                            setTimeout(this.props.onClose, 180);
                                                            console.log(this.state.lastClassification, 'close');
                                                        }
                                                    }} style={{opacity: this.state.opacity}}/> :
                                                    <Text style={{
                                                        color: '#545454',
                                                        fontSize: 15,
                                                    }}>{item}</Text>}
                                            </View>
                                        </TouchableWithoutFeedback>
                                    );
                                })}
                            </View>
                        </>
                    </Animated.View> :
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <LoadIcon content="缘"/>
                    </View>
                }
            </>
        );
    }

}

export default class AddScreen extends React.Component {
    constructor(props) {
        super(props);
        this.startAnimated = this.startAnimated.bind(this);
        this._beginToSelectClassification = this._beginToSelectClassification.bind(this);
    }

    state = {
        subject: {},
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(173),
        isSelectingClassification: false,
        selectSubject: '',
    };

    async componentDidMount(): void {
        let response = await fetch('http://wangyijie.tk/api/get/subject');
        let data = await response.json();
        setTimeout(() => {
            this.setState({subject: data.subject});
            this.startAnimated('in')
        }, 600)
    }

    startAnimated(type = '') {
        switch (type) {
            case 'in':
                Animated.parallel([
                    Animated.timing(
                        this.state.opacity, {
                            toValue: 1,
                            duration: 300,
                        }
                    ),
                    Animated.timing(
                        this.state.translateY, {
                            toValue: 0,
                            duration: 300,
                        }),
                ], {
                    useNativeDriver: true,
                }).start();
                break;
            case 'close':
                Animated.parallel([
                    Animated.timing(
                        this.state.opacity, {
                            toValue: 0,
                            duration: 300,
                        }
                    ),
                    Animated.timing(
                        this.state.translateY, {
                            toValue: 173,
                            duration: 300,
                        }),
                ], {
                    useNativeDriver: true,
                }).start();
                break;
            default:
                break;
        }
    }

    _givUpAdd = () => {
        ReactNativeHaptic.generate('impactMedium');
        this.startAnimated('close');
        setTimeout(this.props.navigation.goBack, 80);
    };

    _beginToSelectClassification = (selectSubject) => {
        ReactNativeHaptic.generate('impactMedium');
        this.setState({selectSubject});
        this.startAnimated('close');
        setTimeout(() => {
            this.setState({isSelectingClassification: true})
        }, 80);
    };

    render() {
        const subjectArray = Object.keys(this.state.subject);
        subjectArray.push('$CLOSE_BUTTON$');

        const {params} = this.props.navigation.state;
        const onAdd = params ? params.onAdd : null;

        if (this.state.isSelectingClassification) {
            return (
                <ClassificationSelection subject={this.state.selectSubject} onClose={(flag) => {
                    this.startAnimated('in');
                    this.setState({isSelectingClassification: false});
                    if (flag === 'close') {
                        this._givUpAdd();
                    }
                }} onAdd={onAdd}/>
            );
        } else {
            return (
                <>
                    {subjectArray.length > 1 && !this.state.isSelectingClassification ?
                        <Animated.View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: this.state.opacity,
                            transform: [{translateY: this.state.translateY}],
                        }}>
                            <>
                                <Text style={{
                                    fontSize: 43,
                                    color: '#9B9999',
                                }}>请选择科目</Text>
                                <View style={{
                                    marginLeft: 19.5,
                                    marginRight: 19.5,
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    {subjectArray.map((item, index) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => {
                                                if (index !== subjectArray.length - 1) {
                                                    this._beginToSelectClassification(item);
                                                }
                                            }} key={index}>
                                                <View style={{
                                                    width: 73,
                                                    height: 73,
                                                    backgroundColor: '#d8d8d8',
                                                    borderRadius: 50,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    margin: 2.5,
                                                    marginTop: 7,
                                                }}>
                                                    {index === subjectArray.length - 1 ? <RotateAdd onPress={() => {
                                                            this._givUpAdd()
                                                        }} style={{opacity: this.state.opacity}}/> :
                                                        <Text style={{
                                                            color: '#545454',
                                                            fontSize: 15,
                                                        }}>{sub(item, '题库', INSERT_N)}</Text>}
                                                </View>
                                            </TouchableWithoutFeedback>
                                        );
                                    })}
                                </View>
                            </>
                        </Animated.View>
                        : <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <LoadIcon content="缘"/>
                        </View>}
                </>
            );
        }
    }
}