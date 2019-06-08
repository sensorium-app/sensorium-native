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
};

export const zipObject = (keys = [], values = []) => {
    return keys.reduce((accumulator, key, index) => {
      accumulator[key] = values[index]
      return accumulator
    }, {})
};

export const recursiveObjectPromiseAll = function (obj) {
    const keys = Object.keys(obj);
    return Promise.all(keys.map(key => {
      const value = obj[key];
      if (typeof value === 'object' && !value.then) {
        return recursiveObjectPromiseAll(value);
      }
      return value;
    }))
    .then(result => zipObject(keys, result));
};

export const findArrayElementIndex = (array, elementId) => {
    return array.findIndex((elem)=>{
        if(elem.idRef === elementId){
            return true;
        }else{
            return false;
        }
    })
};