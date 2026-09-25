// Scrolls the page to the top when the route changes.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Renders the scroll to top interface.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(/* Runs side effects when its dependencies change. */ () => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
