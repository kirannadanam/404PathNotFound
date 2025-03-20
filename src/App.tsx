import { useState, useEffect } from "react";

import OffScreen from "./components/OffScreen.tsx";
import Button from "./components/Button.tsx";

import "./App.css";

import { BsCaretRightFill } from "react-icons/bs";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Polyline,
  Rectangle,
} from "react-leaflet";
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
  const [shortestPath, setShortestPath] = useState<LatLngExpression[]>([]);

  const searchBounds: [[number, number], [number, number]] = [
    [29.204, -83.104], // SW
    [30.048, -81.605], // NE corner (lat, lon)
  ];

  const destinationIcon = new Icon({
    iconUrl: "./public/placeholder.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const homeIcon = new Icon({
    iconUrl: "./public/home.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const center: [number, number] = [29.622069801647613, -82.62269247880934];
  const [offScreenVisible, setOSVisibility] = useState(true);

  const [executionTime, setExecutionTime] = useState<string | null>(null);

  // when there are two markers, find the shortest path
  useEffect(() => {
    if (markers.length === 2) {
      fetchShortestPath();
    } else {
      setShortestPath([]);
    }
  }, [markers]);

  const [numMarkers, setNumMarkers] = useState(markers.length);

  useEffect(() => {
    setNumMarkers(markers.length);
  }, [markers]);

  // make the function that finds the shortest path
  const fetchShortestPath = async () => {
    const startTime = performance.now();
    // if no two markers, stop
    if (markers.length < 2) return;

    //get the data request from python file
    try {
      setShortestPath([]);
      setExecutionTime("Loading...");
      const response = await fetch("http://127.0.0.1:5000/dijkstras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ point1: markers[0], point2: markers[1] }),
      });

      const endTime = performance.now();

      // set the shortest path to the given path
      const data = await response.json();
      console.log("Received Path from Flask:", data.path); // Debugging log

      if (data.path) {
        setShortestPath(data.path);
        markers[0] = data.path[0];
        markers[1] = data.path[data.path.length - 1];
        setExecutionTime(((endTime - startTime) / 1000).toFixed(3));
      }
    } catch (error) {
      console.error("Error fetching shortest path:", error);
    }
  };

  return (
    <>
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HandleClick markers={markers} setMarker={setMarker} />

        <Rectangle
          bounds={searchBounds}
          pathOptions={{ color: "gray", weight: 2, fillOpacity: 0 }}
        ></Rectangle>

        {markers.map((position, index) => (
          <>
            <Marker
              key={index}
              position={position}
              icon={index === 0 ? homeIcon : destinationIcon}
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

        {/* draw the shortest path */}
        {shortestPath.length > 0 && markers.length === 2 && (
          <Polyline positions={shortestPath} color="blue" weight={5} />
        )}
      </MapContainer>

      <div className="overlay">
        {offScreenVisible ? (
          <OffScreen
            destination={[markers[1]]}
            start={[markers[0]]}
            onClose={() => setOSVisibility(false)}
            executionTime={executionTime}
            numMarkers={numMarkers}
          />
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
