import { Button } from '@ui/button';
import { useNavigate } from 'react-router-dom';

interface PedidoConfirmModalProps {
  pedidoId: number;
  total: number;
  onClose: () => void;
}

export const PedidoConfirmModal = ({
  pedidoId,
  total,
  onClose,
}: PedidoConfirmModalProps) => {
  const navigate = useNavigate();

  const handleIrPago = () => {
    onClose(); // cerrar modal
    navigate(`/pagos/iniciar?pedidoId=${pedidoId}`); // ruta mock
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Pedido #{pedidoId} creado
        </h2>
        <p className="text-gray-600 mb-6">
          Total:{' '}
          <span className="font-semibold text-gray-900">
            {new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP',
            }).format(total)}
          </span>
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleIrPago}
            className="bg-green-500 hover:bg-green-600 w-full"
          >
            Ir a Pago
          </Button>
          <Button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 w-full"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
