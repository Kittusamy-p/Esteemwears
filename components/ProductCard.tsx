"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const lowestPrice = Math.min(...product.sizes.map((s) => s.price));

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card bg-white overflow-hidden shadow-md hover:shadow-xl transition"
    >
      {/* IMAGE */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover scale-110 hover:scale-125 transition-transform duration-500"
        />

        {/* PRICE TAG */}
        <div className="absolute top-2 left-2 badge badge-yellow">
          From ₹{lowestPrice}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3 space-y-2">
        <h2 className="font-semibold text-sm line-clamp-2">{product.name}</h2>

        {/* STORES */}
        <div className="flex gap-2 flex-wrap text-xs">
          {product.links.map((l) => (
            <span key={l.platform} className="badge capitalize">
              {l.platform} ⭐ {l.rating}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button className="btn btn-yellow w-full mt-2">View Product</button>
      </div>
    </motion.div>
  );
}
