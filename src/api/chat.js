import firebase from 'react-native-firebase';
const db = firebase.firestore();
import { uploadImage } from './misc';
import uuid from 'uuid/v4';

export const fetchChatMessages = (clusterId) => {
    return db.collection("clusters").doc(clusterId).collection('messages')
    .orderBy("date", "desc").limit(25);
};

export const addChatMessageToApi = (newMessage, clusterId, uid) => {
    return new Promise((resolve, reject)=>{
        const messagesRef = db.collection("clusters").doc(clusterId).collection('messages');
        prepareChatMessageAddition(newMessage, clusterId, uid).then((messageToAdd)=>{
            resolve(messagesRef.add(messageToAdd));
        }).catch((err)=>{
            reject(err);
        });
    });
};

export const prepareChatMessageAddition = (chatMessage, clusterId, uid ) => {
    return new Promise((resolve, reject)=>{
        
        const serverDate = firebase.firestore.FieldValue.serverTimestamp();
        const uuidA = uuid();
        const messageToAdd = {
            ...chatMessage,
            _id: uuidA,
            createdAt: serverDate,
            date: serverDate,
            id: uuidA,
            status: "sent",
            avatar: 'users/kUnv9WuFTlgwMMSpxTydFXf438A2/profilepic.48824a70.png',
            type: "text",
            system: false,
            user: {
                _id: uid,
                avatar: 'users/kUnv9WuFTlgwMMSpxTydFXf438A2/profilepic.48824a70.png',
                name: 'tempUser',
            },
        }

        if(messageToAdd.image){
            const storagePath = `clusters/${clusterId}/chatMedia/`;
            uploadImage(messageToAdd.image, storagePath).then((uploadImageUri)=>{
                const messageWithImageToAdd ={
                    ...messageToAdd,
                    image: uploadImageUri,
                    type: 'image',
                }
                resolve(messageWithImageToAdd);
            }).catch((err)=>{
                console.error(err);
                reject(err);
            });
        }else{
            resolve(messageToAdd);
        }
    });
}