import {Navigation} from 'react-native-navigation';
import App from '../app';
import Login from './Login/loginComponent';
import Home from './Home/homeComponent';
import Main from './Main/mainComponent';
import TelemetricWebView from './WebViewer/telemetricWebViewComponent';
import {Provider} from 'react-redux';
import React from 'react';

export function registerScreens(prov, store) {
  Navigation.registerComponent(
    'navigation.app',
    () => (props) => (
      <Provider store={store}>
        <App />
      </Provider>
    ),
    () => App,
  );
  Navigation.registerComponent(
    'navigation.main',
    () => (props) => (
      <Provider store={store}>
        <Main />
      </Provider>
    ),
    () => Main,
  );
  Navigation.registerComponent('navigation.login', () => (props) => (
    <Provider store={store}>
      <Login />
    </Provider>
  ));
  Navigation.registerComponent('navigation.home', () => (props) => (
    <Provider store={store}>
      <Home />
    </Provider>
  ));
  Navigation.registerComponent('navigation.webview', () => (props) => (
    <Provider store={store}>
      <TelemetricWebView {...props} />
    </Provider>
  ));
}
