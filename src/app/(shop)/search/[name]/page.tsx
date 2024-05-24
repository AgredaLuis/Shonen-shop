export const revalidate = 60; // 60 segundos

import { getProductByName } from "@/actions";
import { ProductGrid, Title } from "@/components";

interface Props {
  params: {
    name: string;
  },
}

export default async function SearchPage({ params }: Props) {
  const { name } = params;

  const { products: ProductByName} = await getProductByName(name);


  return (
    <div>
      <Title
        title="Tienda"
        subtitle="Todos los productos"
        className="ml-4 mb-2"
      />

      {
        !ProductByName.length && (<p className="text-center text-3xl">No hay resultados</p> )
      }

      <ProductGrid products={ProductByName} />
    </div>
  );
}
