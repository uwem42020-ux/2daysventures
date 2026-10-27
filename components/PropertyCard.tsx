import Image from "next/image";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  images: string[];
  size?: string;
}

export default function PropertyCard({ property }: { property: Property }) {
  const mainImage =
    property.images?.[0] || "https://placehold.co/600x400?text=No+Image";

  return (
    <Link href={`/property/${property.id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <p className="text-gray-500 text-sm">{property.location}</p>
          <p className="text-xl font-bold text-blue-600 mt-2">
            {property.price}
          </p>
          {property.size && (
            <p className="text-sm text-gray-500 mt-1">{property.size}</p>
          )}
        </div>
      </div>
    </Link>
  );
}