import "/src/App.css";
import { useState } from "react";
import { FaMagnifyingGlassLocation } from "react-icons/fa6";

//{items: [], heading:string}
interface Props {
  items: string[];
  heading: string;
  //function that takes a parameter called item of type string -> (item: string)=>void
  onSelectItem: (item: string) => void;
}

function ListGroup({ items, heading, onSelectItem }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const getMessage = () => {
    return items.length == 0 && <p>No item found</p>;
  };
  //Empty angular brackets tells react to use a Fragment to be able to return multiple elements such as h1 and li
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <FaMagnifyingGlassLocation size={25} />
        <h5 style={{ margin: 10 }}>{heading}</h5>
      </div>
      {getMessage()}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex == index
                ? "list-group-item active bg-dark"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
export default ListGroup;
