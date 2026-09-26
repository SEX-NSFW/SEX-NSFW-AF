import { createFileRoute } from "@tanstack/react-router";
import { SceneCoverApp } from "@/components/scene-cover-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <SceneCoverApp />;
}
