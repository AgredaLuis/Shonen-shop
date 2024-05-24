'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrdersByUser = async() => {
    const session = await auth();

    if (!session?.user) {
        return {
            ok: false,
            message: "No hay usuario identificado",
        };
    }

    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                OrderAddress: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return {
            ok: true,
            orders
        }
    } catch (error) {
        return {
            ok: false,
            message: "Error al obtener las ordenes",
        }
        
    }
}