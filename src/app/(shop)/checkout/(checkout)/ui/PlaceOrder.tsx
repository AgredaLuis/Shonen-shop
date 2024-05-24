"use client";

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat, sleep } from "@/utils";
import clsx from "clsx";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {Toaster, toast} from "react-hot-toast";

export const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setloaded] = useState(false);
  const [isPLacingOrder, setIsPLacingOrder] = useState(false);
  const [error, setError] = useState('');

  const address = useAddressStore((state) => state.address);
  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setloaded(true);

     if( itemsInCart === 0 ) {
      redirect('/empty');
    } 
  }, []);


  const placeToOrder = async () => {
    setIsPLacingOrder(true);

    const productsToOrder = cart.map(product => ({
        productId: product.id,
        quantity: product.quantity,
        size : product.size
    }))


    //  Server action
    const res = await placeOrder(productsToOrder, address);

    if ( !res.ok ) {
      setIsPLacingOrder(false);
      setError(res.message);
      toast.error('Error al crear la orden');
      return
    }

    //Todo salio bien
    // Se creo ordedn con ID y todo bien en BDD
    toast.success('Orden creada');
    router.replace('/orders/' + res.order?.id);
    clearCart();

  }

  if (!loaded) {
    return <p>Loading...</p>;
  }
  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city} {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Resumen de orden</h2>

      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">
          {currencyFormat(total)}
        </span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">
            Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros{" "}
            <a href="#" className="underline">
              términos y condiciones
            </a>{" "}
            y{" "}
            <a href="#" className="underline">
              política de privacidad
            </a>
          </span>
        </p>


        {<p className="text-red-500">{error}</p>}
        <button
          className={clsx({
            "btn-primary": !isPLacingOrder,
            "btn-disabled": isPLacingOrder
          })}
          /* href="/orders/123" */
          onClick={placeToOrder}
        >
          Colocar orden
        </button>
      </div>

      <Toaster position="top-center"/>
    </div>
  );
};
