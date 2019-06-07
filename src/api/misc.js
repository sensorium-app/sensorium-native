import firebase from 'react-native-firebase';
const storage = firebase.storage();
import uuid from 'uuid/v1';

export const uploadImage = (imagePath, storagePath) =>{
    return new Promise((resolve, reject)=>{
        // Extract image extension
        const imageExt = imagePath.split('.').pop();
        const filename = `${uuid()}.${imageExt}`; 

        storage.ref(`${storagePath}${filename}`)
            .putFile(imagePath)
            .then((res)=>{
                resolve(res.ref);
            })
            .catch((err)=>{
                console.log(err);
                reject(err);
            });
    });
}