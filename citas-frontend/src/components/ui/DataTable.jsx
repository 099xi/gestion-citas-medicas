export default function DataTable({ caption, columnas, filas, clave }) {
  return (
    <div className="tabla-contenedor">
      <table>
        {caption && <caption className="tabla-titulo">{caption}</caption>}
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={col.campo} scope="col">{col.titulo}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={clave ? clave(fila) : i}>
              {columnas.map((col) => (
                <td key={col.campo}>{col.render ? col.render(fila) : fila[col.campo]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}