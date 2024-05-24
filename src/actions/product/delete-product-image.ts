/* aqui eliminamos imagenes de un producto dentro de clauddinary tambien */

"use server";
import prisma from '@/lib/prisma';
import {v2 as cloudinary} from 'cloudinary';
import { revalidatePath } from 'next/cache';


cloudinary.config({
  cloud_name: 'drtfox2ga',
  api_key: '424487972765664',
  api_secret: 'xCNHGDkw0L0M6UugXzsJ8maPrIM',
  secure: true,
});

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  if (!imageUrl.startsWith("http")) {
    return {
      ok: false,
      message: "La imagen no es valida",
    };
  }

  const imageName = imageUrl.split("/").pop()?.split(".")[0] ?? "";

  try {

    await cloudinary.uploader.destroy(imageName);

    const deletedImage = await prisma.productImage.delete({
      where: {
        id: imageId
      },
      select: {
          product: {
              select: {
                  slug: true
              }
          }
      }
    })

    //Revalidar los Paths

    revalidatePath(`/admin/products`)
    revalidatePath(`/admin/product/${ deletedImage.product.slug }`);
    revalidatePath(`/product/${ deletedImage.product.slug }`);

  } catch (error) {

    return {
        ok: false,
        message: "No se pudo eliminar la imagen"
    }
  }
};
