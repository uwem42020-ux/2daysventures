import Image from "next/image";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  images: string[];
  size?: string;
  source_platform?: string;
}

export default function PropertyCard({ property }: { property: Property }) {
  const mainImage =
    property.images?.[0] || "https://placehold.co/600x400?text=No+Image";

  return (
    <Link href={`/property/${property.id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative">
        {property.source_platform && (
          <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
            {property.source_platform}
          </div>
        )}
        <div className="relative h-32 sm:h-48 overflow-hidden">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-2 sm:p-4">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
            {property.title}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm truncate">
            {property.location}
          </p>
          <p className="text-base sm:text-xl font-bold text-blue-600 mt-1 sm:mt-2 break-words">
            {property.price}
          </p>
          {property.size && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{property.size}</p>
          )}
        </div>
      </div>
    </Link>
  );
}