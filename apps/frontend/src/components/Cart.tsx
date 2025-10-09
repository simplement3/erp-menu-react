import { useCartStore, useCartTotal } from '../stores/cartStore';
import { Button } from '@ui/button';
import toast from 'react-hot-toast';

export const Cart = () => {
  const { items, removeItem, clear } = useCartStore();
  console.log('Cart re-render, items:', items);
  const total = useCartTotal();

  return (
    <aside className="bg-white p-4 rounded-lg shadow-md h-fit sticky top-4">
      <h2 className="text-xl font-bold mb-4">
        Carrito de Compras ({items.length})
      </h2>
      {items.length === 0 ? (
        <p className="text-gray-500 italic">Tu carrito está vacío</p>
      ) : (
        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div
              key={item.id_producto}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{item.nombre}</p>
                <p className="text-sm text-gray-600">
                  x{item.cantidad} - ${item.precio.toLocaleString('es-CL')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    removeItem(item.id_producto);
                    toast('Item removido');
                  }}
                  className="h-8 px-3 text-xs bg-red-500 hover:bg-red-600"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="border-t pt-4 space-y-2">
        <p className="text-lg font-bold text-right">
          Total:{' '}
          {new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
          }).format(total)}
        </p>
        <Button
          onClick={() => {
            clear();
            toast('Carrito limpiado');
          }}
          className="w-full border-gray-300 hover:bg-gray-50"
        >
          Limpiar Carrito
        </Button>
        {total > 0 && (
          <Button
            onClick={() =>
              toast.success('Completa el formulario de pedido abajo')
            } // <-- Mensaje claro
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Proceder a Pedido
          </Button>
        )}
      </div>
    </aside>
  );
};
