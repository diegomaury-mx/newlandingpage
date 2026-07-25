// Generado por tools/portfolio-export en el repo de SOFI.
// No editar a mano: se regenera desde el sistema.
window.SOFI_METRICS = {
  "generatedAt": "2026-07-12",
  "items": [
    {
      "label": "Commits",
      "value": "511",
      "method": "git rev-list --count HEAD en el repo de SOFI, del 2026-05-03 al 2026-07-12."
    },
    {
      "label": "Tests automatizados",
      "value": "392",
      "method": "Total que reporta Jest al correr la suite del sistema. Excluye los tests de las herramientas de export de este portafolio, que no son parte del sistema."
    },
    {
      "label": "Estados del FSM",
      "value": "12",
      "method": "Extraídos de src/services/fsm.service.js con un script. El diagrama de esta página se genera de ahí."
    },
    {
      "label": "Intents del modelo",
      "value": "8",
      "method": "Enum cerrado, validado con Zod en src/services/ai.service.js. El modelo no puede devolver otra cosa."
    },
    {
      "label": "Tiempo de respuesta del agente",
      "value": "2.1 s",
      "method": "Mediana del tiempo entre cada mensaje del lead y la respuesta de SOFI, medida en la corrida del banco de pruebas que reproduce el simulador. No es el speed-to-lead de producción."
    }
  ]
};
