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

  // Carga inicial
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const { data } = await axios.get<PedidoNotif[]>(
          `${API_URL}/api/pedidos/negocio/${id_negocio}`
        );

        if (Array.isArray(data)) setPedidos(data);
        else if (Array.isArray((data as any).order))
          setPedidos((data as any).order);
        else setPedidos([]);
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

  // WebSocket con reconexión segura
  useEffect(() => {
    const socket = io(API_URL, {
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log(`✅ Socket conectado: ${socket.id}`);
      socket.emit('join', { id_negocio });
    });

    socket.on('nuevo-pedido', (order: PedidoNotif) => {
      setPedidos((prev) => [order, ...prev]);
      toast.success(`🧾 Nuevo pedido #${order.id}`);
    });

    socket.on('pedido-actualizado', (order: PedidoNotif) => {
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === order.id ? { ...p, estado: order.estado } : p
        )
      );
      toast(`📦 Pedido #${order.id} → ${order.estado}`);
    });

    socket.on('disconnect', (reason) => {
      console.warn(`⚠️ Socket desconectado: ${reason}`);
    });

    socket.on('connect_error', (err) => {
      console.warn(`❌ Error de conexión WS: ${err.message}`);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [API_URL, id_negocio]);

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
