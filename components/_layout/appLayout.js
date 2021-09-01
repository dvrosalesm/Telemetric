import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  StatusBar,
  Dimensions,
} from 'react-native';
import Menu from '../Menu/menuComponent';
import {connect} from 'react-redux';
import {getUserDetails, updateUserDetails} from '../../actions/userAction';

class AppLayout extends Component {
  constructor(props) {
    super(props);
    this.renderLogo = this.renderLogo.bind(this);
    this.state = {
      isMobile: false,
    };
  }

  componentDidMount() {
    this.props.getUserDetails();
    let dimensions = Dimensions.get('window');
    this.setState({isMobile: dimensions.height < 500});
  }

  renderLogo() {
    const componentStyles = styles(this.state.isMobile);
    if (
      this.props.user &&
      this.props.user.details &&
      this.props.user.details.response &&
      this.props.user.details.response.company
    ) {
      return (
        <Image
          style={componentStyles.TopBarClientLogo}
          source={{uri: this.props.user.details.response.company.logo}}
        />
      );
    } else return null;
  }

  render() {
    const componentStyles = styles(this.state.isMobile);

    return (
      <View style={componentStyles.MainContainer}>
        <StatusBar backgroundColor="#22398D" hidden={false} />
        <View style={componentStyles.StatusBarBackground}></View>
        <View style={componentStyles.TopBar}>
          <View style={componentStyles.TopBarLeft}>
            <Image
              style={componentStyles.TopBarSPLogo}
              source={require('./img/telemetric.png')}
            />
          </View>
          <View style={componentStyles.TopBarRight}>
            <this.renderLogo />
          </View>
        </View>
        <View style={componentStyles.MainUI}>
          <View style={componentStyles.Menu}>
            <Menu />
          </View>
          <View style={componentStyles.MainContent}>{this.props.children}</View>
        </View>
      </View>
    );
  }
}

const MapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(MapStateToProps, {getUserDetails, updateUserDetails})(
  AppLayout,
);

const {width, height} = Dimensions.get('window');

const styles = (isMobile) => {
  return StyleSheet.create({
    MainContainer: {
      flex: 1,
      backgroundColor: '#fcfcfc',
    },
    StatusBarBackground: {
      height: 20,
      width: '100%',
      backgroundColor: '#22398D',
    },
    MainUI: {
      flex: 1,
      flexDirection: 'row',
    },
    Menu: {
      width: isMobile ? 50 : 100,
    },
    MainContent: {
      flexGrow: 1,
      margin: 20,
    },
    TopBar: {
      backgroundColor: '#22398D',
      height: height * 0.15,
      width: '100%',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: 'white',
    },
    TopBarLeft: {
      height: height * 0.15,
      width: '50%',
      alignItems: 'flex-start',
    },
    TopBarRight: {
      height: height * 0.15,
      width: '50%',
      alignItems: 'flex-end',
    },
    TopBarSPLogo: {
      height: height * 0.1,
      width: 280,
      top: height * 0.01,
      left: width * 0.015,
      resizeMode: 'contain',
    },
    TopBarClientLogo: {
      height: height * 0.1,
      width: 100,
      top: height * 0.01,
      right: 50,
      resizeMode: 'contain',
    },
  });
};
