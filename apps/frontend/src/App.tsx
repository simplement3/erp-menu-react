import { useState, useEffect } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { PedidoForm } from './components/PedidoForm';
import { MenuList } from './components/MenuList';
import { Cart } from './components/Cart';
import { Dashboard } from './dashboard';
import { useCartStore } from './stores/cartStore';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
});

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Error in component:', error);
    return <div>Error en la app: {String(error)}</div>;
  }
};

// --- API helpers ---
const fetchNegocios = async () => {
  const res = await fetch('/api/negocios');
  if (!res.ok) throw new Error('Error cargando negocios');
  return res.json();
};
const fetchAlmacenes = async () => {
  const res = await fetch('/api/almacenes');
  if (!res.ok) throw new Error('Error cargando almacenes');
  return res.json();
};

function AppContent() {
  const { data: negocios } = useQuery({
    queryKey: ['negocios'],
    queryFn: fetchNegocios,
  });
  const { data: almacenes } = useQuery({
    queryKey: ['almacenes'],
    queryFn: fetchAlmacenes,
  });

  const [id_negocio, setIdNegocio] = useState<number>(() => {
    const saved = localStorage.getItem('id_negocio');
    return saved ? Number(saved) : 1;
  });
  const [id_almacen, setIdAlmacen] = useState<number>(() => {
    const saved = localStorage.getItem('id_almacen');
    return saved ? Number(saved) : 1;
  });
  const [mostrarAvanzado, setMostrarAvanzado] = useState<boolean>(false);

  // Establecer primeros valores automáticamente si no hay guardados
  useEffect(() => {
    if (!localStorage.getItem('id_negocio') && negocios?.data?.length > 0) {
      const firstId = negocios.data[0].id;
      setIdNegocio(firstId);
      localStorage.setItem('id_negocio', String(firstId));
    }
    if (!localStorage.getItem('id_almacen') && almacenes?.data?.length > 0) {
      const firstId = almacenes.data[0].id;
      setIdAlmacen(firstId);
      localStorage.setItem('id_almacen', String(firstId));
    }
  }, [negocios, almacenes]);

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem('id_negocio', String(id_negocio));
  }, [id_negocio]);

  useEffect(() => {
    localStorage.setItem('id_almacen', String(id_almacen));
  }, [id_almacen]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-amber-600 text-white p-4 shadow-lg">
        <h1 className="text-3xl font-bold text-center">Menú Digital</h1>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => setMostrarAvanzado(!mostrarAvanzado)}
            className="text-sm underline hover:text-gray-200 transition"
          >
            {mostrarAvanzado
              ? 'Ocultar selección avanzada'
              : 'Mostrar selección avanzada'}
          </button>
        </div>

        {/* Dropdowns cargados dinámicamente (ocultos por defecto) */}
        {mostrarAvanzado && (
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <select
              value={id_negocio}
              onChange={(e) => setIdNegocio(Number(e.target.value))}
              className="p-2 rounded bg-white text-gray-800"
            >
              {negocios?.data?.map((n: any) => (
                <option key={n.id} value={n.id}>
                  {n.nombre}
                </option>
              ))}
            </select>

            <select
              value={id_almacen}
              onChange={(e) => setIdAlmacen(Number(e.target.value))}
              className="p-2 rounded bg-white text-gray-800"
            >
              {almacenes?.data?.map((a: any) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      <main className="container mx-auto p-4 max-w-6xl">
        <div className="grid lg:grid-cols-4 gap-8">
          <section className="lg:col-span-3">
            <MenuList id_negocio={id_negocio} id_almacen={id_almacen} />
          </section>
          <Cart />
        </div>

        {useCartStore((state) => state.items.length > 0) && (
          <div className="mt-8">
            <PedidoForm id_negocio={id_negocio} id_almacen={id_almacen} />
          </div>
        )}
      </main>

      <Dashboard id_negocio={id_negocio} />
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
