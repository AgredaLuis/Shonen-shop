
export const revalidate = 60; // 60 segundos

import { redirect } from "next/navigation";

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Footer } from "@/components/ui/footer/Footer";


interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  /* server action para obtener los productos a mostrarse en al apgina y el total pages para pasarle al componente de pagination */
  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({ page });

  const productsWithImages = products.filter(
    (product) => product.ProductImage.length !== 0 //podria ser tambien que la condicion sea menor a 2
  );

  if (products.length === 0) {
    redirect("/");
  }

  return (
    <>
      <Title
        title="Tienda"
        subtitle="Todos los productos"
        className="ml-4 mb-2"
      />
      <ProductGrid products={productsWithImages} />

      <Pagination totalPages={totalPages} />
      
      <Footer />
    </>
  );
}
