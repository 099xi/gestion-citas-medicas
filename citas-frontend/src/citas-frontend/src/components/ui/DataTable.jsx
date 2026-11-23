export default function DataTable({ caption, columnas, filas, clave, vacio = 'No hay registros para mostrar.' }) {
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
          {filas.length === 0 && (
            <tr>
              <td className="tabla-vacia" colSpan={columnas.length}>{vacio}</td>
            </tr>
          )}
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
