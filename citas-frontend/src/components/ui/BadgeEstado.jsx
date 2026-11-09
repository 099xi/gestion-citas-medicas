export default function BadgeEstado({ estado }) {
  return <span className={`badge badge--${estado}`}>{estado}</span>;
}