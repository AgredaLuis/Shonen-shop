"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { ok } from "assert";

export const getOrderById = async (id: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: "No hay usuario identificado",
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
          OrderAddress: true,
          OrderItem: {
            select: {
                price: true,
                quantity: true,
                size: true,

                product: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,

                        ProductImage: {
                            select: {
                                url: true
                            },
                            take: 1
                        }
                    }
                }
            }
          },
      }
    });

    if (!order){
        throw ` el ID ${ id } de la orden no existe`
    }

    if(session.user.role === 'user'){
        if(session.user.id !== order.userId){
            throw `el order con el ID ${ id } no es de ese usuario`
        }
    }

    return {
      ok: true,
      order,
    };
  } catch (error) {
    //console.log(error)
    return {
      ok: false,
      message: "Error al obtener orden",
    };
  }
};
