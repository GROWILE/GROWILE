// Updates document metadata for the current web route.
import { useLocation } from "react-router-dom";
import PageMeta from "../../../../packages/ui/src/PageMeta";
import { defaultMetadata, pageMetadata } from "../config/metadata";

// Renders the route metadata interface.
export default function RouteMetadata() {
  const { pathname } = useLocation();
  const isKnownRoute = pathname in pageMetadata;
  const metadata = pageMetadata[pathname as keyof typeof pageMetadata] ?? defaultMetadata;

  return <PageMeta {...metadata} canonicalPath={isKnownRoute ? pathname : "/404"} indexable={isKnownRoute} />;
}
