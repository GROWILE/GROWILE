// Renders a decorative section divider.
import "./Divider.css";

// Renders the divider interface.
export default function Divider() {
  return (
    <div className="divider">
      <span className="divider-accent"></span>
      <span className="divider-line"></span>
    </div>
  );
}