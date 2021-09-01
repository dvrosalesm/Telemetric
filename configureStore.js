import {createStore, applyMiddleware, compose} from 'redux';
import reducers from './reducers'
import thunk from 'redux-thunk'

export function configureStore() {

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    let store = createStore(
        reducers, 
        composeEnhancers(applyMiddleware(thunk))
    )
    return store
}