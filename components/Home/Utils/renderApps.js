import React, {Component} from 'react'
import { Platform, StyleSheet, View, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native'

export default class renderApps extends Component {

    constructor(props) {
        super(props)
        this.renderArray = this.renderArray.bind(this)
        this.renderObject = this.renderObject.bind(this)
    }

    renderArray() {
        return (
            <View style={styles.AppsContainer}>
                {this.props.appPackage.map( (app, i) => {
                    return <View key={i} style={styles.AppItemContainer}>
                        <TouchableOpacity 
                        onPress={() => this.props.callback(app)} 
                        onLongPress={() => this.props.callbackLong(app)}>
                            <View style={styles.AppItem} >
                                <Image style={styles.AppImage} source={{uri: app.image, cache: "force-cache"}}  />
                                <View style={styles.AppContent}>
                                    <Text style={styles.AppTitle}> {app.name} </Text>
                                    
                                    <Text style={styles.AppDescription}> {(app.description.length > 105) ? app.description.substr(0, 105) + "..." : app.description} </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>})
                }
            </View>
        )
    }

    renderObject() {
        if(Object.keys(this.props.appPackage).length > 0)
            return (
                <View style={styles.AppsContainer}>
                    {Object.keys(this.props.appPackage).map( (appKey, i) => {
                        return <View key={i} style={styles.AppItemContainer}>
                            <TouchableOpacity 
                            onPress={() => this.props.callback(this.props.appPackage[appKey])}
                            onLongPress={() => this.props.callbackLong(this.props.appPackage[appKey])}>
                                <View style={styles.AppItem} >
                                    <View>
                                        <Image style={styles.AppImage} source={{uri: this.props.appPackage[appKey].image}} />
                                        { this.props.appPackage[appKey].isLocal && this.props.appPackage[appKey].finishedDownload === false &&
                                            <ActivityIndicator size="large" color="#ffffff" style={styles.loadingIcon}></ActivityIndicator>
                                        }
                                    </View>
                                    <View style={styles.AppContent}>
                                        <View style={styles.AppTitleWrapper}>
                                            <Text style={styles.AppTitle}> {this.props.appPackage[appKey].name} </Text> 
                                            { this.props.appPackage[appKey].isLocal && this.props.appPackage[appKey].finishedDownload &&
                                                <Image source={require('./success.png')} style={styles.localIcon}></Image>
                                            }
                                        </View>
                                        <this.renderDescription app={this.props.appPackage[appKey]} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>})
                    }
                </View>
            )
        else
            return (
                <View>
                    <Text style={styles.AppsLoading}>No se han encontrado recursos</Text>
                </View>
            );
    }

    renderDescription(props) {
        if(!props.app.hasOwnProperty('finishedDownload') || props.app.finishedDownload === true ) 
            return <Text style={styles.AppDescription}> {(props.app.description.length > 105) ? props.app.description.substr(0, 105) + "..." : props.app.description} </Text>;
        else (props.app.finishedDownload === false)
        return <Text style={styles.IsDownloading}> Descargando </Text>;
    }   

    render() {
        if(this.props.appPackage == null || typeof this.props.appPackage === 'undefined')
            return (null);
        return (this.props.isObject) ? this.renderObject() : this.renderArray()
    }
}

const styles = StyleSheet.create({
    AppsLoading: {
        textAlign: "center"
    },
    AppsContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: 'wrap'
    },
    AppItemContainer: {
        borderWidth: 1,
        borderColor: "white",
        width: "29%",
        height: 75,
        margin: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "white",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 3
    },
    AppItem: {
        flexDirection: "row",
    },
    AppContent: {
        paddingRight: 10,
        paddingLeft: 10,
        flex: 1
    },
    AppImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: "gray"
    },
    AppTitleWrapper: {
        flexDirection: "row",
        textAlignVertical: "center"
    },
    AppTitle: {
        fontFamily: "Rubik-Medium",
        fontSize: 14,
        textAlignVertical: "center",
        color: "black"
    },
    AppDescription: {
        fontFamily: "Rubik-Light",
        fontSize: 12,
        height: 40,
        color: "black"
    },  
    IsDownloading: {
        color: "green",
        fontFamily: "Rubik-Light",
        fontSize: 12,
    },
    localIcon: {
        width: 10,
        height: 10,
        marginTop: 3
    },
    loadingIcon: {
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.3)",
        width: "100%",
        height: "100%",
        borderRadius: 10
    }
})