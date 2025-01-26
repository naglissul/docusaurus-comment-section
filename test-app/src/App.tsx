import "./App.css";
import { CommentSection, FirebaseProvider } from "docusaurus-comment-section";

const firebaseConfig = {
  apiKey: "AIzaSyB9pUE5p93eatRFG4ZAU1g88oYACDmxXC4",
  authDomain: "npw-lt-8f4e9.firebaseapp.com",
  projectId: "npw-lt-8f4e9",
  storageBucket: "npw-lt-8f4e9.firebasestorage.app",
  messagingSenderId: "497425222546",
  appId: "1:497425222546:web:404e256e216f0337b44f4b",
};

function App() {
  return (
    <>
      <FirebaseProvider config={firebaseConfig}>
        <CommentSection postId={"hohoho"} isDefaultVerified={true} />
      </FirebaseProvider>
    </>
  );
}

export default App;
