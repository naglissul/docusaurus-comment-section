import "./App.css";
import { ClickButton, Hello } from "docusaurus-comment-section";

function App() {
  return (
    <>
      <h1>Here we are testing the Hello component:</h1>
      <div>
        <Hello message="Hello, world!" />
      </div>
      <h1>Here we are testing the ClickButton component:</h1>
      <div>
        <ClickButton label={"Click me"} onClick={() => {}} />
      </div>
    </>
  );
}

export default App;
