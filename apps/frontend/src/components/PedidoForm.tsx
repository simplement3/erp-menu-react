import { useForm } from 'react-hook-form';
import { Button } from '@ui/button';
import { useCartStore, useCartTotal } from '../stores/cartStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface FormData {
  cliente: string;
  telefono: string;
  direccion?: string;
  tipo_pedido: 'local' | 'delivery';
}

export const PedidoForm = ({
  id_negocio,
  id_almacen,
}: {
  id_negocio: number;
  id_almacen: number;
}) => {
  const { items, clear } = useCartStore();
  const queryClient = useQueryClient();
  const total = useCartTotal();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { tipo_pedido: 'local' } });

  const tipoPedido = watch('tipo_pedido');

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_negocio,
          id_almacen,
          ...data,
          productos: items,
          total,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error creando pedido');
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(`Pedido #${data.order.id} creado!`);
      clear();
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
    onError: (error: Error) => toast.error(error.message || 'Error en pedido'),
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);
  if (items.length === 0) return null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 bg-white rounded shadow mt-8"
    >
      <h2 className="text-2xl font-bold">Datos del Pedido</h2>

      <input
        {...register('cliente', {
          required: 'Cliente requerido',
          maxLength: { value: 100, message: 'Máximo 100 caracteres' },
        })}
        placeholder="Nombre"
        className="w-full p-2 border rounded"
      />
      {errors.cliente && (
        <p className="text-red-500">{errors.cliente.message}</p>
      )}

      <input
        {...register('telefono', {
          required: 'Teléfono requerido',
          pattern: { value: /^\+569\d{8}$/, message: 'Formato +56912345678' },
        })}
        placeholder="Teléfono (+56912345678)"
        className="w-full p-2 border rounded"
      />
      {errors.telefono && (
        <p className="text-red-500">{errors.telefono.message}</p>
      )}

      <select
        {...register('tipo_pedido')}
        className="w-full p-2 border rounded"
      >
        <option value="local">Local</option>
        <option value="delivery">Delivery</option>
      </select>

      {tipoPedido === 'delivery' && (
        <>
          <input
            {...register('direccion', { required: 'Dirección requerida' })}
            placeholder="Dirección"
            className="w-full p-2 border rounded"
          />
          {errors.direccion && (
            <p className="text-red-500">{errors.direccion.message}</p>
          )}
        </>
      )}

      <p className="text-lg font-bold">
        Total:{' '}
        {new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
        }).format(total)}
      </p>

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-blue-500 hover:bg-blue-600 relative"
      >
        {mutation.isPending ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
              />
            </svg>
            Procesando...
          </span>
        ) : (
          'Crear Pedido'
        )}
      </Button>
    </form>
  );
};
