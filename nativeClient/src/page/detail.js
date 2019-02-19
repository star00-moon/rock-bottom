import React from "react";
import {Text, View, TouchableWithoutFeedback, Linking} from "react-native";

const indexMapToPdfType = {
    '0': '解析',
    '1': '答案',
    '2': '题目',
};

export default class Details extends React.Component {
    static navigationOptions = ({navigation, navigationOptions}) => {
        const {params} = navigation.state;

        return {
            title: params.title,
            headerStyle: {
                backgroundColor: navigationOptions.headerTintColor,
            },
            headerTintColor: navigationOptions.headerStyle.backgroundColor,
            headerTitleStyle: {
                fontWeight: 'bold',
                color: navigationOptions.headerStyle.backgroundColor,
                fontSize: 17,
            },
        };
    };

    state = {
        realUrl: []
    };

    async componentDidMount(): void {
        const {params} = this.props.navigation.state;
        const urls = params ? params.urls : null;
        let pdf_an = `http://wangyijie.tk/service/detail/pdf?name=${urls[0]}.html`;
        let pdf_ta = `http://wangyijie.tk/service/detail/pdf?name=${urls[1]}.html`;
        let pdf_do = `http://wangyijie.tk/service/detail/pdf?name=${urls[2]}.html`;
        this.setState({realUrl: [pdf_an, pdf_ta, pdf_do]});
    }

    render() {
        const {params} = this.props.navigation.state;
        const title = params ? params.title : null;
        const {realUrl} = this.state;

        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                {realUrl.map((url, index) => (
                    <TouchableWithoutFeedback onPress={() => {
                        Linking.openURL(url);
                    }} key={index}>
                        <View style={{
                            padding: 13,
                            backgroundColor: '#816DE3',
                            borderRadius: 17,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 7,
                        }}>
                            <Text style={{
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: 'bold',
                            }}>
                                {title + indexMapToPdfType[index]}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                ))}
            </View>
        );
    }
}