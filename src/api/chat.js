import firebase from 'react-native-firebase';
const db = firebase.firestore();
//const storage = firebase.storage();
import uuid from 'uuid/v4';

export const fetchChatMessages = (clusterId) => {
    return db.collection("clusters").doc(clusterId).collection('messages')
    .orderBy("date", "desc").limit(25);
};

export const addChatMessageToApi = (newMessage, clusterId, uid) => {
    const messagesRef = db.collection("clusters").doc(clusterId).collection('messages');
    const serverDate = firebase.firestore.FieldValue.serverTimestamp();
    const uuidA = uuid();
    const messageToAdd = {
        ...newMessage,
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
    return messagesRef.add(messageToAdd);
};