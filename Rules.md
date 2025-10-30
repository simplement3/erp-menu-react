# 🧭 Lineamientos y Reglas de Desarrollo – C3

## ⚠️ Principio General

**No reinventar código existente.**  
Corrige solo lo necesario, mantén coherencia, estabilidad y pragmatismo.

---

## 🧩 Estructura y Consistencia

1. Revisar siempre el proyecto actual antes de proponer cambios.
2. No duplicar módulos, imports o dependencias.
3. Mantener compatibilidad total con NestJS + React actuales.
4. Frontend y backend deben compilar sin warnings ni conflictos.

---

## 🧱 Estilo de Desarrollo

1. Siempre entregar **código completo**, nunca extractos.
2. Respetar tipados TypeScript y las reglas ESLint.
3. Evitar `any`, `require`, o conversiones inseguras.
4. Verificar si la dependencia ya existe antes de instalar.
5. Corregir errores sin romper otros módulos.

---

## 🧠 Flujo de Trabajo

1. Cada commit representa un módulo funcional y probado.
2. Si hay fallos, volver al último punto de restauración.
3. Ejecutar `npm run lint` y `npm run build` antes de avanzar.
4. Usar branches solo para desarrollo; `main` siempre estable.

---

## 🎯 Objetivo C3

- Integrar **Dashboard en tiempo real** (WebSocket + REST).
- Mantener `OrdersGateway` y backend estables.
- Evitar conflictos de dependencias.
- Confirmar que `lint` y `build` estén limpios antes del commit `C3`.

---

## ✅ Resultado Esperado

Dashboard actualizado con pedidos en tiempo real + pedidos previos,  
con backend estable y sin errores de compilación ni ESLint.
