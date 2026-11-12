"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { AttributionControl, MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import type { Ponto } from "@/lib/dados/pontos";

const CENTRO_BELEM: [number, number] = [-1.4558, -48.4902];

const SIMBOLO = {
  valido:
    '<path d="M13 19l5 5 9-10" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>',
  vencido:
    '<path d="M20 10v11" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><circle cx="20" cy="27.5" r="2.4" fill="currentColor"/>',
};

function icone(p: Ponto, selecionado: boolean) {
  const [w, h] = selecionado ? [48, 58] : [40, 48];
  const cor = p.situacao === "valido" ? "text-verde" : "text-vermelho";
  return L.divIcon({
    className: "",
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    html: `<span data-pin="${p.situacao}" data-slug="${p.slug}" class="block ${cor}"><svg viewBox="0 0 40 48" width="${w}" height="${h}" aria-hidden="true"><path d="M20 46C12 36 3 28.5 3 18.5a17 17 0 0 1 34 0C37 28.5 28 36 20 46Z" fill="currentColor" class="stroke-branco" stroke-width="2.5"/><g class="text-branco">${SIMBOLO[p.situacao]}</g></svg></span>`,
  });
}

function AjustarVista({ pontos }: { pontos: Ponto[] }) {
  const map = useMap();
  useEffect(() => {
    if (pontos.length === 0) return;
    const limites = L.latLngBounds(pontos.map((p) => [p.latitude, p.longitude] as [number, number]));
    map.fitBounds(limites, { paddingTopLeft: [32, 170], paddingBottomRight: [32, 340], maxZoom: 16 });
  }, [map, pontos]);
  return null;
}

type Props = {
  pontos: Ponto[];
  selecionadoId: string | null;
  onSelecionar: (id: string) => void;
};

export default function Mapa({ pontos, selecionadoId, onSelecionar }: Props) {
  return (
    <MapContainer center={CENTRO_BELEM} zoom={14} zoomControl={false} attributionControl={false} className="size-full">
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19}
      />
      <AttributionControl position="topright" prefix={false} />
      <AjustarVista pontos={pontos} />
      {pontos.map((p) => (
        <Marker
          key={p.id}
          position={[p.latitude, p.longitude]}
          icon={icone(p, p.id === selecionadoId)}
          title={p.nome}
          alt={`${p.nome}: selo ${p.situacao === "valido" ? "válido" : "vencido"}`}
          eventHandlers={{ click: () => onSelecionar(p.id) }}
        />
      ))}
    </MapContainer>
  );
}
