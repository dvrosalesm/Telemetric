import AsyncStorage from '@react-native-community/async-storage'

import { BASE_URL } from './constants'
import { AUTHENTICATE, LOGGEDIN, USER_DETAILS } from './types'

const AUTH_URL = BASE_URL + '/auth/login'
const USER_DETAILS_URL = BASE_URL + '/user/details'

export const isLoggedIn = () => dispatch => {
    AsyncStorage.getItem('USERTOKEN')
    .then((data) => {
        dispatch({
             type: LOGGEDIN,
             payload: {
                response: data,
                loaded: true
             }
         });
    })
    .catch((err) => {
         dispatch({
             type: LOGGEDIN,
             payload: {
                response: err,
                loaded: true
             }
         });
    })
}

export const authenticate = (email, password) => dispatch => {
    fetch(AUTH_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            'email': email,
            'password': password
        })
    }).then((responseJson) => responseJson.json())
    .then((userToken) => {
        if(userToken.success != null) {
            AsyncStorage.setItem('USERTOKEN', userToken.success.token);
        }
        dispatch({
            type: AUTHENTICATE,
            payload: userToken
        })
    }).catch(error => 
        dispatch({
            type: AUTHENTICATE,
            payload: error
        })
    );
} 

export const updateUserDetails = (userToken, cb) => dispatch => {
    fetch(USER_DETAILS_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer ' + userToken
        }
    }).then((responseJson) => responseJson.json())
    .then((userDetails) => {
        AsyncStorage.setItem('USERDATA', JSON.stringify(userDetails.data));
        dispatch({
            type: AUTHENTICATE,
            payload: userDetails
        });
        cb();
    }).catch(error => 
        dispatch({
            type: AUTHENTICATE,
            payload: error
        })  
    );
}

export const getUserDetails = (update) => dispatch => {
    AsyncStorage.getItem('USERDATA')
    .then((data) => {
        dispatch({
             type: USER_DETAILS,
             payload: {
                response: JSON.parse(data)
             }
         });
    })
    .catch((err) => {
         dispatch({
             type: USER_DETAILS,
             payload: {
                response: err
             }
         });
    })
}

export const userLogout = (update) => dispatch => {

    

}