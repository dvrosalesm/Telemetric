import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Button, StatusBar, Dimensions} from 'react-native';
import {connect} from 'react-redux'
import {Navigate} from '../../Helpers/Navigator'
import Loader from '../../Helpers/Loader';
import {getLocalApps, getDownlodableApps, downloadAppFiles, deleteApp, cancelAppDownload} from '../../../actions/appAction'
import Apps from '../Utils/renderApps'
import {AlertMessage, MultipleOptionAlert} from '../../Helpers/Alert';

class localApps extends Component{

    constructor(props) {
        super(props);
        this.showAppOptions = this.showAppOptions.bind(this);
        this.onAppDownloadFail = this.onAppDownloadFail.bind(this);
        this.onAppDownloadSuccess = this.onAppDownloadSuccess.bind(this);
        this.cancelAppDownload = this.cancelAppDownload.bind(this);
        this.state = {
            loading: false,
            showDeletionComplete: false
        }
    }

    componentDidMount() {
        this.props.getDownlodableApps();
        if(this.props.LocalApps.message === "Unauthenticated.") {
            Navigate('navigation.home', { screen: 'Login' });
        }
    }

    showWebView(app) {
        app.indexPath = (app.indexPath.endsWith('/index.html')) ? app.indexPath : app.indexPath + '/index.html'; 
        Navigate('navigation.webview', { uri: app.indexPath, appname: app.name, appid: app.id });
    }

    downloadApp(app) {
        this.props.downloadAppFiles(app, () => {this.onAppDownloadSuccess()}, () => {this.onAppDownloadFail()});
    }

    deleteApp(app) {
        this.setState({
            loading: true,
            showDeletionComplete: false
        });
        this.props.deleteApp(app, () => {
            AlertMessage("App Eliminada", "La aplicación ha sido eliminada correctamente", 
            () => {
                this.setState({
                    loading: false
                });
            });

        });
    } 

    cancelAppDownload(app) {
        this.props.cancelAppDownload(app, () => {
            AlertMessage("Descarga cancelada", "La descarga se ha cancelado correctamente", () => {
            });
        });
    }

    componentDidUpdate() {
        if(this.state.showDeletionComplete) {
            AlertMessage("App Eliminada", "La aplicación ha sido eliminada correctamente", 
            () => {});
            this.setState({showDeletionComplete: false});
        }
    }

    showAppOptions(app) {
        if(app.hasOwnProperty("finishedDownload") && !app.finishedDownload) {
            MultipleOptionAlert(app.name, "El app se encuentra descargando", 
            [
                {text: "Cancelar descarga", onPress: () => {this.cancelAppDownload(app);}},
                {text: "Continuar descarga", onPress: () => {}}
            ]);
            return; 
        }

        if(app.isLocal) {
            MultipleOptionAlert(app.name, "Selecciona una opción", 
            [
                {text: "Reproducir", onPress: () => {this.showWebView(app);}},  
                {text: "Eliminar", onPress: () => {this.deleteApp(app);}},
                {text: "Cancelar", onPress: () => {console.log('cancel');}}
            ]);
        } else {
            MultipleOptionAlert(app.name, "Selecciona una opción", 
            [
                {text: "Cancelar", onPress: () => {console.log('cancel');}},
                {text: "Descargar", onPress: () => {this.downloadApp(app);}}
            ]);
        }
    }

    onAppDownloadSuccess() {
        // AlertMessage("Atención", "La descarga ha finalizado.", () => {});
        this.props.getDownlodableApps();
    }

    onAppDownloadFail(app) {
        AlertMessage("Atención", "La descarga del recurso " + app.name +  " ha fallado por favor intentar de nuevo.");
    } 

    render() {
        return (
            <View style={styles.MainContainer}>
                <Loader loading={this.state.loading} />
                <Text style={styles.HeaderTitle}> Mis recursos </Text>
                <Apps appPackage={this.props.LocalApps} 
                callback={this.showAppOptions} 
                callbackLong={this.showAppOptions}
                isObject={true}
                 /> 
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        LocalApps: state.apps.localApps
    }
}

const mapDispatchToProps = () => {
    return {
        getDownlodableApps,
        getLocalApps
    }
}

export default connect(mapStateToProps, {getDownlodableApps, downloadAppFiles, deleteApp, cancelAppDownload})(localApps)

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        width: "100%"
    },
    HeaderTitle: {
        fontFamily: "Rubik-Medium",
        fontSize: 34
    }
});