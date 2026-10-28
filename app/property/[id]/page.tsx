import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { notFound } from "next/navigation";

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

  if (error || !property) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
      <p className="text-2xl text-blue-600 font-bold mb-4">{property.price}</p>
      <p className="text-gray-600 mb-4">{property.location}</p>
      {property.size && <p className="text-gray-600">Size: {property.size}</p>}

      {/* Property Images */}
      {property.images?.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {property.images.map((img: string, i: number) => (
            <div key={i} className="relative h-64">
              <Image
                src={img}
                alt={`${property.title} - Image ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-lg"
                placeholder="empty"
              />
            </div>
          ))}
        </div>
      )}

      {/* Description & Sales Info */}
      <div className="prose max-w-none">
        <h2 className="text-xl font-bold mt-6">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {property.description}
        </p>

        <h2 className="text-xl font-bold mt-6">Sales Information</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {property.sales_info}
        </p>

        {property.features?.length > 0 && (
          <>
            <h2 className="text-xl font-bold mt-6">Features</h2>
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
                className="text-blue-600 underline"
              >
                Visit Website
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}