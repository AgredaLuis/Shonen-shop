"use server";

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export const paypalCheckPayment = async (
  paypalTransactionId: string | undefined
) => {
  const authToken = await getPaypalBearerToken();

  if (!authToken) {
    return {
      ok: false,
      message: "No se pudo obtener el token",
    };
  }

  const resp = await verifyPaypalPayment(paypalTransactionId || "", authToken);

  if(!resp){
    return {
      ok: false,
      message: "No se pudo verificar el estado de la transacción",
    };
  }

  const {status , purchase_units} = resp;
  const {invoice_id: orderId} = purchase_units[0];

  if(status !== "COMPLETED"){
    return {
      ok: false,
      message: "Aun se se ha pagado para la transacción.",
    };
  }

  //Realizar la atualizacion en nuestra base de datos

  try {
    
    await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
    isPaid: true,
    paidAt: new Date(),
      }
    })

    revalidatePath(`/orders/${orderId}`)

    return {
      ok: true,
      message: "Transacción exitosa",
    }
  } catch (error) {
    //console.log(error)
    return {
      ok: false,
      message: "No se pudo actualizar la transacción",
    }
  }
};

/* bearer token request que sirve para obtener el token de autorización de paypal para hacer las peticiones */

const getPaypalBearerToken = async () => {
  const base64token = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(
      process.env.PAYPAL_OAUTH_URL || "",
      {...requestOptions, cache: "no-store"}
    );
    const res = await result.json();

    return res.access_token;
  } catch (err) {
    //console.log(err);
  }
};

/* verificar el estado de la transacción paypal */
const verifyPaypalPayment = async (
  paypaltransactionId: string,
  getPaypalBearerToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  const paypyalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypaltransactionId}`;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${getPaypalBearerToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const result = await fetch(paypyalOrderUrl, {...requestOptions , cache: "no-store"});
    const res = await result.json();

    return res;
  } catch (error) {
    //console.log(error);
    return null;
  }
};
