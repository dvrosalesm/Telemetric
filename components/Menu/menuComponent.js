import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Button, TouchableHighlight,TouchableOpacity, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Navigate} from '../Helpers/Navigator'
import Modal from 'react-native-modal'
import {MultipleOptionAlert} from '../Helpers/Alert';
import {deleteAllApps} from '../../actions/appAction';
import {connect} from 'react-redux';

class Menu extends Component {

  constructor(props) {
      super(props);
      this.state = {
          activeHelp: false
      }
      this.clearAndLogout = this.clearAndLogout.bind(this);
  }

  onTapHandle(type) {
    Navigate('navigation.home', { screen: type });
  }

  onLogout() {
    MultipleOptionAlert('Confirmar', "Todas las aplicaciones instaladas serán eliminadas", 
    [
        {text: "Cancelar", onPress: () => {console.log('cancel');}},
        {text: "Cerrar sesión", onPress: () => {this.clearAndLogout();}}  
    ]);
  }

  clearAndLogout() {
    this.props.deleteAllApps(() => {
        Navigate('navigation.login', {});
    });
  }

  render() {
    return (
        <LinearGradient colors={['#22398D', '#000000']} style={styles.MenuWrapper}>
            <View >
                <TouchableOpacity onPress={() => this.onTapHandle("Local")}>
                    <View style={styles.MenuItem} title='btnLocalApps' theme='dark' >
                        <Image style={styles.MenuItemImage} source={require('./img/refresh.png')} ></Image>
                    </View>
                </TouchableOpacity>
            </View>
            <View >
                <TouchableOpacity onPress={() => this.setState({activeHelp: true})}>
                    <View style={styles.MenuItem} title='btnLocalApps' theme='dark' >
                        <Image style={styles.MenuItemImage} source={require('./img/help.png')} ></Image>
                    </View>
                </TouchableOpacity>
            </View>
            <View >
                <TouchableOpacity onPress={() => this.onLogout()}>
                    <View style={styles.MenuItem} title='btnLgout' theme='dark' >
                        <Image style={styles.MenuItemImage} source={require('./img/logout.png')} ></Image>
                    </View>
                </TouchableOpacity>
            </View>
            <Modal isVisible={this.state.activeHelp} onBackdropPress={() => this.setState({ activeHelp: false })} onSwipeComplete={() => this.setState({ activeHelp: false })} swipeDirection="left" style={styles.ModalElement}>
                <View style={styles.ModalContainer}>
                    <View style={styles.ModalHeader}> 
                        <Text style={styles.ModalAppName}> Información </Text>
                    </View>
                    <View style={styles.ModalBody}>
                        <Text style={styles.ModalText}>
                            Telemetric es una aplicación de productividad 
                            que habilita la capacidad de promover contenido interactivo a clientes.
                            {"\n\n"}
                            Al momento de utilizar esta aplicación la empresa permite el registro de información 
                            con respecto al uso de cada usuario, tales como: contenido presentado, acciones 
                            realizadas, localización, tiempo y hora.
                            {"\n\n"}
                            Si la aplicación se encuentra descargada deberá de aparecer un icono de "check" al lado derecho de su nombre. 
                        </Text>
                        <TouchableOpacity onPress={() => this.setState({ activeHelp: false })}>
                            <View style={styles.ModalDownloadButton}>
                                <Text style={styles.ModalDownloadButtonText}> Entendido </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
  }
}


const mapStateToProps = state => {
    return {
        
    }
}

export default connect(mapStateToProps, {deleteAllApps})(Menu)

const styles = StyleSheet.create({
    MenuWrapper: {
        flex: 1,
        width: "100%",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.3,
    },
    MenuItem: {
        fontSize: 10,
        height: 60,
        width: '70%',
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: "15%",
        marginTop: 20,
        backgroundColor: "rgba(255,255,255,0.2)"
    },
    LinearGradientMenuItem: {
        borderRadius: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1
    },
    MenuItemImage: {
        flex: 1,
        width: 35,
        height: 35,
        resizeMode: 'contain'
    },
    MenuItemText: {
        fontSize: 15,
        color: "white",
        fontFamily: "Rubik-Medium"
    },
    ModalElement: {
        alignContent: "center",
        flex: 1,
        alignItems: "center"
    },
    ModalContainer: {
        flex: 0,
        backgroundColor: "white",
        borderRadius: 10,
        flexDirection: "column",
        width: 500,
        height: 450,
        padding: 50
    },
    ModalHeader: {
        flexDirection: "row",
        width: "100%",
        height: 75,
        alignItems: "center",
        justifyContent: "center",
        // borderBottomColor: "#4c67ed",
        // borderBottomWidth: 1,
        marginBottom: 20
    },
    ModalAppName: {
        fontFamily: "Rubik-Medium",
        fontSize: 34,
        width: "100%",
        paddingLeft: 0,
        textAlign: "center"
    },
    ModalBody: {
        flex: 1,
        fontFamily: "Rubik-Light",
        flexGrow: 1,
        width: "100%",
        alignItems: "center",
        textAlign: "center"
    },
    ModalText: {
        textAlign: "center"
    },
    ModalDownloadButton: {
        borderColor: "#4c67ed",
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 50
    },
    ModalDownloadButtonText: {
        fontFamily: "Rubik-Medium",
        padding: 10
    }
});
