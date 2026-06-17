import type { Metadata } from 'next';
import { resolvePayLink } from '@/lib/payLink';
import { PagarClient } from './PagarClient';

/**
 * Página pública de cobro — features 1 y 4. Sin login: cualquier cliente abre el
 * link compartido (`/pagar/[codigo]`), ve el negocio/vendedor, ingresa el monto
 * y obtiene un QRticket instantáneo.
 *
 * Es un Server Component: resuelve el negocio en el servidor para que el link
 * compartido renderice y previsualice (metadata) sin esperar al cliente.
 */
type Params = { codigo: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { codigo } = await params;
  const info = resolvePayLink(codigo);
  const title = `Pagar a ${info.negocio} · PagoFirme`;
  const description = `${info.vendedor} · ${info.sucursal}. Ingresá el monto y pagá escaneando el QRticket. Sin comisiones.`;
  return {
    title,
    description,
    openGraph: { title, description },
    robots: { index: false }, // links de cobro no deben indexarse
  };
}

export default async function PagarPage({ params }: { params: Promise<Params> }) {
  const { codigo } = await params;
  return <PagarClient info={resolvePayLink(codigo)} />;
}
