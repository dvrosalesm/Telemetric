import { Navigation } from 'react-native-navigation'
import App from '../app'
import Login from './Login/loginComponent'
import Home from './Home/homeComponent'
import Main from './Main/mainComponent'
import TelemetricWebView from './WebViewer/telemetricWebViewComponent'

export function registerScreens(provider, store) {
    Navigation.registerComponentWithRedux('navigation.app', () => App, provider, store)
    Navigation.registerComponentWithRedux('navigation.main', () => Main, provider, store)
    Navigation.registerComponentWithRedux('navigation.login', () => Login, provider, store)
    Navigation.registerComponentWithRedux('navigation.home', () => Home, provider, store)
    Navigation.registerComponentWithRedux('navigation.webview', () => TelemetricWebView, provider, store)
}