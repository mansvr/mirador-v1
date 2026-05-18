import { redirect } from "next/navigation";

// Root redirects to the demo scene during development.
// In production this will be the Mirador marketing / login page.
export default function RootPage() {
  redirect("/v/scene_demo00");
}
