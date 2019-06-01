import firebase from 'react-native-firebase';
const db = firebase.firestore();
const storage = firebase.storage();

export const fetchMainCluster = (uid) =>{
    return new Promise((resolve, reject)=>{
        db.collection("clusters").where("sensates."+uid, "==", true).get().then((clusters)=>{
            let clusterData = {};
            const clusterId = clusters.docs[0].id;
            
            clusterData = clusters.docs[0].data();
            clusterData.id = clusterId;

            resolve(clusterData)
        }).catch((err)=>{
            reject(err);
        });
    });
};

export const fetchPosts = (clusterId) => {
    return db.collection("clusters").doc(clusterId).collection('posts')
        .orderBy("date", "desc").limit(25);
};

export const fetchPost = (clusterId, postId) => {
    return db.collection("clusters").doc(clusterId).collection('posts').doc(postId);
};

export const processClusterPosts = (snapShot) => {

    return new Promise((resolve)=>{
        let posts = [];
        let postsImageDataPromises = [];
        let postsUserDataPromises = [];
        snapShot.docs.forEach((post)=>{
            let postData = post.data();
            postData['idRef'] = post.id;
            posts.push(postData);
            if (postData.type === 'image'){
                const imageRef = storage.ref(postData.image);
                postsImageDataPromises.push(
                    {
                        id: postData.id,
                        imageUrl: imageRef.getDownloadURL(),
                    }
                )
            }
            const imageRef = storage.ref(postData.user.avatar);
            postsUserDataPromises.push(
                {
                    id: postData.id,
                    userAvatar: imageRef.getDownloadURL(),
                }
            );
        });

        Promise.all([
            processPostImages(postsUserDataPromises, posts, 'avatar'), 
            processPostImages(postsImageDataPromises, posts, 'postImage')
        ]).then((values)=>{
            resolve(posts);
        });

    });
}

export const addLikeToPost = (clusterId,postId,uid) => {
    return new Promise((resolve, reject)=>{
        let postRef = db.collection("clusters").doc(clusterId).collection('posts').doc(postId);
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

const processPostImages = (postsImageDataPromises, posts, imageType) => {
    return new Promise((resolve)=>{
        let imageUrlsPromises = [];
        postsImageDataPromises.forEach((post)=>{
            imageUrlsPromises.push(
                recursiveObjectPromiseAll(post)
            );
        });

        Promise.all(imageUrlsPromises).then((imageUrls)=>{
            imageUrls.forEach((postImage)=>{
                let postId = findImagePostIndex(posts,postImage.id);
                
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

const zipObject = (keys = [], values = []) => {
    return keys.reduce((accumulator, key, index) => {
      accumulator[key] = values[index]
      return accumulator
    }, {})
};

const recursiveObjectPromiseAll = function (obj) {
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

const findImagePostIndex = (posts, imageId)=>{
    return posts.findIndex((elem)=>{
        if(elem.id === imageId){
            return true;
        }else{
            return false;
        }
    })
};