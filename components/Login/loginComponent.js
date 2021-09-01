import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  StatusBar,
  TouchableHighlight,
  KeyboardAvoidingView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import Loader from '../Helpers/Loader';
import {AlertMessage} from '../Helpers/Alert';
import {authenticate, updateUserDetails} from '../../actions/userAction';
import {goToHome} from '../Helpers/Startup';
import {KeyboardAwareView} from 'react-native-keyboard-aware-view';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: '',
      password: '',
      isMobile: false,
    };
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    this.setState({
      loading: true,
    });
    this.props.authenticate(this.state.email, this.state.password);
  }

  componentDidMount() {
    let dimensions = Dimensions.get('window');
    this.setState({isMobile: dimensions.height < 500});
  }

  componentDidUpdate() {
    if (this.props.userAuth.auth.message != null) {
      this.props.userAuth.auth.message = null;
      AlertMessage(
        'Error',
        'No es posible establecer comunicación con el servidor, por favor intente más tarde.',
        () => {
          this.setState({loading: false});
        },
      );
    } else if (
      this.props.userAuth.auth.error != null &&
      this.props.userAuth.auth.error === 'Unauthorized'
    ) {
      AlertMessage('Unauthorized', 'Usuario o contraseña inválidos', () => {
        this.props.userAuth.auth.error = null;
        this.setState({loading: false});
      });
    } else if (this.props.userAuth.auth.success != null) {
      this.props.updateUserDetails(
        this.props.userAuth.auth.success.token,
        goToHome,
      );
      //goToHome();
    }
  }

  render() {
    let componentStyle = styles(this.state.isMobile);

    return (
      <LinearGradient
        colors={['#22398D', '#000000']}
        style={componentStyle.linearGradient}>
        <StatusBar backgroundColor="#22398D" />
        <Loader loading={this.state.loading} />
        <KeyboardAwareView style={componentStyle.MainContainer}>
          <View style={componentStyle.LoginContainer}>
            <View style={componentStyle.FormContainer}>
              <View style={componentStyle.ImageTitleContainer}>
                <Image
                  style={componentStyle.TitleImage}
                  source={require('../_layout/img/telemetric.png')}></Image>
              </View>
              <Text style={componentStyle.Label}> Email </Text>
              <TextInput
                style={componentStyle.TextInput}
                keyboardType="email-address"
                onChangeText={(t) => {
                  this.setState({email: t});
                }}></TextInput>
              <Text style={componentStyle.Label}> Contraseña </Text>
              <TextInput
                style={componentStyle.TextInput}
                secureTextEntry
                onChangeText={(t) => {
                  this.setState({password: t});
                }}></TextInput>
              <TouchableOpacity
                onPress={this.handleLogin}
                style={componentStyle.TouchableHighlight}>
                <View style={componentStyle.Button}>
                  <Text style={componentStyle.ButtonText}>
                    {' '}
                    Iniciar sesión{' '}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareView>
      </LinearGradient>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userAuth: state.user,
  };
};

export default connect(mapStateToProps, {authenticate, updateUserDetails})(
  Login,
);

const styles = (isMobile) => {
  return StyleSheet.create({
    linearGradient: {
      flex: 1,
    },
    MainContainer: {
      flex: 1,
      flexDirection: 'column',
    },
    FormContainer: {
      width: 300,
      backgroundColor: 'white',
      borderRadius: 10,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowRadius: 5,
      shadowOpacity: 0.3,
    },
    LoginContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    Label: {
      marginLeft: '5%',
      marginTop: 10,
      marginBottom: isMobile ? 3 : 5,
    },
    TextInput: {
      width: '90%',
      padding: isMobile ? 7 : 10,
      borderColor: '#22398D',
      borderWidth: 1,
      marginLeft: '5%',
      borderRadius: 10,
    },
    FormTitle: {
      fontSize: 20,
      paddingTop: 30,
      paddingBottom: 20,
      textAlign: 'center',
      width: '100%',
    },
    ImageTitleContainer: {
      alignItems: 'center',
    },
    TitleImage: {
      width: isMobile ? '60%' : '90%',
      height: isMobile ? 50 : 100,
      marginTop: isMobile ? 10 : 0,
      resizeMode: 'contain',
    },
    Button: {
      width: '90%',
      marginLeft: '5%',
      borderRadius: 10,
      backgroundColor: '#22398D',
      color: 'white',
      paddingTop: 10,
      paddingBottom: 10,
    },
    ButtonText: {
      color: 'white',
      textAlign: 'center',
    },
    TouchableHighlight: {
      marginBottom: 10,
      marginTop: isMobile ? 10 : 30,
    },
  });
};
