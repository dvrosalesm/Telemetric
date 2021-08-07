import {combineReducers} from 'redux';
import userReducer from './userReducer'
import appsReducer from './appReducer'

export default combineReducers({
    user: userReducer,
    apps: appsReducer
})