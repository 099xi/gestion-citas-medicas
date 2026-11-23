import { useState } from 'react';

// Maneja el estado de un formulario (valores, errores, envío) para que los
// componentes de vista solo se ocupen de la presentación.
//   validar(valores) -> objeto { campo: 'mensaje' } (vacío si todo es válido)
export default function useFormulario(valoresIniciales, validar) {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});

  const cambiar = (e) => {
    const { name, value } = e.target;
    setValores((anteriores) => ({ ...anteriores, [name]: value }));
  };

  // enviar(alEnviar) devuelve el manejador del <form onSubmit>
  const enviar = (alEnviar) => (e) => {
    e.preventDefault();
    const nuevos = validar(valores);
    setErrores(nuevos);
    if (Object.keys(nuevos).length === 0) alEnviar(valores);
  };

  const reiniciar = () => {
    setValores(valoresIniciales);
    setErrores({});
  };

  return { valores, errores, setErrores, cambiar, enviar, reiniciar };
}
