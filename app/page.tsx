import { supabase } from "@/lib/supabaseClient";
import PropertyCard from "@/components/PropertyCard";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  images: string[];
  size?: string;
}

export default async function Home() {
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-bold mb-8">Available Properties</h1>
        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: Property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-20">
            No properties available at the moment. Check back soon!
          </p>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}