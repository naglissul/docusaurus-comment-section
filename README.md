# Docusaurus comment section plugin

> Checkout `cool-chatgpt-response.md` file for get started instructions with npm packages

## How to use

1. Have Google account.
2. Go to console.firebase.google.com and create new project (or use an existing one), create firestore database.
3. Set security rules:

WAIT AND MODIFY LATER

```json
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. Go to project settings and create an app (web app). Copy the `const firebaseConfig = { ...}` part, create new file in your docusaurus project `src/` directory, call it `firebaseConfig.js` and paste the `const firebaseConfig = { ...}` content with the word `export` next to it. Should look something like this:

```js
// File /src/firebaseConfig.js
export const firebaseConfig = {
  apiKey: "AIqaSyB9pUI5p93eatRFG4ZAU1g88oYACmDxXC4",

  authDomain: "abc.firebaseapp.com",

  projectId: "abc",

  storageBucket: "abc.firebasestorage.app",

  messagingSenderId: "496235222546",

  appId: "1:497425222546:web:404e256e643ff0337b44f4b",
};
```
