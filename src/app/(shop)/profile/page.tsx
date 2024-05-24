import { auth } from "@/auth.config";
import { Title } from "@/components";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/actions";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    // redirect('/auth/login?returnTo=/perfil');
    redirect("/");
  }

  return (
    <div className="mb-20">
      <Title title="Perfil" className="px-4 " />
      <div className="px-12 flex items-center gap-4 mb-10">
        <div className="w-[70px] h-[70px] bg-gray-300 text-xl font-bold rounded-full flex items-center justify-center">
          {session.user.name.charAt(0).toUpperCase()}
        </div>

        <div className="">
          <div className="flex flex-col px-4">
            <span>Nombre: {session.user.name}</span>
            <span>Rol: {session.user.role}</span>
            <span>
              Email Verificado: {session.user.emailVerified ? "Si" : "No"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 px-4 grid grid-cols-1 gap-4 md:px-10 lg:grid-cols-2 lg:gap-10">
        <Link
          href={"/"}
          className="h-28 rounded-lg bg-gray-400 flex justify-center items-center font-semibold tracking-wide cursor-pointer"
        >
          Ir a la Tienda
        </Link>
        <Link
          href={"/orders"}
          className="h-28 rounded-lg bg-gray-400 flex justify-center items-center font-semibold tracking-wide cursor-pointer"
        >
          Mis Ordenes
        </Link>
        <button
          onClick={logout}
          className="h-28 rounded-lg bg-gray-400 flex justify-center items-center font-semibold tracking-wide cursor-pointer"
        >
          Salir
        </button>
      </div>
    </div>
  );
}
