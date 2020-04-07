import firebase from 'react-native-firebase';
const db = firebase.firestore();
const storage = firebase.storage();
import {
    uploadImage,
    recursiveObjectPromiseAll,
    findArrayElementIndex,
} from './misc';
import moment from "moment";

export const fetchMainCluster = (uid) =>{
    return new Promise((resolve, reject)=>{
        db.collection("clusters").where("sensates."+uid, "==", true).get().then((clusters)=>{
            if(!clusters.empty){
                let clusterData = {};
                const clusterId = clusters.docs[0].id;
                
                clusterData = clusters.docs[0].data();
                clusterData.id = clusterId;
                clusterData.approved = true;
                
                let pendingApprovals = [];
                Object.keys(clusterData.sensates).forEach((sensie)=>{
                    if(!clusterData.sensates[sensie]){
                        pendingApprovals.push(sensie);
                    }
                });

                clusterData.pendingApprovals = pendingApprovals;
                resolve(clusterData)
            }else{
                db.collection("clusters").where("sensates."+uid, "==", false)
                .get().then((clustersPendingApproval)=>{
                    let clusterData = {};
                    const clusterId = clustersPendingApproval.docs[0].id;
                
                    clusterData = clustersPendingApproval.docs[0].data();
                    clusterData.id = clusterId;
                    clusterData.approved = false;
                    resolve(clusterData)
                }).catch((err)=>{
                    reject(err);
                });
            }
        }).catch((err)=>{
            console.log(err);
            reject(err);
        });
    });
};

export const getSensieApprovalStatus = (clusterId,uid) => {
    return new Promise((resolve, reject)=>{
        db.collection("clusters")
        .doc(clusterId).collection("sensieapprovals").get().then((res)=>{
            let status = {};
            let responses = [];
            res.docs.forEach((doc)=>{
                let data = doc.data();
                if(data.uid == uid){
                    status['myStatus'] = data.status;
                }
                responses.push(data);
            });
            status['sensieReponses'] = responses;
            resolve(status);
        },(err)=>{
            reject(err);
        }).catch((err)=>{
            reject(err);
        });
    });
};

export const fetchPosts = () => {
    //return db.collection("clusters").doc(clusterId).collection('posts')
    return db.collection("archipelago")
        .where('reportCount', '<', 3)
        .orderBy("reportCount")
        .orderBy("date", "desc").limit(5);
};

export const fetchMorePosts = (lastPostId) => {
    //return db.collection("clusters").doc(clusterId).collection('posts')
    return db.collection("archipelago")
        .where('reportCount', '<', 3)
        .orderBy("reportCount")
        .orderBy("date", "desc")
        .startAfter(lastPostId)
        .limit(5);
};

export const fetchPost = (postId) => {
    //return db.collection("clusters").doc(clusterId).collection('posts').doc(postId);
    return db.collection("archipelago").doc(postId);
};

export const addClusterPostToApi = (postData) => {
    //return db.collection("clusters").doc(clusterId).collection('posts').add(postData);
    return db.collection("archipelago").add(postData);
}

export const fetchClusterPostCommentsFromApi = (postId) => {
    //return db.collection("clusters").doc(clusterId).collection('posts').doc(postId).collection('comments')
    return db.collection("archipelago").doc(postId).collection('comments')
    .orderBy('date', 'desc').limit(25);
};

export const addClusterPostCommentToApi = (postId, commentData) => {

    //let postRef = db.collection("clusters").doc(clusterId).collection('posts').doc(postId);
    let postRef = db.collection("archipelago").doc(postId);
    let commentRef = postRef.collection('comments');

    return db.runTransaction((transaction)=>{
        return transaction.get(postRef).then((postDoc)=> {
            if (!postDoc.exists) {
                console.log('Document does not exist!');
                
                throw "Document does not exist!";
            }
            let newCommentCount = postDoc.data().commentCount + 1;
            transaction.set(commentRef.doc(), commentData);
            transaction.update(postRef, {commentCount: newCommentCount});
        });
    });
} 

export const prepareClusterPostAddition = (postData, uid) =>{

    return new Promise((resolve, reject)=>{
        const date = new Date();
        const dateNumber = date.getTime();
        const serverDate = firebase.firestore.FieldValue.serverTimestamp();
        let newPostData = {
            "text": postData.text,
            "user": {
                _id: uid,
                avatar: 'users/kUnv9WuFTlgwMMSpxTydFXf438A2/profilepic.48824a70.png',
                name: 'tempUser',
            },
            "id": dateNumber,
            "type": "text",
            "date": serverDate,
            "status": "sent",
            "commentCount": 0,
            "likeCount": 0,
            "reportCount": 0,
        };

        if(postData.image){
            //const storagePath = `clusters/${clusterId}/`
            const storagePath = `archipelago`
            uploadImage(postData.image, storagePath).then((uploadImageUri)=>{
                newPostData['image'] = uploadImageUri;
                newPostData['type'] = 'image';
                resolve(newPostData);
            }).catch((err)=>{
                console.error(err);
                reject(err);
            });
        }else{
            resolve(newPostData);
        }
    });
}

export const processClusterPosts = (snapShot) => {

    return new Promise((resolve,reject)=>{
        let posts = [];
        let postsImageDataPromises = [];
        let postsUserDataPromises = [];

        snapShot.docs.forEach((post,i)=>{
            let postData = {
                ...post.data(),
                idRef: post.id,
            }

            moment.locale('en');
            const postDate = postData.date;
            const newPostDate = moment(postDate.seconds * 1000).format('MMM D, YYYY LT');

            const newPostData = {
                ...postData,
                formatedDate: newPostDate,
            };

            posts.push(newPostData);

            if (postData.type === 'image'){
                const imageRef = storage.ref(postData.image);
                postsImageDataPromises.push(
                    {
                        idRef: postData.idRef,
                        imageUrl: imageRef.getDownloadURL(),
                    }
                )
            }
            /*const imageRef = storage.ref(postData.user.avatar);
            postsUserDataPromises.push(
                {
                    idRef: postData.idRef,
                    userAvatar: imageRef.getDownloadURL(),
                }
            );*/
            
        });

        //console.log(posts);

        Promise.all([
            //processPostImages(postsUserDataPromises, posts, 'avatar'), 
            processPostImages(postsImageDataPromises, posts, 'postImage')
        ]).then((values)=>{
            //console.log(values);
            //resolve(posts);
            resolve(values[0]);
        }).catch((error)=>{
            reject(error);
        });

    });
}

export const processClusterPostDetail = (post) => {
    return new Promise((resolve)=>{
        let posts = [];
        let postsImageDataPromises = [];
        let postsUserDataPromises = [];

        let postData = post.data();
        postData['idRef'] = post.id;
        
        moment.locale('en');
        const postDate = postData.date;
        const newPostDate = moment(postDate.seconds * 1000).format('MMM D, YYYY LT');
        //const newMessageDateMoment = moment(postDate.seconds * 1000);

        const newPostData = {
            ...postData,
            formatedDate: newPostDate,
        };

        console.log(newPostData);
        
        posts.push(newPostData);

        if (postData.type === 'image'){
            const imageRef = storage.ref(postData.image);
            postsImageDataPromises.push(
                {
                    id: postData.id,
                    imageUrl: imageRef.getDownloadURL(),
                }
            )
        }
        
        /*const imageRef = storage.ref(postData.user.avatar);
        
        postsUserDataPromises.push(
            {
                id: postData.id,
                userAvatar: imageRef.getDownloadURL(),
            }
        );*/

        Promise.all([
            //processPostImage(postsUserDataPromises, posts, 'avatar'), 
            processPostImage(postsImageDataPromises, posts, 'postImage')
        ]).then((values)=>{
            resolve(posts[0]);
        });
    });
}

export const addLikeToPost = (postId,uid) => {
    return new Promise((resolve, reject)=>{
        //let postRef = db.collection("clusters").doc(clusterId).collection('posts').doc(postId);
        let postRef = db.collection("archipelago").doc(postId);
        let likesRef = postRef.collection('likes');

        likesRef.where('user._id', '==', uid).get().then((docs)=>{
            if(docs.empty){
                const likeDoc = {
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                    user: {
                        _id: uid,
                    },
                };
                return addLikeToDb(likeDoc, postRef, likesRef);
            }else{
                let doc = docs.docs[0];
                let likeDocRef = likesRef.doc(doc.id);
                return deleteLike(likeDocRef, postRef);
            }
        });
    });
}

const addLikeToDb = (likeDoc, postRef, likesRef) => {
    return db.runTransaction((transaction)=>{
        return transaction.get(postRef).then((postDoc)=> {
            if (!postDoc.exists) {
                throw "Document does not exist!";
            }
            var newLikeCount = postDoc.data().likeCount + 1;
            transaction.set(likesRef.doc(),likeDoc);
            transaction.update(postRef, {likeCount: newLikeCount});
        });
    });
}

const deleteLike = (likeDocRef, postRef) => {
    return db.runTransaction((transaction)=>{
        return transaction.get(postRef).then((postDoc)=> {
            if (!postDoc.exists) {
                throw "Document does not exist!";
            }
            var newLikeCount = postDoc.data().likeCount - 1;
            transaction.update(postRef, {likeCount: newLikeCount});
            transaction.delete(likeDocRef);
        });
    });
}

export const reportPost = (postId,uid) => {
    return new Promise((resolve, reject)=>{
        //let postRef = db.collection("clusters").doc(clusterId).collection('posts').doc(postId);
        let postRef = db.collection("archipelago").doc(postId);
        let reportsRef = postRef.collection('reports');

        reportsRef.where('user._id', '==', uid).get().then((docs)=>{
            if(docs.empty){
                const reportDoc = {
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                    user: {
                        _id: uid,
                    },
                };
                return reportPostToDb(reportDoc, postRef, reportsRef);
            }else{
                resolve();
            }
        });
    });
}

const reportPostToDb = (reportDoc, postRef, reportsRef) => {
    return db.runTransaction((transaction)=>{
        return transaction.get(postRef).then((postDoc)=> {
            if (!postDoc.exists) {
                throw "Document does not exist!";
            }
            var newReportCount = postDoc.data().reportCount + 1;
            transaction.set(reportsRef.doc(),reportDoc);
            transaction.update(postRef, {reportCount: newReportCount});
        });
    });
}

export const getSensieData = (sensieDocId) => {
    return new Promise((resolve, reject)=>{
        db.collection("sensies").doc(sensieDocId).get().then((res)=>{
            //console.log(res);
            resolve(res.data());
        },(err)=>{
            reject(err);
        }); 
    }).catch((err)=>{
        reject(err);
    });
}

export const addSensieApprovalOrDenial = (newSensieUid, status, clusterId, uid) => {
    //console.log(newSensieUid, status);
    return new Promise((resolve, reject)=>{
        db.collection("clusters").doc(clusterId).collection('sensieapprovals')
        .add({
            newSensieUid: newSensieUid,
            status: status,
            uid: uid,
            date: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(()=>{
            resolve();
        }).catch((err)=>{
            reject(err);
        })
    });
}

const processPostImages = (postsImageDataPromises, posts, imageType) => {
    return new Promise((resolve, reject)=>{
        let imageUrlsPromises = [];
        let postsNew = posts;
        postsImageDataPromises.forEach((post)=>{
            imageUrlsPromises.push(
                recursiveObjectPromiseAll(post)
            );
        });

        Promise.all(imageUrlsPromises).then((imageUrls)=>{
            imageUrls.forEach((postImage)=>{
                const postId = findArrayElementIndex(postsNew,postImage.idRef);
                
                if(imageType === 'postImage'){
                    postsNew[postId].image = postImage.imageUrl;    
                }
                
                if(imageType === 'avatar'){
                    postsNew[postId].user.avatar = postImage.userAvatar;    
                }
                
            });
            //console.log(postsNew);
            resolve(postsNew);
        },(error)=>{
            console.log(error);
            reject(error);
        });
    });
}

const processPostImage = (postsImageDataPromises, posts, imageType) => {
    return new Promise((resolve)=>{
        let imageUrlsPromises = [];
        postsImageDataPromises.forEach((post)=>{
            imageUrlsPromises.push(
                recursiveObjectPromiseAll(post)
            );
        });

        Promise.all(imageUrlsPromises).then((imageUrls)=>{
            imageUrls.forEach((postImage)=>{
                let postId = 0;
                
                if(imageType === 'postImage'){
                    posts[postId].image = postImage.imageUrl;    
                }
                
                if(imageType === 'avatar'){
                    posts[postId].user.avatar = postImage.userAvatar;    
                }
                
            });
            resolve(posts);
        });
    });
}