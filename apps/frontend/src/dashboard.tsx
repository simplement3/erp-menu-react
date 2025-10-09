import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

interface PedidoNotif {
  id: number;
  cliente: string;
  telefono: string;
  direccion?: string;
  tipo_pedido: 'local' | 'delivery';
  productos: Array<{
    id_producto: number;
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
  total: number;
  fecha: string;
}

export const Dashboard = ({ id_negocio = 1 }: { id_negocio?: number }) => {
  const socketRef = useRef<Socket | null>(null);
  const [pedidos, setPedidos] = useState<PedidoNotif[]>([]);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000', { withCredentials: true });

    socketRef.current.on('connect', () => {
      console.log('Socket conectado:', socketRef.current?.id);
      socketRef.current?.emit('join', { id_negocio });
    });

    socketRef.current.on('joinedRoom', (msg: string) => {
      console.log('Room joined:', msg);
    });

    socketRef.current.on('nuevo-pedido', (order: PedidoNotif) => {
      console.log('Nuevo pedido:', order);
      setPedidos((prev) => [...prev, order]);
      toast.success(`Nuevo pedido #${order.id}`);
    });

    socketRef.current.on('error', (msg: string) => {
      console.error('Error WS:', msg);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket desconectado');
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [id_negocio]);

  console.log('Dashboard rendering');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard - Negocio {id_negocio}</h1>
      {pedidos.length === 0 ? (
        <p className="text-gray-500">No hay pedidos nuevos.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="p-4 bg-white rounded shadow">
              <h2 className="font-bold">Pedido #{pedido.id}</h2>
              <p>Cliente: {pedido.cliente}</p>
              <p>Teléfono: {pedido.telefono}</p>
              {pedido.direccion && <p>Dirección: {pedido.direccion}</p>}
              <p>Tipo: {pedido.tipo_pedido}</p>
              <p>
                Productos:{' '}
                {pedido.productos
                  .map((p) => `${p.nombre} x${p.cantidad}`)
                  .join(', ')}
              </p>
              <p>
                Total:{' '}
                {new Intl.NumberFormat('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
                }).format(pedido.total)}
              </p>
              <p>Fecha: {new Date(pedido.fecha).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
