import React from "react";
import {StatusBar, View, ListView, SafeAreaView, AsyncStorage} from "react-native";
import BrowseItem from '../component/browseItem';
import AddItem from '../component/addItem';
import ReactNativeHaptic from "react-native-haptic";

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Home extends React.Component {

    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params || {};

        return {
            headerTitle: "Rock Bottom",
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            dataSource: [],
        };
    }

    async componentDidMount(): void {
        let dataSource = [];
        let all_id = await AsyncStorage.getItem('all_key');
        if (all_id) {
            all_id = all_id.split('@@')
        } else {
            all_id = []
        }
        console.log(all_id, 'all@id');
        all_id.map(async (item, index) => {
            if (item !== '') {
                let data = await AsyncStorage.getItem(item);
                data = JSON.parse(data);
                console.log(all_id, '@data@');
                dataSource.push([data.name, data.color, [data.path.an, data.path.ta, data.path.do], item, data.star]);
            }
            if (index === all_id.length - 1) {
                this.setState({dataSource});
                console.log(dataSource)
            }
        });
    }

    _navigateToAddScreen = () => {
        ReactNativeHaptic.generate('impactMedium');
        this.props.navigation.navigate('AddModal', {onAdd: (DATA, id) => {
                console.log(DATA, 'data');
                // const DATA = {path: Redata(obj->@keys['an','ta','do'])_, ids: data, color: getColor(), name: title, star: false};
                let dataSource = this.state.dataSource;
                dataSource.pop();
                dataSource.push([DATA.name, DATA.color, [DATA.path.an, DATA.path.ta, DATA.path.do], id, DATA.star]);
                this.setState({dataSource});
            }});
    };

    render() {
        let dataSource = this.state.dataSource;
        dataSource.push('$ADD$');

        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ebebeb'}}>
                <StatusBar barStyle={'light-content'}/>
                <SafeAreaView>
                    <View style={{marginLeft: 19.5, marginRight: 19.5, marginBottom: 19.5}}>
                        <ListView
                            contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
                            dataSource={ds.cloneWithRows(dataSource)}
                            renderRow={(rowData, _, index) => {
                                if (index == this.state.dataSource.length - 1) {
                                    if (index % 2 === 0) {
                                        return (<AddItem onPress={this._navigateToAddScreen}
                                                         style={{marginRight: 14, marginTop: 16}}/>);
                                    } else {
                                        return (<AddItem onPress={this._navigateToAddScreen}
                                                         style={{marginLeft: 14, marginTop: 16}}/>);
                                    }
                                } else if (index % 2 === 0) {
                                    return (<BrowseItem isStar={rowData[4]} id={rowData[3]} onPress={() => {
                                        this.props.navigation.navigate('Details', {urls: rowData[2], title: rowData[0]})
                                    }} title={rowData[0]} style={{
                                        marginRight: 14,
                                        marginTop: 16,
                                        backgroundColor: rowData[1]
                                    }}/>);
                                } else {
                                    return (<BrowseItem isStar={rowData[4]} id={rowData[3]} onPress={() => {
                                        this.props.navigation.navigate('Details', {urls: rowData[2], title: rowData[0]})
                                    }} title={rowData[0]} style={{
                                        marginLeft: 14,
                                        marginTop: 16,
                                        backgroundColor: rowData[1]
                                    }}/>);
                                }
                            }}
                        />
                    </View>
                </SafeAreaView>
            </View>
        );
    }
}