import { Navigation } from 'react-native-navigation'
import { registerScreens } from './components/screens'
import { configureStore }  from './configureStore'
import { Provider } from 'react-redux'


registerScreens(Provider, configureStore());
Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            component: {
                name: 'navigation.main'
            }
        }
    })
});
