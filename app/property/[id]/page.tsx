import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Info */}
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
      <p className="text-2xl font-bold text-[#0A1931] mb-4">{property.price}</p>
      <p className="text-gray-600 mb-2">{property.location}</p>
      {property.size && <p className="text-gray-600 mb-4">Size: {property.size}</p>}

      {/* Image Slider */}
      <div className="my-8">
        <PropertyGallery images={property.images || []} title={property.title} />
      </div>

      {/* Description & Details */}
      <div className="prose max-w-none">
        <h2 className="text-xl font-bold mt-6 text-[#0A1931]">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {property.description}
        </p>

        <h2 className="text-xl font-bold mt-6 text-[#0A1931]">Sales Information</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {property.sales_info}
        </p>

        {property.features && property.features.length > 0 && (
          <>
            <h2 className="text-xl font-bold mt-6 text-[#0A1931]">Features</h2>
            <ul className="list-disc list-inside text-gray-700">
              {property.features.map((f: string, i: number) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </>
        )}

        {property.company_name && (
          <div className="mt-6 border-t pt-4">
            <p className="font-semibold">Company: {property.company_name}</p>
            {property.company_website && (
              <a
                href={property.company_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0A1931] underline"
              >
                Visit Website
              </a>
            )}
          </div>
        )}

        {/* Source Attribution Box */}
        {property.source_platform && (
          <div className="mt-6 border-t pt-4 bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-[#0A1931] mb-2">
              📌 Listing Source
            </p>
            <p className="text-sm text-gray-700">
              This listing was originally posted on{" "}
              <strong>{property.source_platform}</strong>
              {property.source_listing_id && (
                <span className="text-gray-500">
                  {" "}
                  (ID: {property.source_listing_id})
                </span>
              )}
              .
            </p>
            {property.source_url && (
              <a
                href={property.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-[#0A1931] underline hover:text-black"
              >
                View original listing on {property.source_platform} →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}