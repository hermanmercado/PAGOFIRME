'use client';

import dynamic from 'next/dynamic';

// Render client-only: sin SSR no hay HTML de la caja antes de hidratar, así el QR
// del día se calcula en el primer render del cliente y aparece instantáneo.
const VendedorDashboard = dynamic(() => import('./VendedorDashboard'), {
  ssr: false,
  loading: () => <div className="h-dvh w-full bg-void" />,
});

export default function VendedorPage() {
  return <VendedorDashboard />;
}
