export const fetchUser = () => {
    return new Promise((resolve, reject)=>{
        resolve({
            uid: '123',
            email: 'leo@g.cm',
        });
    });
}