import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import axios from 'axios';

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
  const [loading, setLoading] = useState(true);

  // Carga inicial de pedidos previos
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const { data } = await axios.get<PedidoNotif[]>(
          `http://localhost:3000/api/pedidos?id_negocio=${id_negocio}`
        );
        setPedidos(data);
      } catch {
        toast.error('Error al cargar pedidos anteriores');
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [id_negocio]);

  // Conexión WebSocket
  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket conectado:', socketRef.current?.id);
      socketRef.current?.emit('join', { id_negocio });
    });

    socketRef.current.on('nuevo-pedido', (order: PedidoNotif) => {
      console.log('Nuevo pedido recibido:', order);
      setPedidos((prev) => [order, ...prev]);
      toast.success(`🧾 Nuevo pedido #${order.id}`);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket desconectado:', reason);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [id_negocio]);

  // Render
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Dashboard — Negocio {id_negocio}
      </h1>
      {loading ? (
        <p className="text-gray-500">Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p className="text-gray-500">No hay pedidos registrados.</p>
      ) : (
        <ul className="space-y-4">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="p-4 bg-white rounded shadow">
              <h2 className="font-bold text-lg mb-1">
                Pedido #{pedido.id} — {pedido.tipo_pedido}
              </h2>
              <p>Cliente: {pedido.cliente}</p>
              <p>Teléfono: {pedido.telefono}</p>
              {pedido.direccion && <p>Dirección: {pedido.direccion}</p>}
              <p>
                Productos:{' '}
                {pedido.productos
                  .map((p) => `${p.nombre} ×${p.cantidad}`)
                  .join(', ')}
              </p>
              <p>
                Total:{' '}
                {new Intl.NumberFormat('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
                }).format(pedido.total)}
              </p>
              <p className="text-sm text-gray-500">
                Fecha: {new Date(pedido.fecha).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
