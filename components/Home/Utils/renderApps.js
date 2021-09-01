import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';

export default class renderApps extends Component {
  constructor(props) {
    super(props);
    this.renderArray = this.renderArray.bind(this);
    this.renderObject = this.renderObject.bind(this);
    this.renderDescription = this.renderDescription.bind(this);

    this.state = {
      isMobile: false,
    };
  }

  componentDidMount() {
    let dimensions = Dimensions.get('window');
    this.setState({isMobile: dimensions.height < 500});
  }

  renderArray() {
    let componentStyle = styles(this.state.isMobile);
    return (
      <ScrollView>
        <View style={componentStyle.AppsContainer}>
          {this.props.appPackage.map((app, i) => {
            return (
              <View key={i} style={componentStyle.AppItemContainer}>
                <TouchableOpacity
                  onPress={() => this.props.callback(app)}
                  onLongPress={() => this.props.callbackLong(app)}>
                  <View style={componentStyle.AppItem}>
                    <Image
                      style={componentStyle.AppImage}
                      source={{uri: app.image, cache: 'force-cache'}}
                    />
                    <View style={componentStyle.AppContent}>
                      <Text style={componentStyle.AppTitle}> {app.name} </Text>

                      <Text style={componentStyle.AppDescription}>
                        {' '}
                        {app.description.length > 105
                          ? app.description.substr(0, 105) + '...'
                          : app.description}{' '}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  renderObject() {
    let componentStyle = styles(this.state.isMobile);
    if (Object.keys(this.props.appPackage).length > 0)
      return (
        <ScrollView>
          <View style={componentStyle.AppsContainer}>
            {Object.keys(this.props.appPackage).map((appKey, i) => {
              return (
                <View key={i} style={componentStyle.AppItemContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.callback(this.props.appPackage[appKey])
                    }
                    onLongPress={() =>
                      this.props.callbackLong(this.props.appPackage[appKey])
                    }>
                    <View style={componentStyle.AppItem}>
                      <View>
                        <Image
                          style={componentStyle.AppImage}
                          source={{uri: this.props.appPackage[appKey].image}}
                        />
                        {this.props.appPackage[appKey].isLocal &&
                          this.props.appPackage[appKey].finishedDownload ===
                            false && (
                            <ActivityIndicator
                              size="large"
                              color="#ffffff"
                              style={
                                componentStyle.loadingIcon
                              }></ActivityIndicator>
                          )}
                      </View>
                      <View style={componentStyle.AppContent}>
                        <View style={componentStyle.AppTitleWrapper}>
                          <Text style={componentStyle.AppTitle}>
                            {' '}
                            {this.props.appPackage[appKey].name}{' '}
                          </Text>
                          {this.props.appPackage[appKey].isLocal &&
                            this.props.appPackage[appKey].finishedDownload && (
                              <Image
                                source={require('./success.png')}
                                style={componentStyle.localIcon}></Image>
                            )}
                        </View>
                        <this.renderDescription
                          app={this.props.appPackage[appKey]}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      );
    else
      return (
        <View>
          <Text style={componentStyle.AppsLoading}>
            No se han encontrado recursos
          </Text>
        </View>
      );
  }

  renderDescription(props) {
    let componentStyle = styles(this.state.isMobile);
    if (
      !props.app.hasOwnProperty('finishedDownload') ||
      props.app.finishedDownload === true
    )
      return (
        <Text style={componentStyle.AppDescription}>
          {' '}
          {props.app.description.length > 105
            ? props.app.description.substr(0, 105) + '...'
            : props.app.description}{' '}
        </Text>
      );
    else props.app.finishedDownload === false;
    return <Text style={componentStyle.IsDownloading}> Descargando </Text>;
  }

  render() {
    let componentStyle = styles(this.state.isMobile);

    if (
      this.props.appPackage == null ||
      typeof this.props.appPackage === 'undefined'
    )
      return null;
    return this.props.isObject ? this.renderObject() : this.renderArray();
  }
}

const styles = (isMobile) => {
  return StyleSheet.create({
    AppsLoading: {
      textAlign: 'center',
    },
    AppsContainer: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      overflow: 'scroll',
      height: '100%',
      width: '100%',
      flexGrow: 1,
    },
    AppItemContainer: {
      position: 'relative',
      borderWidth: 1,
      borderColor: 'white',
      width: isMobile ? '87%' : '29%',
      height: 75,
      margin: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: 'white',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowRadius: 5,
      shadowOpacity: 0.1,
      elevation: 3,
    },
    AppItem: {
      flexDirection: 'row',
    },
    AppContent: {
      paddingRight: 10,
      paddingLeft: 10,
      flex: 1,
    },
    AppImage: {
      width: 50,
      height: 50,
      borderRadius: 10,
      backgroundColor: 'gray',
    },
    AppTitleWrapper: {
      flexDirection: 'row',
      textAlignVertical: 'center',
    },
    AppTitle: {
      fontFamily: 'Rubik-Medium',
      fontSize: 14,
      textAlignVertical: 'center',
      color: 'black',
    },
    AppDescription: {
      fontFamily: 'Rubik-Light',
      fontSize: 12,
      height: 40,
      color: 'black',
    },
    IsDownloading: {
      color: 'green',
      fontFamily: 'Rubik-Light',
      fontSize: 12,
    },
    localIcon: {
      width: 10,
      height: 10,
      marginTop: 3,
    },
    loadingIcon: {
      position: 'absolute',
      backgroundColor: 'rgba(0,0,0,0.3)',
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
  });
};
