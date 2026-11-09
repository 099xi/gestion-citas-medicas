export default function Card({ titulo, numero, detalle }) {
  return (
    <article className="tarjeta" aria-label={titulo}>
      <h2>{titulo}</h2>
      {numero !== undefined && <p className="tarjeta-numero">{numero}</p>}
      {detalle && <p>{detalle}</p>}
    </article>
  );
}