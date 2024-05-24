"use client";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderActions,
  CreateOrderData,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js";
import { paypalCheckPayment, setTransactionId } from "@/actions";
import { Toaster, toast } from "react-hot-toast";

interface Props {
  orderId: string;
  amount: number;
}

export const PaypalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = Math.round(amount * 100) / 100; //123.23

  if (isPending) {
    return (
      <div className="animate-pulse mb-14">
        <div className="h-11 bg-gray-300 rounded"></div>
        <div className="h-11 bg-gray-300 rounded mt-3"></div>
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ) => {
    const transactionId = await actions.order?.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: `${roundedAmount}`,
            currency_code: "USD",
          },
        },
      ],
    });

    /* console.log(transactionId); */

    //guardar el ID en al base de datos

    const { ok } = await setTransactionId(orderId, transactionId);

    if (!ok) {
      console.log("No se pudo registrar la transacción");
    }

    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();

    if (!details) {
      return;
    }

    const { ok } = await paypalCheckPayment(details.id);

    if (!ok) {
      toast.error("Transacción fallida");
    }

    toast.success("Transacción exitosa");

  };

  return (
    <div className="w-full relative z-0">
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
      <Toaster position="top-center"/>
    </div>
  );
};
