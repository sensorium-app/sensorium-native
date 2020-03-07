import { Alert } from 'react-native';

export function showAlert (title, msg, type){
    Alert.alert(
        title,
        msg,
        [
            {
                text: 'OK'
            },
          ],
    );
}