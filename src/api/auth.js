import firebase from 'react-native-firebase';

export const fetchUser = () => {
    return new Promise((resolve, reject)=>{
        firebase.auth().onAuthStateChanged((authUser) => {
            if(authUser){
                resolve(authUser);
            }else{
                reject('User not logged in.');
            }
        });
    });
}