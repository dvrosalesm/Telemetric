import React, {Component} from 'react'
import {View} from 'react-native';
import {connect} from 'react-redux'
import Loader from '../Helpers/Loader';
import {goToLogin, goToHome} from '../Helpers/Startup';
import {isLoggedIn} from '../../actions/userAction'


class main extends Component{

    componentDidMount() {
        this.props.isLoggedIn();
    }

    componentDidUpdate() {
       if(this.props.userLoggedIn != null) {
            if(this.props.userLoggedIn.auth.loaded === true && this.props.userLoggedIn.auth.response == null) {
                goToLogin();
            } else if(this.props.userLoggedIn.auth.loaded === true && this.props.userLoggedIn.auth.response != null) {
                goToHome();
            }
        }
    }

    render() {
        return <Loader loading={true}/>
    }
}

const mapStateToProps = state => {
    return {userLoggedIn: state.user}
}
export default connect(mapStateToProps, { isLoggedIn })(main);