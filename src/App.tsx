import { useState } from "react";

import OffScreen from "./components/OffScreen.tsx";
import Button from "./components/Button.tsx";

import "./App.css";

import { BsCaretRightFill } from "react-icons/bs";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, LatLngExpression } from "leaflet";

function HandleClick({
  // markers,
  setMarker,
}: {
  markers: LatLngExpression[];
  setMarker: Function;
}) {
  useMapEvents({
    click(e) {
      const newMarker: LatLngExpression = [e.latlng.lat, e.latlng.lng];

      setMarker((prevMarkers: LatLngExpression[]) => {
        if (prevMarkers.length < 2) {
          return [...prevMarkers, newMarker]; // Add marker if less than 2
        } else {
          return [prevMarkers[0], newMarker]; // Replace last marker
        }
      });
    },
  });
  return null;
}

function App() {
  // markers
  const [markers, setMarker] = useState<LatLngExpression[]>([]);

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

        <HandleClick markers={markers} setMarker={setMarker} />

        {markers.map((position, index) => (
          <>
            <Marker
              key={index}
              position={position}
              icon={customIcon}
              eventHandlers={{
                click: () =>
                  setMarker((prev) => prev.filter((_, i) => i !== index)),
              }}
            ></Marker>
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
