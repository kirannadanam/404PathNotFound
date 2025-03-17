import { useState } from "react";

import OffScreen from "./components/OffScreen.tsx";
import Button from "./components/Button.tsx";

import "./App.css";

import { BsCaretRightFill } from "react-icons/bs";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

function App() {
  // markers
  const markers: { geocode: [number, number]; popUp: string }[] = [
    {
      geocode: [48.86, 2.3522],
      popUp: "Hello, I am pop up 1",
    },
    {
      geocode: [48.85, 2.3522],
      popUp: "Hello, I am pop up 2",
    },
    {
      geocode: [48.855, 2.34],
      popUp: "Hello, I am pop up 3",
    },
  ];
  const customIcon = new Icon({
    iconUrl: "./public/placeholder.png",
    iconSize: [40, 40],
  });
  const center: [number, number] = [37.925832, -96.835365];
  const [offScreenVisible, setOSVisibility] = useState(true);
  return (
    <>
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <>
            <Marker position={marker.geocode} icon={customIcon}></Marker>
            <a href="https://www.flaticon.com/free-icons/pin" title="pin icons">
              Pin icons created by Freepik - Flaticon
            </a>
          </>
        ))}
      </MapContainer>

      <div className="overlay">
        {offScreenVisible ? (
          <OffScreen onClose={() => setOSVisibility(false)} />
        ) : (
          <Button
            icon={BsCaretRightFill}
            onClick={() => setOSVisibility(true)}
          ></Button>
        )}
      </div>
    </>
  );
}

export default App;
