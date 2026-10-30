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
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative h-full flex flex-col">
        {property.source_platform && (
          // Changed from blue-600 to a dark navy blue
          <div className="absolute top-2 right-2 z-10 bg-[#0A1931] text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow-md">
            {property.source_platform}
          </div>
        )}
        
        <div className="relative h-36 sm:h-48 overflow-hidden shrink-0">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-[#0A1931] transition-colors line-clamp-2 leading-tight">
            {property.title}
          </h3>
          <p className="text-gray-500 text-sm sm:text-base truncate mt-1">
            {property.location}
          </p>
          
          <div className="mt-auto pt-2">
            {/* Added text-sm on mobile and break-all to stop the floating 0 */}
            <p className="text-sm sm:text-lg font-bold text-[#0A1931] break-all">
              {property.price}
            </p>
            {property.size && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{property.size}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}