import { database } from '../firebase';
import { id } from '../constants';

const sessionsRef = database.ref('sessions');

export const startSession = (key) => {
    const realStart = new Date().toISOString();
    sessionsRef.child(key).child('realStart').set(realStart);
    sessionsRef.child(key).child('playing').set(true);
}

export const endSession = (key) => {
    const realEnd = new Date().toISOString();
    sessionsRef.child(key).child('realEnd').set(realEnd);
    sessionsRef.child(key).child('playing').set(false);
}

export const pauseSession = (key) => {
    const pausedAt = new Date().toISOString();
    sessionsRef.child(key).child('pausedAt').set(pausedAt);
    sessionsRef.child(key).child('playing').set(false);
}

export const resumeSession = (key) => {
    const resumedAt = new Date().toISOString();
    sessionsRef.child(key).child('resumedAt').set(pausedAt);
    sessionsRef.child(key).child('playing').set(true);
}

export const createSession = (session) => {
    const newSession = sessionsRef.push();
    sessionsRef.set(session);
}

export const getSession = (key) => {

}

export const getTodaysSessions = (userKey) => {
    const today = new Date().toDateString();
    sessionsRef.orderByChild('date_userKey').equalTo(today+'_'+userKey).once('value', (snapshot) => {
        let data = [];
        snapshot.forEach(childSnapshot => {
            let session = childSnapshot.val();
            session.key = childSnapshot.key;
            data.push(session);
        })
        data.sort((a, b) => {
            const startA = new Date(a.plannedStart).toLocaleTimeString();
            const startB = new Date(b.plannedStart).toLocaleTimeString();
            if (startA < startB) {
                return -1;
            }
            if (startA > startB) {
                return 1;
            }
            return 0;
        });
        return data;
    });
}