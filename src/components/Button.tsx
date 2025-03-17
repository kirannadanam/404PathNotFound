import { IconType } from "react-icons";

interface Props {
  icon: IconType;
  onClick: () => void;
}

const Button = ({ icon: Icon, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px",
        border: "none",
        backgroundColor: "transparent",
        cursor: "pointer",
        borderRadius: "50%",
      }}
    >
      <Icon size={50} />
    </button>
  );
};

export default Button;
