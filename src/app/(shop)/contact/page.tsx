import ContactForm from "@/components/contactForm/ContactForm";
import { Title } from "@/components/ui/title/Title";

export default function ContactPage() {
  return (
    <>
      <Title
        title="Persolaniza tu Producto"
        subtitle="Cuentanos sobre tu producto"
        className="ml-4 mb-2"
      />

      <section className="bg-gray-100">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
            <div className="lg:col-span-2 lg:py-12">
              <p className="max-w-xl text-lg">
                Mejoramos tu presencia y exposicion de tu negocio, realizamos
                uniformes y accesorios corporativos de alta calidad, tenemos
                Franelas, gorras. Adicionalmente realizamos envio Nacionales y
                Internacionales con previo acuerdo.
              </p>

              <div className="mt-8">
                <a href="#" className="text-2xl font-bold text-pink-600">
                  {" "}
                  0424 899 4407{" "}
                </a>

                <address className="mt-2 not-italic">
                  Puerto La Cruz, Estado Anzoátegui, Venezuela
                </address>
              </div>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
