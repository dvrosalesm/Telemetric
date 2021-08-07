import { Navigation } from 'react-native-navigation'

export function goToLogin() {
    Navigation.setRoot({
        root: {
            component: {
                name: 'navigation.login'
            }
        }
    });
}

export function goToHome() {
    Navigation.setRoot({
        root: {
            component: {
                name: 'navigation.home'
            }
        }
    });
}