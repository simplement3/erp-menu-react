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
  estado?: string;
}

export const Dashboard = ({ id_negocio = 1 }: { id_negocio?: number }) => {
  const socketRef = useRef<Socket | null>(null);
  const [pedidos, setPedidos] = useState<PedidoNotif[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Carga inicial de pedidos
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const { data } = await axios.get<PedidoNotif[]>(
          `${API_URL}/api/pedidos/negocio/${id_negocio}`
        );
        // Asegura array válido
        if (Array.isArray(data)) {
          setPedidos(data);
        } else if (Array.isArray((data as any).order)) {
          setPedidos((data as any).order);
        } else {
          setPedidos([]);
        }
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
        toast.error('Error al cargar pedidos anteriores');
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [API_URL, id_negocio]);

  // Conexión WebSocket
  useEffect(() => {
    socketRef.current = io(API_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket conectado:', socketRef.current?.id);
      socketRef.current?.emit('join', { id_negocio });
    });

    socketRef.current.on('nuevo-pedido', (order: PedidoNotif) => {
      setPedidos((prev) => [order, ...prev]);
      toast.success(`🧾 Nuevo pedido #${order.id}`);
    });

    socketRef.current.on('pedido-actualizado', (order: PedidoNotif) => {
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === order.id ? { ...p, estado: order.estado } : p
        )
      );
      toast(`📦 Pedido #${order.id} → ${order.estado}`);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.warn('Socket desconectado:', reason);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Error de conexión WS:', err.message);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [API_URL, id_negocio]);

  // Render
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Dashboard — Negocio {id_negocio}
      </h1>

      {loading ? (
        <p className="text-gray-500">Cargando pedidos...</p>
      ) : !Array.isArray(pedidos) || pedidos.length === 0 ? (
        <p className="text-gray-500">No hay pedidos registrados.</p>
      ) : (
        <ul className="space-y-4">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="p-4 bg-white rounded shadow">
              <h2 className="font-bold text-lg mb-1">
                Pedido #{pedido.id} — {pedido.tipo_pedido}
              </h2>
              <p>Estado: {pedido.estado ?? 'pendiente'}</p>
              <p>Cliente: {pedido.cliente}</p>
              <p>Teléfono: {pedido.telefono}</p>
              {pedido.direccion && <p>Dirección: {pedido.direccion}</p>}
              <p>
                Productos:{' '}
                {(pedido.productos ?? [])
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
                Fecha:{' '}
                {pedido.fecha ? new Date(pedido.fecha).toLocaleString() : 'N/A'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
