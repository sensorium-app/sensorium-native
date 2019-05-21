import { GET_CLUSTER_POSTS, GET_CLUSTER_POSTS_SUCCESS, GET_CLUSTER_POSTS_FAILURE } from '../constants';
import { fetchMainCluster, fetchPosts } from '../api/cluster';
import { fetchUser } from './../api/auth';
import firebase from 'react-native-firebase';

const storage = firebase.storage();

export const getClusterPosts = () => {
    return {type: GET_CLUSTER_POSTS}
}

export const getClusterPostsSuccess = (data) => {
    return {type: GET_CLUSTER_POSTS_SUCCESS, data}
}

export const getClusterPostsFailure = (data) => {
    return {type: GET_CLUSTER_POSTS_FAILURE}
}

export const fetchClusterPosts = () => {
    return (dispatch) => {
        
        dispatch(getClusterPosts())

        fetchUser().then((authUser)=>{
            fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                fetchPosts(mainClusterData.id).onSnapshot((snap)=>{
                    processClusterPosts(snap).then((responseData)=>{
                        dispatch(getClusterPostsSuccess(responseData))
                    }).catch((error)=>{
                        console.log(error);
                    });
                },(error)=>{
                    console.log(error);
                });
            }).catch((error) => console.log(error))
        }).catch((error) => console.log(error))
    }
}

const processClusterPosts = (snapShot) => {

    return new Promise((resolve)=>{
        let posts = [];
        let postsImgeDataPromises = [];
        snapShot.docs.forEach((post)=>{
            let postData = post.data();
            posts.push(postData);
            if (postData.type === 'image'){
                const imageRef = storage.ref(postData.image);
                postsImgeDataPromises.push(
                    {
                        id: postData.id,
                        imageUrl: imageRef.getDownloadURL(),
                    }
                )
            }
        });
        
        processPostImages(postsImgeDataPromises, posts).then((postsWithImages)=>{
            resolve(postsWithImages);
        });

    });
}

const processPostImages = (postsImgeDataPromises, posts) => {
    return new Promise((resolve)=>{
        let imageUrlsPromises = [];
        postsImgeDataPromises.forEach((post)=>{
            imageUrlsPromises.push(
                recursiveObjectPromiseAll(post)
            );
        });

        Promise.all(imageUrlsPromises).then((imageUrls)=>{
            imageUrls.forEach((postImage)=>{
                let postId = findImagePostIndex(posts,postImage.id);
                
                posts[postId].image = postImage.imageUrl;
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

const findImagePostIndex = (posts, postImageId)=>{
    return posts.findIndex((elem)=>{
        if(elem.id === postImageId){
            return true;
        }else{
            return false;
        }
    })
};