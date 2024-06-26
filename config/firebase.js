const admin = require('firebase-admin');
const serviceAccount = require('../path/to/your-firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

async function createFirebaseUser(email, password) {
    try {
        const userRecord = await admin.auth().createUser({ email, password });
        return true;
    } catch (error) {
        return false;
    }
    
}

async function getAuthToken(email) {
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        const uid = userRecord.uid;

        const token = await admin.auth().createCustomToken(uid);

        return token;
    } catch (error) {
        return null;
    }
}

async function verifyAuthToken(token) {
    try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        return null;
    } 
}

module.exports.createFirebaseUser = createFirebaseUser;
module.exports.getAuthToken = getAuthToken;
module.exports.verifyAuthToken = verifyAuthToken;