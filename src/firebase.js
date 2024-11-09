import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Initialize Firebase
const app = initializeApp({
    "apiKey": process.env.apiKey,
    "authDomain": process.env.authDomain,
    "projectId": process.env.projectId,
    "storageBucket": process.env.storageBucket,
    "messagingSenderId": process.env.messagingSenderId,
    "appId": process.env.appId,
    "measurementId": process.env.measurementId
});
const messaging = getMessaging(app);

// Request permission and get token for notifications
export const requestForToken = async (setToken) => {
    try {
        const token = await getToken(messaging, { vapidKey: firebaseConfig.vapidKey });
        setToken(token);
    } catch (err) {
        console.error("Error getting token", err);
    }
};

// Listen for incoming messages
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
