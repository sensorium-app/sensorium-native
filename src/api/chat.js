import firebase from 'react-native-firebase';
import {
    uploadImage,
    recursiveObjectPromiseAll,
    findArrayElementIndex,
} from './misc';
import {
    processUserData,
} from './cluster';
import uuid from 'uuid/v4';
import moment from "moment";

const db = firebase.firestore();
const storage = firebase.storage();
const crash = firebase.crashlytics();

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
                crash.recordError(7,'chat - ' + JSON.stringify(err));
                reject(err);
            });
        }else{
            resolve(messageToAdd);
        }
    });
}

export const processChatMessages = (messages, uid) => {
    return new Promise((resolve, reject)=>{
        let messagesUserData = [];
        messages.docChanges.forEach((change)=> {
                        
            let messagesHasPendingWrites = messages.metadata.hasPendingWrites;
    
            if(!messagesHasPendingWrites){
                if (change.type === 'added') {
                    let messagesArray = [];
                    let unreadMessagesArray = [];
                    let messagesImageDataPromises = [];
                    let messagesUserDataPromises = [];

                    messages.forEach((message,i)=>{
                        const dbMessageId = message.id;
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
                            dbMessageId,
                            idRef: id,
                            createdAt: newMessageDate,
                            date: newMessageDateMoment,
                            readByMe: messageReadByMe,
                        };

                        messagesArray.push(newMessageData);

                        if(!messageReadByMe){
                            unreadMessagesArray.push(newMessageData);
                        }
    
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

                        messagesUserData.push(messageData.user._id);
                        
                    });

                    Promise.all([
                        processMessageImages(messagesUserDataPromises, messagesArray, 'avatar'), 
                        processMessageImages(messagesImageDataPromises, messagesArray, 'messageImage'),
                        processUserData(messagesUserData),
                    ]).then((values)=>{
                        /*resolve({
                            messagesArray: values[0],
                            unreadMessagesArray
                        });*/
                        let messagesWithUserData = [];
                        const messagessArray = values[0];
                        const sensieData = values[2];
                        messagessArray.forEach((message,i)=>{
                            sensieData.forEach((sensie)=>{
                                if(sensie && sensie.uid == message.user._id){
                                    message.user.name = sensie.name;
                                    message.user.initials = sensie.initials;
                                    delete message.user.avatar;
                                }
                            });
                            messagesWithUserData.push(message);
                        });
                        resolve({
                            messagesArray: messagesWithUserData,
                            unreadMessagesArray
                        });
                    }).catch((error)=>{
                        crash.recordError(7,'chat - ' + JSON.stringify(error));
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

                messagesUserData.push(messageData.user._id);

                Promise.all([
                    processMessageImage(messagesUserDataPromises, messages, 'avatar'), 
                    processMessageImage(messagesImageDataPromises, messages, 'messageImage'),
                    processUserData(messagesUserData),
                ]).then((values)=>{
                    /*resolve(
                        {
                            //...messages[0],
                            messagesArray: values[0][0],
                            modified: 'modified',
                        }
                    );*/
                    let messagesWithUserData = [];
                    const messagessArray = values[0];
                    const sensieData = values[2];
                    messagessArray.forEach((message,i)=>{
                        sensieData.forEach((sensie)=>{
                            if(sensie && sensie.uid == message.user._id){
                                message.user.name = sensie.name;
                                message.user.initials = sensie.initials;
                                delete message.user.avatar;
                            }
                        });
                        messagesWithUserData.push(message);
                    });
                    resolve({
                        messagesArray: messagesWithUserData[0],
                        modified: 'modified',
                    });
                }).catch((err)=>{
                    crash.recordError(7,'chat - ' + JSON.stringify(err));
                });
            }
        });
    });
}

export const setMessagesAsRead = (unreadMessagesArray, clusterId, uid) => {
    return new Promise((resolve, reject)=>{
        const messagesRef = db.collection("clusters").doc(clusterId).collection('messages');

        let messagesPromises = [];

        unreadMessagesArray.forEach(unreadMessage => {

            var messageId = unreadMessage.dbMessageId
            const messageRef = messagesRef.doc(messageId)

            messageRef.get().then((res)=>{
                var messageData = res.data();
                let newUid = messageData.readBy;
                newUid[uid] = true;
                messagesPromises.push(
                    messageRef.update({
                        readBy: newUid
                    })
                )
            },(err)=>{
                reject(err);
            }).catch((err)=>{
                reject(err);
            });
        });

        Promise.all(messagesPromises).then((res)=>{
            resolve();
        }).catch((err)=>{
            reject(err);
        });

    });
}

const processMessageImages = (messagesImageDataPromises, messages, imageType) => {
    return new Promise((resolve, reject)=>{
        let msgs = [...messages];
        let imageUrlsPromises = [];
        messagesImageDataPromises.forEach((message)=>{
            imageUrlsPromises.push(
                recursiveObjectPromiseAll(message)
            );
        });

        Promise.all(imageUrlsPromises).then((imageUrls)=>{
            
            imageUrls.forEach((image)=>{
                let imageId = findArrayElementIndex(msgs,image.idRef);
                
                if(imageType === 'messageImage'){
                    msgs[imageId].image = image.imageUrl;    
                }
                
                if(imageType === 'avatar'){
                    msgs[imageId].user.avatar = image.userAvatar;    
                }
                
            });
            
            resolve(msgs);

        },(error)=>{
            crash.recordError(7,'chat - ' + JSON.stringify(error));
            reject(error);
        });
    });
}

const processMessageImage = (messagesImageDataPromises, messages, imageType) => {
    return new Promise((resolve)=>{
        let msgs = [...messages];
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
                    msgs[messageId].image = messageImage.imageUrl;    
                }
                
                if(imageType === 'avatar'){
                    msgs[messageId].user.avatar = messageImage.userAvatar;    
                }
                
            });
            resolve(msgs);
        },(error)=>{
            crash.recordError(7,'chat - ' + JSON.stringify(error));
            reject(error);
        });
    });
}