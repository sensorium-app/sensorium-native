import firebase from 'react-native-firebase';
const db = firebase.firestore();

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