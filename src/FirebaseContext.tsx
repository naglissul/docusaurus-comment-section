import React, { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const FirebaseContext = createContext(null);

export function FirebaseProvider({ config, children }) {
  const app = initializeApp(config);
  const db = getFirestore(app);
  return (
    <FirebaseContext.Provider value={{ db }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}
