import { useState } from "react";
import OffScreen from "./components/offScreen.tsx";
import Button from "./components/Button.tsx";
import "./App.css";

function App() {
  const [offScreenVisible, setOSVisibility] = useState(true);
  return (
    <>
      {offScreenVisible ? (
        <OffScreen onClose={() => setOSVisibility(false)} />
      ) : (
        <Button onClick={() => setOSVisibility(true)}>{">"}</Button>
      )}
    </>
  );
}

export default App;
