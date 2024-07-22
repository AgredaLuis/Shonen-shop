'use client'
import { totalmem } from "os";
import React, { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    })
    console.log(formData);
    toast.success("Mensaje Enviado");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="sr-only" htmlFor="name">
          Name
        </label>
        <input
          className="w-full rounded-lg border border-gray-300 p-3 text-sm"
          placeholder="Nombre y Apellido"
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="sr-only" htmlFor="email">
            Email
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 p-3 text-sm"
            placeholder="TuCorreo@gmail.com"
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="sr-only" htmlFor="phone">
            Phone
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 p-3 text-sm"
            placeholder="Número telefónico"
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            pattern="[0-9]*"
            required
          />
        </div>
      </div>

      <div>
        <label className="sr-only" htmlFor="message">
          Message
        </label>

        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 text-sm"
          placeholder="Quiero conocer el costo de hacer un diseño de mi producto..."
          rows={8}
          id="message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="inline-block w-full rounded-lg bg-blue-700 px-5 py-3 font-medium text-white sm:w-auto"
        >
          Enviar mensaje
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
