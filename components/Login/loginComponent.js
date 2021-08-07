import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Button, TextInput, StatusBar, TouchableHighlight, KeyboardAvoidingView, SafeAreaView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import Loader from '../Helpers/Loader';
import {AlertMessage} from '../Helpers/Alert';
import {authenticate, updateUserDetails} from '../../actions/userAction'
import {goToHome} from '../Helpers/Startup';
import {KeyboardAwareView} from 'react-native-keyboard-aware-view';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: "",
            password: ""
        }
        this.handleLogin = this.handleLogin.bind(this);
    }
    
    handleLogin() {
        this.setState({
            loading: true
        })
        this.props.authenticate(this.state.email, this.state.password);
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        if(this.props.userAuth.auth.message != null) {
            this.props.userAuth.auth.message = null;
            AlertMessage("Error", "No es posible establecer comunicación con el servidor, por favor intente más tarde.", 
            () => {
                this.setState({loading: false});
            });
        } else if(this.props.userAuth.auth.error != null && this.props.userAuth.auth.error === "Unauthorized") {
            AlertMessage("Unauthorized", "Usuario o contraseña inválidos", 
            () => {
                this.props.userAuth.auth.error = null;
                this.setState({loading: false});
            });
        } else if(this.props.userAuth.auth.success != null) {
            this.props.updateUserDetails(this.props.userAuth.auth.success.token, goToHome);
            //goToHome();
        }
    }

    render() {
        return (
            <LinearGradient colors={["#22398D", "#000000"]} style={styles.linearGradient}>
            <StatusBar backgroundColor="#22398D"/>
            <Loader loading={this.state.loading} />
                <KeyboardAwareView style={styles.MainContainer} >
                    <View style={styles.LoginContainer}> 
                        <View style={styles.FormContainer}> 
                            <View style={styles.ImageTitleContainer}>
                                <Image style={styles.TitleImage} source={require('../_layout/img/telemetric.png')}></Image>
                            </View>
                            <Text style={styles.Label}> Email </Text>
                            <TextInput style={styles.TextInput} keyboardType="email-address" onChangeText={(t) => {this.setState({email: t})}}></TextInput>
                            <Text style={styles.Label}> Contraseña </Text>
                            <TextInput style={styles.TextInput} secureTextEntry onChangeText={(t) => {this.setState({password: t})}}></TextInput>
                            <TouchableHighlight onPress={this.handleLogin} style={styles.TouchableHighlight}>
                                <View style={styles.Button}>
                                    <Text style={styles.ButtonText}> Iniciar sesión </Text> 
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </KeyboardAwareView>
            </LinearGradient>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userAuth: state.user
    }
}

export default connect(mapStateToProps, { authenticate, updateUserDetails })(Login);

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1
    },
    MainContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    FormContainer: {
        width: 300,
        backgroundColor: "white",
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 3
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
        marginLeft: "5%",
        marginTop: 10,
        marginBottom: 5,
    },
    TextInput: {
        width: "90%",
        padding: 10,
        borderColor: '#22398D',
        borderWidth: 1,
        marginLeft: "5%",
        borderRadius: 10
    },
    FormTitle: {
        fontSize: 20,
        paddingTop: 30,
        paddingBottom: 20,
        textAlign: 'center',
        width: "100%",
    },
    ImageTitleContainer: {
        alignItems: "center"
    },
    TitleImage: {
        width: '90%',
        height: 100,
        resizeMode: 'contain'
    },
    Button: {
        width: "90%",
        marginLeft: "5%",
        borderRadius: 10,
        backgroundColor: "#22398D",
        color: "white",
        paddingTop: 10,
        paddingBottom: 10
    },
    ButtonText: {
        color: "white",
        textAlign: "center"
    },
    TouchableHighlight: {
        marginBottom: 10,
        marginTop: 30
    }
});