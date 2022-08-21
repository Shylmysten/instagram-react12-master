import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import defaultUserImage from './images/default-user-image.jpg';
import { CREATE_USER } from "./graphql/mutations";
import { useMutation } from "@apollo/react-hooks";

const provider = new firebase.auth.GoogleAuthProvider();

// Find these options in your Firebase console
firebase.initializeApp({
    apiKey: "AIzaSyBGoganffTHm8RSbAFQ8onGP7PlmQoFQYI",
    authDomain: "tonys-instagram-react-clone.firebaseapp.com",
    projectId: "tonys-instagram-react-clone",
    storageBucket: "tonys-instagram-react-clone.appspot.com",
    messagingSenderId: "740057614744",
    appId: "1:740057614744:web:75ac863c7c36df918b83ed",
    databaseURL: "https://tonys-instagram-react-clone-default-rtdb.firebaseio.com/"
});

export const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [authState, setAuthState] = React.useState({ status: "loading" });
  const [createUser] = useMutation(CREATE_USER);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim =
          idTokenResult.claims["https://hasura.io/jwt/claims"];

        if (hasuraClaim) {
          setAuthState({ status: "in", user, token });
        } else {
          // Check if refresh is required.
          const metadataRef = firebase.database().ref(`metadata/" + ${user.uid} + "/refreshTime`);

          metadataRef.on("value", async (data) => {
            if(!data.exists) return
            // Force refresh to pick up the latest custom claims changes.
            const token = await user.getIdToken(true);
            setAuthState({ status: "in", user, token });
          });
        }
      } else {
        setAuthState({ status: "out" });
      }
    });
  }, []);

  async function logInWithGoogle() {
    const data = await firebase.auth().signInWithPopup(provider);
    console.log({ data });

    if(data.additionalUserInfo.isNewUser) {
      const { uid, displayName, email, photoURL } = data.user;
      console.log(photoURL);
      const username = `${displayName.replace(/\s+/g, "")}${uid.slice(-5)}`;
      const variables = {
        userId: uid,
        name: displayName,
        username,
        email,
        bio: "",
        website: "",
        phoneNumber: "",
        profileImage: photoURL
      };
      await createUser({ variables });
    } else {
      return data;
    }
  };

  async function loginWithEmailAndPassword(email, password) {
    const data = await firebase.auth().signInWithEmailAndPassword(email, password);
    return data;
  }

  async function signUpWithEmailAndPassword(formData) {
    const data = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password);
    if (data.additionalUserInfo.isNewUser) {
      const variables = {
        userId: data.user.uid,
        name: formData.name,
        username: formData.username,
        email: data.user.email,
        bio: "",
        website: "",
        phoneNumber: "",
        profileImage: defaultUserImage
      }
      await createUser({ variables });
    }
  }

  async function signOut() {
      setAuthState({ status: "loading" });
      await firebase.auth().signOut();
      setAuthState({ status: "out" });
  };

  async function updateEmail(email) {
    await authState.user.updateEmail(email);
    // console.log(authState.user);
  }


  if (authState.status === "loading") {
    return null;
  } else {
    return (
        <AuthContext.Provider
            value={{
                authState,
                logInWithGoogle,
                signOut,
                signUpWithEmailAndPassword,
                loginWithEmailAndPassword,
                updateEmail
            }}
        >
            {children}
        </AuthContext.Provider>
    );
  }


}
  export default AuthProvider;