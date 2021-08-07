import { Navigation } from 'react-native-navigation'

export function Navigate(name, props) {
    Navigation.setRoot({
        root: {
            component: {
                name: name,
                passProps: props,
                options: {
                    //statusBar: {
                    //    drawBehind: false,
                    //    visible: false
                    //}
                }
            }
        }
    });
}
