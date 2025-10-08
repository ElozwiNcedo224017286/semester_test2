
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getDatabase } from "firebase/database"; 

const firebaseConfig = {
  apiKey: "AIzaSyC7NoV_FHlQAF5uQ2EMXGLuCrUEO-XmFOA",
  authDomain: "semester-test2.firebaseapp.com",
  projectId: "semester-test2",
  storageBucket: "semester-test2.appspot.com", 
  messagingSenderId: "554376258309",
  appId: "1:554376258309:web:b0fd99779b816dd2d40d6c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); 

export { auth, db };
