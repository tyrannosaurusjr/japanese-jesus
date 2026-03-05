import { journeyMetadata } from "../journey-content";
import { permanentRedirect } from "next/navigation";

export const metadata = journeyMetadata;

export default function WalkPage() {
  permanentRedirect("/journey");
}
