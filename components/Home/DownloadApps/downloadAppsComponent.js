import React, {Component} from 'react'
import {Platform, StyleSheet, Text, View, Image, Button, StatusBar, Dimensions, TouchableHighlight} from 'react-native'
import Modal from 'react-native-modal'
import {Navigate} from '../../Helpers/Navigator'
import {connect} from 'react-redux'
import {getDownlodableApps, downloadAppFiles} from '../../../actions/appAction'
import Apps from '../Utils/renderApps'

class downloadApps extends Component{

    constructor(props) {
        super(props);
        this.state = {
            app: {},
            modalVisible: false
        }
    }

    componentDidMount() {
        this.props.getDownlodableApps()
    }

    componentDidUpdate() {
        if(this.props.downloadableApps.cloudApps.message === "Unauthenticated.") {
            Navigate('navigation.home', { screen: 'Login' });
        }
    }

    showModal = (app) => {
        this.setState({
            app: app,
            modalVisible: true
        });
    }

    downloadApp = (app) => {
        this.props.downloadAppFiles(app);
        this.setState({
            modalVisible: false
        });
    }

    render() {
        return (
            <View style={styles.MainContainer}>
                <Text style={styles.HeaderTitle}> Download Applications </Text>
                <Apps appPackage={this.props.downloadableApps.cloudApps.data} callback={this.showModal} />
                <Modal isVisible={this.state.modalVisible} onBackdropPress={() => this.setState({ modalVisible: false })} onSwipeComplete={() => this.setState({ modalVisible: false })} swipeDirection="left">
                    <View style={styles.ModalContainer}>
                        <View style={styles.ModalHeader}> 
                            <Image style={styles.ModalAppImage} source={{uri: this.state.app.image}} />
                            <Text style={styles.ModalAppName}> {this.state.app.name} </Text>
                            <TouchableHighlight onPress={() => this.downloadApp(this.state.app)}>
                                <View style={styles.ModalDownloadButton}>
                                    <Text style={styles.ModalDownloadButtonText}> Download </Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.ModalBody}>
                            <Text> {this.state.app.description} </Text>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        downloadableApps: state.apps
    }
}

export default connect(mapStateToProps, {getDownlodableApps, downloadAppFiles})(downloadApps);

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        width: "100%"
    },
    HeaderTitle: {
        fontFamily: "Rubik-Medium",
        fontSize: 34,
        color: "#333333"
    },
    ModalContainer: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "column"
    },
    ModalHeader: {
        flexDirection: "row",
        width: "85%",
        height: 100,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        borderBottomColor: "#4c67ed",
        borderBottomWidth: 1,
        paddingBottom: 5,
        marginBottom: 20
    },
    ModalAppImage: {
        width: 75,
        height: 75,
        borderRadius: 10
    },
    ModalAppName: {
        fontFamily: "Rubik-Medium",
        fontSize: 34,
        width: "75%",
        paddingLeft: 15
    },
    ModalDownloadButton: {
        borderColor: "#4c67ed",
        borderWidth: 1,
        borderRadius: 10
    },
    ModalDownloadButtonText: {
        fontFamily: "Rubik-Medium",
        padding: 10
    },
    ModalBody: {
        flex: 1,
        fontFamily: "Rubik-Light",
        flexGrow: 1,
        width: "85%",
        alignItems: "center"
    }
});