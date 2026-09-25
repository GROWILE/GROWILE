// Renders a loading message while content is prepared.
import "./LoadingScreen.css";

type LoadingScreenProps = {
  label?: string;
};

// Renders the loading screen interface.
export default function LoadingScreen({ label = "Loading" }: LoadingScreenProps) {
  return (
    <main className="loading-screen" aria-busy="true" aria-label={label}>
      <img
        className="loading-screen-logo"
        src="https://growile.com/growile-icon.png.png"
        alt="Growile"
      />
      <span className="loading-screen-spinner" aria-hidden="true" />
    </main>
  );
}
