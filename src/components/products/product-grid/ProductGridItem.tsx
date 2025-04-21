"use client";

import Image from "next/image";
import Link from "next/link";

import { Product } from "@/interfaces";
import { useState } from "react";

interface Props {
  product: Product;
}

export const ProductGridItem = ({ product }: Props) => {
  const localSrc1 = product?.images[0]
    ? product?.images[0].startsWith("http") // https://urlcompletodelaimagen.jpg
      ? product?.images[0]
      : `/products/${product?.images[0]}`
    : "/imgs/placeholder.jpg";

  const localSrc2 = product?.images[1]
    ? product?.images[1].startsWith("http") // https://urlcompletodelaimagen.jpg
      ? product?.images[1]
      : `/products/${product?.images[1]}`
    : "/imgs/placeholder.jpg";

  const [displayImage, setDisplayImage] = useState(localSrc1);

  return (
    <div className="rounded-md overflow-hidden fade-in ">
      <Link href={`/product/${product.slug}`}>
        <Image
          src={`/products/${displayImage}`}
          alt={product.title}
          className="w-full object-cover rounded"
          width={500}
          height={500}
          onMouseEnter={() => setDisplayImage(localSrc2)}
          onMouseLeave={() => setDisplayImage(localSrc1)}
        />
      </Link>

      <div className="p-4 flex flex-col">
        <Link className="hover:text-blue-600" href={`/product/${product.slug}`}>
          {product.title}
        </Link>
        <span className="font-bold">${product.price}</span>
      </div>
    </div>
  );
};
