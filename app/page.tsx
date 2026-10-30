export const dynamic = "force-dynamic";
export const revalidate = 0;
import { supabase } from "@/lib/supabaseClient";
import PropertyCard from "@/components/PropertyCard";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import Image from "next/image";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  images: string[];
  size?: string;
  sort_order?: number;
}

export default async function Home() {
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 w-full">
        {/* Banner */}
        <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96">
          <Image
            src="https://pyggfgzeaglpqjplrmyu.supabase.co/storage/v1/object/public/Banner/file_00000000c2c081f48d0006b04584575b.png"
            alt="2days Ventures Banner"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Properties Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {properties && properties.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {properties.map((property: Property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-20">
              No properties available at the moment. Check back soon!
            </p>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}