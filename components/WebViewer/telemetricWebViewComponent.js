import React, {Component} from 'react';
import { Platform, StyleSheet, View, TouchableHighlight, Image, Text, Linking } from 'react-native'
import { WebView } from 'react-native-webview'
import {connect} from 'react-redux'
import {Navigate} from '../Helpers/Navigator'
import {recollector} from './injection/recollector'
import {getUserDetails} from '../../actions/userAction'
import {registerData} from '../../actions/appAction'
import {AlertMessage, MultipleOptionAlert} from '../Helpers/Alert';
import Geolocation from '@react-native-community/geolocation';

var RNFS = require('react-native-fs')

class TelemetricWebView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            html: "",
            coords: {
                lat: 0,
                lng: 0
            },
            scriptInjection: "",
            renderedOnce: false
        }
        this.getDocumentContent = this.getDocumentContent.bind(this)
        this.onMessage = this.onMessage.bind(this)
        this.onError = this.onError.bind(this)
        this.updateLocation = this.updateLocation.bind(this);
        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
        this.updateSource = this.updateSource.bind(this);
    }

    componentDidMount() {
        this.getDocumentContent(this.props.uri, "html")
        this.updateLocation()
        this.props.getUserDetails()
        this.updateLocation();
    }

    updateSource() {
        this.setState({renderedOnce: true});
    }

    getDocumentContent(path, prop) {
        RNFS.readFile(path, 'utf8')
        .then(content => {
            this.setState({
                [prop]: content
            })
        }).catch(err => { console.log(err) })
    }

    returnToLocalApps() {
        Navigate('navigation.home', { screen: "Local" });
    }

    updateLocation() {
        Geolocation.getCurrentPosition(info => {
            console.log(info)
            this.setState({
                coords: {
                    lat: info.coords.latitude,
                    lng: info.coords.longitude
                }
            })
        }, error => {
            console.log('on error', error);
        }, 
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
    }

    onMessage(e) {
        let receivedData = JSON.parse(e.nativeEvent.data);
        receivedData.name = this.props.appname;
        receivedData.appid = this.props.appid;
        receivedData.location = this.state.coords;
        receivedData.datetime = new Date().toLocaleString().split('/').join('-');
        receivedData.user = this.props.user.details.response.email;
        this.props.registerData({data: receivedData}, (ua) => {
            
            //AlertMessage("aaa", receivedData, () => {});
        });
    }

    onError(e) {
        console.log('casued error');
        console.log(e);
    }

    onNavigationStateChange(e) {
        if(e.url.startsWith("file://")){
            return true; 
        }
        else {
            Linking.openURL(e.url);
            return false;
        }
    }

    render() {
        console.log(this.props.uri);
        return (
            <View style={styles.WebContainer}>
                    <WebView 
                        injectedJavaScript={recollector}
                        source={this.state.renderedOnce ? {uri: "file://" + this.props.uri.replace(' ', '%20')} : undefined}
                        originWhitelist={["*"]}
                        style={styles.WebView}
                        startInLoadingState={true}
                        onMessage={this.onMessage}
                        allowUniversalAccessFromFileURLs={true}
                        allowFileAccess={true}
                        allowingReadAccessToURL={"file://" + this.props.uri.replace('index.html', '').replace(' ', '%20')}
                        mixedContentMode="always"
                        domStorageEnabled={true}
                        allowsInlineMediaPlayback={true}
                        onError={this.onError}
                        onShouldStartLoadWithRequest={this.onNavigationStateChange}
                        onLoad={this.updateSource}
                    />
                
                
                <TouchableHighlight onPress={() => this.returnToLocalApps()} style={styles.OverGestures}>
                    <View style={styles.OverGestureContainer}>
                        <Image style={styles.BackMenuImage} source={require('./img/back.png')}></Image> 
                    </View>
                </TouchableHighlight>
                
            </View>
        )
    }
}

const MapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(MapStateToProps, {getUserDetails, registerData})(TelemetricWebView);

const styles = StyleSheet.create({
    WebContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    WebView: {
        flex: 1,
        height: 100
    },
    OverGestures: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        height: 40
    },
    OverGestureContainer: {
        flex: 1,
        borderRadius: 50,
        backgroundColor: "#22398D", 
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 3
    },
    BackMenuImage: {
        width: 22,
        height: 14
    },
    BackMenuText: {
        color: "white",
        fontFamily: "Rubik-Medium",
        marginLeft: 5
    },
})