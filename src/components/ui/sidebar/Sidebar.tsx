"use client";

import Link from "next/link";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoMailOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store";
import { logout } from "@/actions";

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "admin";

  const handleSearch = () => {
    if (search) {
      router.push(`/search/${search}`);
      closeMenu();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      {/* Background black */}
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
      )}

      {/* Blur */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
        />
      )}

      {/* Sidemenu */}
      <nav
        className={clsx(
          "fixed p-4 right-0 top-0 w-[65%] md:w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300 scrollbar-y-auto",
          {
            "translate-x-full": !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={50}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => closeMenu()}
        />

        {/* Input */}
        <div className="relative mt-10">
          <IoSearchOutline
            size={20}
            className="absolute top-2 left-2"
            onClick={() => handleSearch()}
          />
          <input
            type="text"
            placeholder="Buscar"
            value={search}
            className="w-full bg-transparent pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-gray-900"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Menú */}

        {isAuthenticated && (
          <>
            <Link
              href="/profile"
              onClick={() => closeMenu()}
              className="flex items-center mt-8 p-1 hover:bg-gray-100 rounded transition-all"
            >
              <IoPersonOutline size={25} />
              <span className="ml-3 text-xl">Perfil</span>
            </Link>

            <Link
              href="/orders"
              onClick={() => closeMenu()}
              className="flex items-center mt-8 p-1 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={25} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>

            <Link
              href="/contact"
              onClick={() => closeMenu()}
              className="flex items-center mt-8 p-1 hover:bg-gray-100 rounded transition-all"
            >
              <IoMailOutline  size={25} />
              <span className="ml-3 text-xl">Contacto</span>
            </Link>
          </>
        )}

        {isAuthenticated && (
          <button
            className="flex w-full items-center mt-8 p-1 hover:bg-gray-100 rounded transition-all"
            onClick={() => logout()}
          >
            <IoLogOutOutline size={25} />
            <span className="ml-3 text-xl">Salir</span>
          </button>
        )}

        {!isAuthenticated && (
          <Link
            href="/auth/login"
            className="flex items-center mt-8 p-1 hover:bg-gray-100 rounded transition-all"
            onClick={() => closeMenu()}
          >
            <IoLogInOutline size={25} />
            <span className="ml-3 text-xl">Ingresar</span>
          </Link>
        )}

        {isAdmin && (
          <>
            {/* Line Separator */}
            <div className="w-full h-px bg-gray-200 my-10" />

            <Link
              href="/admin/products"
              onClick={() => closeMenu()}
              className="flex items-center mt-8 p-1 hover:bg-gray-100 rounded transition-all"
            >
              <IoShirtOutline size={25} />
              <span className="ml-3 text-xl">Productos</span>
            </Link>

            <Link
              href="/admin/orders"
              onClick={() => closeMenu()}
              className="flex items-center mt-8 p-1 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={25} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>

            <Link
              href="/admin/users"
              onClick={() => closeMenu()}
              className="flex items-center mt-8 p-1 hover:bg-gray-100 rounded transition-all"
            >
              <IoPeopleOutline size={25} />
              <span className="ml-3 text-xl">Usuarios</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
