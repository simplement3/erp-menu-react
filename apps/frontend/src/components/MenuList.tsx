import { useQuery } from '@tanstack/react-query';
import { Button } from '@ui/button';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';

interface MenuItem {
  id: number;
  nombre: string;
  valor_venta: number;
  categoria?: string;
  disponible: boolean;
}

export const MenuList = ({
  id_negocio,
  id_almacen,
}: {
  id_negocio: number;
  id_almacen: number;
}) => {
  const addItem = useCartStore((state) => state.addItem);

  const { data: menu = [], isLoading } = useQuery({
    queryKey: ['menu', id_negocio, id_almacen],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3000/api/menu/public?negocio=${id_negocio}&almacen=${id_almacen}`
      );
      if (!res.ok) throw new Error('Error cargando menú');
      const data = await res.json();
      return data
        .map((item: MenuItem) => ({
          ...item,
          valor_venta: parseFloat(item.valor_venta?.toString() ?? '0') || 0,
        }))
        .filter(
          (item: MenuItem) => item.valor_venta > 0 && !isNaN(item.valor_venta)
        ) as MenuItem[];
    },
  });

  if (isLoading)
    return <div className="text-center py-8">Cargando menú...</div>;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Menú Disponible</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
            {item.categoria && (
              <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                {item.categoria}
              </span>
            )}
            <h3 className="font-semibold mt-2">{item.nombre}</h3>
            <p className="text-xl font-bold text-green-600">
              {new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
              }).format(item.valor_venta)}
            </p>
            <Button
              onClick={() => {
                console.log('Click fired:', item);
                if (!item.disponible)
                  return toast.error('Sin stock disponible');
                addItem({
                  id_producto: item.id,
                  nombre: item.nombre,
                  precio: item.valor_venta,
                });
                console.log('addItem called');
                toast.success(`${item.nombre} agregado al carrito!`);
              }}
              disabled={!item.disponible}
              className="mt-3 w-full bg-green-500 hover:bg-green-600 disabled:opacity-50"
            >
              {item.disponible ? 'Agregar al Carrito' : 'Sin Stock'}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};
