import firebase from 'react-native-firebase';
import {
    uploadImage,
    recursiveObjectPromiseAll,
    findArrayElementIndex,
} from './misc';
import uuid from 'uuid/v4';
import moment from "moment";

const db = firebase.firestore();
const storage = firebase.storage();

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
        let readBy = {};
        readBy[uid]=true;
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
            readBy:readBy,
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

export const processChatMessages = (messages, uid) => {
    return new Promise((resolve, reject)=>{
        messages.docChanges.forEach((change)=> {
                        
            let messagesHasPendingWrites = messages.metadata.hasPendingWrites;
    
            if(!messagesHasPendingWrites){
                if (change.type === 'added') {
                    let messagesArray = [];
                    let messagesImageDataPromises = [];
                    let messagesUserDataPromises = [];

                    messages.forEach((message,i)=>{
                        const messageData = message.data();
                        const messageDate = messageData.date;
                        const newMessageDate = moment(messageDate.seconds * 1000).toDate();
                        const newMessageDateMoment = moment(messageDate.seconds * 1000);
                        const id = messageData.id;

                        let messageReadByMe = false;
                        Object.keys(messageData.readBy).forEach((usersWhoRead)=>{
                            if(usersWhoRead==uid && messageData.readBy[usersWhoRead]){
                                messageReadByMe = true;
                            }
                        });
    
                        const newMessageData = {
                            ...messageData,
                            idRef: id,
                            createdAt: newMessageDate,
                            date: newMessageDateMoment,
                            readByMe: messageReadByMe,
                        };

                        messagesArray.push(newMessageData);
    
                        if (messageData.type === 'image'){
                            const imageRef = storage.ref(messageData.image);
                            messagesImageDataPromises.push(
                                {
                                    idRef: messageData.id,
                                    imageUrl: imageRef.getDownloadURL(),
                                }
                            )
                        }
                        const imageRef = storage.ref(messageData.user.avatar);
                        messagesUserDataPromises.push(
                            {
                                idRef: messageData.id,
                                userAvatar: imageRef.getDownloadURL(),
                            }
                        );
                        
                    });

                    Promise.all([
                        processMessageImages(messagesUserDataPromises, messagesArray, 'avatar'), 
                        processMessageImages(messagesImageDataPromises, messagesArray, 'messageImage')
                    ]).then((values)=>{
                        resolve(messagesArray);
                    }).catch((error)=>{
                        reject(error);
                    });

                }
            }
    
            if (change.type === "modified") {
                let messages = [];
                let messagesImageDataPromises = [];
                let messagesUserDataPromises = [];

                const messageData = change.doc.data();
                const docId = change.doc.id;
                const messageDate = messageData.date;
                const newMessageDate = moment(messageDate.seconds * 1000).toDate();
                const newMessageDateMoment = moment(messageDate.seconds * 1000);
    
                const newMessageData = {
                    ...messageData,
                    _id: docId,
                    createdAt: newMessageDate,
                    date: newMessageDate,
                    dateString: newMessageDateMoment,
                };

                messages.push(newMessageData);

                if (newMessageData.type === 'image'){
                    const imageRef = storage.ref(newMessageData.image);
                    messagesImageDataPromises.push(
                        {
                            id: newMessageData.id,
                            imageUrl: imageRef.getDownloadURL(),
                        }
                    )
                }

                const imageRef = storage.ref(newMessageData.user.avatar);
        
                messagesUserDataPromises.push(
                    {
                        id: newMessageData.id,
                        userAvatar: imageRef.getDownloadURL(),
                    }
                );

                Promise.all([
                    processMessageImage(messagesUserDataPromises, messages, 'avatar'), 
                    processMessageImage(messagesImageDataPromises, messages, 'messageImage')
                ]).then((values)=>{
                    resolve(
                        {
                            ...messages[0],
                            modified: 'modified',
                        }
                    );
                });
            }
        });
    });
}

export const setMessagesAsRead = () => {
    return new Promise((resolve, reject)=>{

    });
}

const processMessageImages = (messagesImageDataPromises, messages, imageType) => {
    return new Promise((resolve, reject)=>{
        let imageUrlsPromises = [];
        messagesImageDataPromises.forEach((message)=>{
            imageUrlsPromises.push(
                recursiveObjectPromiseAll(message)
            );
        });

        Promise.all(imageUrlsPromises).then((imageUrls)=>{
            
            imageUrls.forEach((image)=>{
                let imageId = findArrayElementIndex(messages,image.idRef);
                
                if(imageType === 'messageImage'){
                    messages[imageId].image = image.imageUrl;    
                }
                
                if(imageType === 'avatar'){
                    messages[imageId].user.avatar = image.userAvatar;    
                }
                
            });
            
            resolve(messages);

        },(error)=>{
            console.log(error);
            reject(error);
        });
    });
}

const processMessageImage = (messagesImageDataPromises, messages, imageType) => {
    return new Promise((resolve)=>{
        let imageUrlsPromises = [];
        messagesImageDataPromises.forEach((post)=>{
            imageUrlsPromises.push(
                recursiveObjectPromiseAll(post)
            );
        });

        Promise.all(imageUrlsPromises).then((imageUrls)=>{
            imageUrls.forEach((messageImage)=>{
                let messageId = 0;
                
                if(imageType === 'messageImage'){
                    messages[messageId].image = messageImage.imageUrl;    
                }
                
                if(imageType === 'avatar'){
                    messages[messageId].user.avatar = messageImage.userAvatar;    
                }
                
            });
            resolve(messages);
        },(error)=>{
            console.log(error);
            reject(error);
        });
    });
}