"use server";

import { auth } from "@/auth.config";
import type { Size, Address } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}
export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  /* verificar sesion de usuarios */

  if (!userId) {
    return {
      ok: false,
      message: "No hay usuario identificado",
    };
  }

  //obtener la informacion de los productos
  //Nota  podemos tener o llevar 2 productos con el mismo IDs

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((product) => product.productId),
      },
    },
  });

  // Calcular los montos de los productos

  const ItemsInOrder = productIds.reduce(
    (acc, product) => acc + product.quantity,
    0
  );

  // Los totales de tax, subtotal, y total
  const { subTotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((product) => product.id === item.productId);

      if (!product) throw new Error(`${item.productId} no existe - 500`);

      const subTotal = product.price * productQuantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );

  //console.log({ subTotal, tax, total });

  //Crear la transaccion de base de datos

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos


      //acumular los valores o la cantidad de camisas sin importar la talla
      const updatedPropductsPromises = products.map( (product) => {
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, product) => acc + product.quantity, 0);


          if(productQuantity === 0) {
            throw new Error(`No hay stock del producto ${product.id}`);
          }

        return tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            // inStock: product.inStock - productQuantity, no se debe hacer porque puede ser un inStock viejo
            inStock: { decrement: productQuantity },
          },
        });
      });


      const upadteProducts = await Promise.all(updatedPropductsPromises);

      // Verificar valores negativos en las existencia = no hay stock

      upadteProducts.forEach( (product) => {
        if(product.inStock < 0) {
          throw new Error(`No hay stock del producto para ${product.title}`);
        }
      })

      // 2. Crear la orden - Encabezado - Detalles
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: ItemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,

          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price:
                  products.find((product) => product.id === p.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      });

      // Validar, si el price es cero, entonces, lanzar un error

      // 3. Crear la direccion de la orden
      // Address

      const { country, ...restAddress } = address;
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          orderId: order.id,
          countryId: country,
        },
      });

      return {
        updatedProducts: [],
        order: order,
        orderAddress: orderAddress,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message,
    };
  }
};
