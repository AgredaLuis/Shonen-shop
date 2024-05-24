
'use server'
import prisma from "@/lib/prisma";

export const getProductByName = async (name: string) => {

  try {
    const products = await prisma.product.findMany({
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      where: {
        title: {
          contains: name,
          mode: "insensitive",
        },
      },
    });

    return {
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    };
  } catch (error) {
    //console.error("Error al obtener productos por nombre:", error);
    throw new Error("Error al obtener productos por nombre");
  }
};
