export interface Pedido {
  id: number;
  id_negocio: number;
  cliente: string;
  telefono: string;
  direccion?: string;
  tipo_pedido: 'local' | 'delivery';
  productos: { id_producto: number; nombre: string; cantidad: number; precio: number }[];
  total: number;
  estado_pago: 'pendiente' | 'pagado' | 'rechazado';
  fecha: string;
  estado: 'pendiente' | 'confirmado' | 'entregado' | 'cancelado';
}

export interface Producto {
  id: number;
  nombre: string;
  tipo: 'producto_final' | 'insumo';
  unidad_medida: string;
  precio: number;
  cantidad?: number;
}

export interface Negocio {
  id: number;
  nombre: string;
}
