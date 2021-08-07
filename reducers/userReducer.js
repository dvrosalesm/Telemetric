import { AUTHENTICATE, LOGGEDIN, USER_DETAILS } from '../actions/types'

export default function reducer(state = {}, action) {
    switch (action.type) {
        case LOGGEDIN:
            return {
                ...state, 
                auth: action.payload
            }
        case AUTHENTICATE:
            return {
                ...state,
                auth: action.payload
            }
        case  USER_DETAILS: 
            return {
                ...state,
                details: action.payload
            }
        default: 
            return {...state};
    }
}
