import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Button, StatusBar, Dimensions} from 'react-native';
import AppLayout from '../_layout/appLayout';
import LocalApps from './LocalApps/localAppsComponent';
import DownloadApps from './DownloadApps/downloadAppsComponent';
import {goToLogin} from '../Helpers/Startup';

export default class home extends Component{

    renderScreen(screen) {
        switch(screen) {
            case "Local":
                return <LocalApps />
            case "Download":
                return <DownloadApps />
            case "Login":
                return goToLogin();
            default:
                return <LocalApps />
        }
    }

    render() {
        return (
            <AppLayout>
                {this.renderScreen(this.props.screen)}
            </AppLayout>
        )
    }
}
