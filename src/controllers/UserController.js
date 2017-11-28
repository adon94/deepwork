import { database } from '../firebase';
import { id } from '../constants';

const usersRef = database.ref('users');

export const getUserByDeviceID = () => {
    const today = new Date().toDateString();
    usersRef.orderByChild('deviceId').equalTo(id).once('value', (snapshot) => {
        console.log(snapshot.val())
        if (snapshot.val() != null) {
            snapshot.val().key = snapshot.key;
            return snapshot.val();
        } else {
            createUserWithDeviceId();
            return {deviceId: id};
        }
    });
}

export const createUserWithDeviceId = () => {
    let user = {
        deviceId: id
    }
    const newUser = usersRef.push();
    newUser.set(user);
    user.key = newUser.key
}