import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ id: string }>; // <-- Must be a Promise
}) {
  const { id } = await params; // <-- Must await it
  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) notFound();
  // ... rest of the code