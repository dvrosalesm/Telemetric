import {Alert} from 'react-native';

export function AlertMessage(title, message, callback) {
    Alert.alert(
        title, message,
        [
            {text: "Ok", onPress: callback}
        ],
        { cancelable: false }
    );
}

export function MultipleOptionAlert(title,  message, buttons) {
    Alert.alert(
        title, message,
        buttons,
        { cancelable: true }
    );
}