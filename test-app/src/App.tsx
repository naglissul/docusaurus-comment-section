import "./App.css";
import { CommentSection, FirebaseProvider } from "docusaurus-comment-section";

const firebaseConfig = {
  apiKey: "AIqaSyB9pUI5p93eatRFG4ZAU1g88oYACmDxXC4",
  authDomain: "abc.firebaseapp.com",
  projectId: "abc",
  storageBucket: "abc.firebasestorage.app",
  messagingSenderId: "496235222546",
  appId: "1:497425222546:web:404e256e643ff0337b44f4b",
};
function App() {
  return (
    <>
      <h1>Comments</h1>
      <FirebaseProvider config={firebaseConfig}>
        <CommentSection postId={"hohoho"} isDefaultVerified={true} />
      </FirebaseProvider>
    </>
  );
}

export default App;
