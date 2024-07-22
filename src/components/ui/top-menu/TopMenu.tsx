"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { titleFont } from "@/config/fonts";
import { useCartStore, useUIStore } from "@/store";
import { SearchInput } from "../searchInput/SearchInput";

export const TopMenu = () => {
  const openSideMenu = useUIStore((state) => state.openSideMenu);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <nav className="flex px-10 justify-between items-center w-full">
      {/* Logo */}
      <div>
        <Link href="/">
          <span className={`${titleFont} antialiased font-bold text-xl`}>
            PACHUS
          </span>
          <span className="text-lg"> | Shop</span>
        </Link>
      </div>

      {/* Center Menu */}
      <div className="hidden sm:block">
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100 text-lg"
          href="/gender/men"
        >
          Hombres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100 text-lg"
          href="/gender/women"
        >
          Mujeres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100 text-lg"
          href="/gender/kid"
        >
          Niños
        </Link>
      </div>

      {/* Search, Cart, Menu */}
      <div className="flex items-center">
        <div className="hidden sm:block">
          <SearchInput />
        </div>

        <Link
          href={totalItemsInCart === 0 && loaded ? "/empty" : "/cart"}
          className=" p-2 rounded-md transition-all hover:bg-gray-100"
        >
          <div className="relative">
            {loaded && totalItemsInCart > 0 && (
              <span className="fade-in absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-red-700 text-white">
                {totalItemsInCart}
              </span>
            )}
            <IoCartOutline className="w-5 h-5 " />
          </div>
        </Link>

        <button
          onClick={openSideMenu}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100 text-lg"
        >
          Menú
        </button>
      </div>
    </nav>
  );
};
