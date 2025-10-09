import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { PedidoForm } from './components/PedidoForm';
import { MenuList } from './components/MenuList';
import { Cart } from './components/Cart';
import { Dashboard } from './dashboard'; // <-- Corrige import
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

function App() {
  const [id_negocio, setIdNegocio] = useState(1);
  const [id_almacen, setIdAlmacen] = useState(1);

  console.log('App rendering');

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-amber-600 text-white p-4 shadow-lg">
            <h1 className="text-3xl font-bold text-center">Menú Digital</h1>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              <select
                value={id_negocio}
                onChange={(e) => setIdNegocio(Number(e.target.value))}
                className="p-2 rounded bg-white text-gray-800"
              >
                <option value={1}>Negocio 1</option>
                <option value={2}>Negocio 2</option>
              </select>
              <select
                value={id_almacen}
                onChange={(e) => setIdAlmacen(Number(e.target.value))}
                className="p-2 rounded bg-white text-gray-800"
              >
                <option value={1}>Almacén 1</option>
                <option value={2}>Almacén 2</option>
              </select>
            </div>
          </header>
          <main className="container mx-auto p-4 max-w-6xl">
            <div className="grid lg:grid-cols-4 gap-8">
              <section className="lg:col-span-3">
                <MenuList id_negocio={id_negocio} id_almacen={id_almacen} />
              </section>
              <Cart />
            </div>
            {useCartStore((state) => state.items.length > 0) && ( // <-- Condicional
              <div className="mt-8">
                <PedidoForm id_negocio={id_negocio} id_almacen={id_almacen} />
              </div>
            )}
          </main>
          <Dashboard id_negocio={id_negocio} />
          <Toaster position="top-right" />
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
