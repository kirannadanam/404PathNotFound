import { useState } from "react";
import OffScreen from "./components/OffScreen.tsx";
import Button from "./components/Button.tsx";
import { BsCaretRightFill } from "react-icons/bs";
import "./App.css";

function App() {
  const [offScreenVisible, setOSVisibility] = useState(true);
  return (
    <>
      {offScreenVisible ? (
        <OffScreen onClose={() => setOSVisibility(false)} />
      ) : (
        <Button
          icon={BsCaretRightFill}
          onClick={() => setOSVisibility(true)}
        ></Button>
      )}
    </>
  );
}

export default App;
