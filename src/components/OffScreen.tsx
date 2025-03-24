import { useState } from "react";
import ListGroup from "./ListGroup";
import { FaMapLocationDot } from "react-icons/fa6";
import { PiPathBold } from "react-icons/pi";
import { MdTimer } from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";
import { LatLngExpression } from "leaflet";
import { IoHome } from "react-icons/io5";

interface Props {
  onClose: () => void;
  start: LatLngExpression[];
  destination: LatLngExpression[];
  executionTime: string | null;
  numMarkers: number;
  lengthPath: number | 0;
  pathNotFound: boolean;
  distance: string | null;
  startLocation: string | null;
  destinationLocation: string | null;
}

const OffScreen = ({
  start,
  destination,
  onClose,
  executionTime,
  numMarkers,
  lengthPath,
  pathNotFound,
  distance,
  startLocation,
  destinationLocation,
}: Props) => {
  let methods = ["Dijkstra's", "BFS", "DFS"];
  const [selectedMethod, setSelectedMethod] = useState<string>("Dijkstra's");

  const handleSelectItem = (item: string) => {
    setSelectedMethod(item);
  };

  return (
    <>
      <div
        className="offcanvas offcanvas-start show bg-dark"
        tabIndex={-1}
        id="offcanvas"
        aria-labelledby="offcanvasLabel"
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <div className="offcanvas-header">
          <h3 className="offcanvas-title text-light" id="offcanvasLabel">
            404: Path Not Found!
          </h3>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
        <div className="offcanvas-body text-light">
          <>
            <ListGroup
              items={methods}
              heading={"Search Methods"}
              onSelectItem={handleSelectItem}
            ></ListGroup>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "4px solid white",
                marginTop: "10px",
                background: "#212529",
                borderRadius: "5px",
              }}
            >
              <IoHome />
              <h6 style={{ margin: 10 }}>
                Start Location:{" "}
                {start[0] ? `${start[0]} ${startLocation}` : "N/A"}
              </h6>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "4px solid white",
                marginTop: "10px",
                background: "#212529",
                borderRadius: "5px",
              }}
            >
              <FaMapLocationDot />
              <h6 style={{ margin: 10 }}>
                Destination:{" "}
                {destination[0]
                  ? `${destination[0]} ${destinationLocation}`
                  : "N/A"}
              </h6>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "4px solid white",
                marginTop: "10px",
                background: "#212529",
                borderRadius: "5px",
              }}
            >
              <MdTimer />
              <h6 style={{ margin: 10 }}>
                Execution Time:{" "}
                {pathNotFound
                  ? "404: Path Not Found!"
                  : executionTime != null && numMarkers == 2
                  ? `${executionTime}`
                  : "N/A"}
              </h6>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "4px solid white",
                marginTop: "10px",
                background: "#212529",
                borderRadius: "5px",
              }}
            >
              <GiPathDistance />
              <h6 style={{ margin: 10 }}>
                Nodes Traveled in Path:{" "}
                {pathNotFound
                  ? "404 ERROR!!!"
                  : lengthPath != 0 && numMarkers == 2
                  ? `${lengthPath}`
                  : lengthPath === 0 && numMarkers == 2
                  ? "Loading..."
                  : "N/A"}
              </h6>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "4px solid white",
                marginTop: "10px",
                background: "#212529",
                borderRadius: "5px",
              }}
            >
              <PiPathBold />
              <h6 style={{ margin: 10 }}>
                Distance:{" "}
                {pathNotFound
                  ? "404: Path Not Found!"
                  : distance === "Loading..." && numMarkers == 2
                  ? `${distance}`
                  : distance != null && numMarkers == 2
                  ? `${distance} Miles`
                  : "N/A"}
              </h6>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default OffScreen;
