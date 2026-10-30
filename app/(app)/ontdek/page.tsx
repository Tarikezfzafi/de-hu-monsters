import type { Metadata } from "next";
import { OntdekContent } from "@/features/ontdek/components/OntdekContent";

export const metadata: Metadata = {
  title: "Ontdek | HUBi",
};

export default function OntdekPage() {
  return <OntdekContent />;
}
