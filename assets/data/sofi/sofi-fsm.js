// Generado por tools/portfolio-export en el repo de SOFI.
// No editar a mano: se regenera desde el sistema.
window.SOFI_FSM = {
  "source": "src/services/fsm.service.js",
  "confidenceThreshold": 0.75,
  "states": [
    "GREETING",
    "INTENTION",
    "URGENCY",
    "CP",
    "COLONIA",
    "PROPERTY_TYPE",
    "ESCRITURAS",
    "VALUE",
    "COMPLETED",
    "HUMAN_TRANSFER",
    "DISQUALIFIED",
    "OFF_TOPIC"
  ],
  "terminalStates": [
    "COMPLETED",
    "HUMAN_TRANSFER",
    "DISQUALIFIED"
  ],
  "intents": [
    "GREETING",
    "AFFIRM",
    "REJECT",
    "QUESTION",
    "HUMAN_REQUEST",
    "PROVIDE_DATA",
    "OFF_TOPIC",
    "PAUSE"
  ],
  "stateMap": {
    "GREETING": [
      "INTENTION",
      "HUMAN_TRANSFER",
      "OFF_TOPIC",
      "DISQUALIFIED"
    ],
    "INTENTION": [
      "URGENCY",
      "DISQUALIFIED",
      "HUMAN_TRANSFER",
      "OFF_TOPIC"
    ],
    "URGENCY": [
      "CP",
      "HUMAN_TRANSFER",
      "OFF_TOPIC"
    ],
    "CP": [
      "COLONIA",
      "HUMAN_TRANSFER",
      "OFF_TOPIC"
    ],
    "COLONIA": [
      "PROPERTY_TYPE",
      "HUMAN_TRANSFER",
      "OFF_TOPIC"
    ],
    "PROPERTY_TYPE": [
      "ESCRITURAS",
      "HUMAN_TRANSFER",
      "OFF_TOPIC"
    ],
    "ESCRITURAS": [
      "VALUE",
      "HUMAN_TRANSFER",
      "OFF_TOPIC"
    ],
    "VALUE": [
      "COMPLETED",
      "HUMAN_TRANSFER",
      "OFF_TOPIC"
    ],
    "OFF_TOPIC": [
      "GREETING",
      "INTENTION",
      "URGENCY",
      "CP",
      "COLONIA",
      "PROPERTY_TYPE",
      "ESCRITURAS",
      "VALUE",
      "COMPLETED",
      "HUMAN_TRANSFER",
      "DISQUALIFIED",
      "OFF_TOPIC"
    ],
    "COMPLETED": [],
    "HUMAN_TRANSFER": [],
    "DISQUALIFIED": []
  },
  "transitionTable": {
    "GREETING": {
      "PROVIDE_DATA": "INTENTION",
      "AFFIRM": "INTENTION",
      "HUMAN_REQUEST": "HUMAN_TRANSFER",
      "REJECT": "DISQUALIFIED",
      "OFF_TOPIC": "OFF_TOPIC"
    },
    "INTENTION": {
      "AFFIRM": "URGENCY",
      "PROVIDE_DATA": "URGENCY",
      "REJECT": "DISQUALIFIED",
      "HUMAN_REQUEST": "HUMAN_TRANSFER",
      "OFF_TOPIC": "OFF_TOPIC"
    },
    "URGENCY": {
      "PROVIDE_DATA": "CP",
      "AFFIRM": "CP",
      "HUMAN_REQUEST": "HUMAN_TRANSFER",
      "OFF_TOPIC": "OFF_TOPIC"
    },
    "CP": {
      "PROVIDE_DATA": "COLONIA",
      "HUMAN_REQUEST": "HUMAN_TRANSFER",
      "OFF_TOPIC": "OFF_TOPIC"
    },
    "COLONIA": {
      "PROVIDE_DATA": "PROPERTY_TYPE",
      "HUMAN_REQUEST": "HUMAN_TRANSFER",
      "OFF_TOPIC": "OFF_TOPIC"
    },
    "PROPERTY_TYPE": {
      "PROVIDE_DATA": "ESCRITURAS",
      "HUMAN_REQUEST": "HUMAN_TRANSFER",
      "OFF_TOPIC": "OFF_TOPIC"
    },
    "ESCRITURAS": {
      "PROVIDE_DATA": "VALUE",
      "AFFIRM": "VALUE",
      "HUMAN_REQUEST": "HUMAN_TRANSFER",
      "OFF_TOPIC": "OFF_TOPIC"
    },
    "VALUE": {
      "PROVIDE_DATA": "COMPLETED",
      "AFFIRM": "COMPLETED",
      "HUMAN_REQUEST": "HUMAN_TRANSFER",
      "OFF_TOPIC": "OFF_TOPIC"
    },
    "OFF_TOPIC": {
      "GREETING": "GREETING",
      "PROVIDE_DATA": "GREETING",
      "AFFIRM": "GREETING"
    }
  },
  "generatedAt": "2026-07-12"
};
