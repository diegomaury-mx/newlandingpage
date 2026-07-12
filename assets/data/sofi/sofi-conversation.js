// Generado por tools/portfolio-export en el repo de SOFI.
// No editar a mano: se regenera desde el sistema.
window.SOFI_CONVERSATION = {
  "provenance": {
    "system": "Corrida contra el sistema real: webhook con firma HMAC válida, ai.service.js sobre OpenRouter y fsm.service.js, en el banco de pruebas local.",
    "lead": "El lead es ficticio. Lo hice yo.",
    "capturedAt": "2026-07",
    "turnCount": 20,
    "finalState": "COMPLETED"
  },
  "turns": [
    {
      "i": 0,
      "dir": "in",
      "text": "Hola",
      "tOffsetMs": 0,
      "trace": {
        "stateBefore": "GREETING",
        "stateAfter": "GREETING",
        "intent": "GREETING",
        "confidence": 1,
        "applied": false,
        "reason": null
      }
    },
    {
      "i": 1,
      "dir": "out",
      "text": "¡Hola! 😊👋 Soy Sofi, asistente virtual de Fliphouse. Gracias por escribirnos. ¿Con quién tengo el gusto?",
      "tOffsetMs": 2090
    },
    {
      "i": 2,
      "dir": "in",
      "text": "Diego",
      "tOffsetMs": 4750,
      "trace": {
        "stateBefore": "GREETING",
        "stateAfter": "INTENTION",
        "intent": "PROVIDE_DATA",
        "confidence": 1,
        "applied": true,
        "reason": null
      }
    },
    {
      "i": 3,
      "dir": "out",
      "text": "¡Qué gusto, Diego! 😊 ¿Cómo estás?",
      "tOffsetMs": 9035
    },
    {
      "i": 4,
      "dir": "in",
      "text": "Bien y tú",
      "tOffsetMs": 11965,
      "trace": {
        "stateBefore": "INTENTION",
        "stateAfter": "INTENTION",
        "intent": "QUESTION",
        "confidence": 0.95,
        "applied": false,
        "reason": null
      }
    },
    {
      "i": 5,
      "dir": "out",
      "text": "¡Qué bueno! Aquí para ayudarte 😊 Nos escribiste porque te interesa el adelanto de venta, ¿verdad? 🏠",
      "tOffsetMs": 13743
    },
    {
      "i": 6,
      "dir": "in",
      "text": "Sí",
      "tOffsetMs": 16353,
      "trace": {
        "stateBefore": "INTENTION",
        "stateAfter": "URGENCY",
        "intent": "AFFIRM",
        "confidence": 0.95,
        "applied": true,
        "reason": null
      }
    },
    {
      "i": 7,
      "dir": "out",
      "text": "¡Perfecto! Te hago unas preguntas rápidas para poder orientarte bien. ¿Qué tan pronto necesitas el dinero?\n\n1️⃣ Muy urgente — esta semana o antes\n2️⃣ Algo urgente — en el próximo mes\n3️⃣ Sin prisa — cuando se pueda",
      "tOffsetMs": 24493
    },
    {
      "i": 8,
      "dir": "in",
      "text": "1",
      "tOffsetMs": 27014,
      "trace": {
        "stateBefore": "URGENCY",
        "stateAfter": "CP",
        "intent": "PROVIDE_DATA",
        "confidence": 1,
        "applied": true,
        "reason": null
      }
    },
    {
      "i": 9,
      "dir": "out",
      "text": "Entendido, nos movemos rápido 💪 ¿En qué código postal está la propiedad?",
      "tOffsetMs": 28673
    },
    {
      "i": 10,
      "dir": "in",
      "text": "27250",
      "tOffsetMs": 31399,
      "trace": {
        "stateBefore": "CP",
        "stateAfter": "COLONIA",
        "intent": "PROVIDE_DATA",
        "confidence": 0.9,
        "applied": true,
        "reason": null
      }
    },
    {
      "i": 11,
      "dir": "out",
      "text": "¡Gracias! CP 27250. ¿En qué colonia está la propiedad?\n\n1. Centro\n2. Zona Residencial\n3. Fraccionamiento\n4. Colonia Popular\n5. Otra",
      "tOffsetMs": 34600
    },
    {
      "i": 12,
      "dir": "in",
      "text": "3",
      "tOffsetMs": 37642,
      "trace": {
        "stateBefore": "COLONIA",
        "stateAfter": "PROPERTY_TYPE",
        "intent": "PROVIDE_DATA",
        "confidence": 1,
        "applied": true,
        "reason": null
      }
    },
    {
      "i": 13,
      "dir": "out",
      "text": "Anotado, Fraccionamiento. ¿Qué tipo de propiedad es: casa, departamento, terreno u otro?",
      "tOffsetMs": 39310
    },
    {
      "i": 14,
      "dir": "in",
      "text": "Casa",
      "tOffsetMs": 42099,
      "trace": {
        "stateBefore": "PROPERTY_TYPE",
        "stateAfter": "ESCRITURAS",
        "intent": "PROVIDE_DATA",
        "confidence": 1,
        "applied": true,
        "reason": null
      }
    },
    {
      "i": 15,
      "dir": "out",
      "text": "¿Tienes escrituras de la propiedad?\n\n✅ Sí tengo escrituras\n❌ No tengo escrituras\n🤔 No estoy seguro",
      "tOffsetMs": 44112
    },
    {
      "i": 16,
      "dir": "in",
      "text": "Sí tengo escrituras",
      "tOffsetMs": 46832,
      "trace": {
        "stateBefore": "ESCRITURAS",
        "stateAfter": "VALUE",
        "intent": "PROVIDE_DATA",
        "confidence": 1,
        "applied": true,
        "reason": null
      }
    },
    {
      "i": 17,
      "dir": "out",
      "text": "Perfecto, ya casi terminamos 💪 ¿Tienes idea del valor aprox. de tu propiedad en pesos?",
      "tOffsetMs": 48657
    },
    {
      "i": 18,
      "dir": "in",
      "text": "$12000000",
      "tOffsetMs": 51234,
      "trace": {
        "stateBefore": "VALUE",
        "stateAfter": "COMPLETED",
        "intent": "PROVIDE_DATA",
        "confidence": 1,
        "applied": true,
        "reason": null
      }
    },
    {
      "i": 19,
      "dir": "out",
      "text": "¡Listo, Diego! Ya tengo todo: casa en Fraccionamiento, valor aprox. de $12,000,000, con escrituras. El equipo de Fliphouse te contactará pronto — sin costo ni compromiso. Cualquier duda, aquí estaré 😊",
      "tOffsetMs": 53762
    }
  ],
  "replyLatencyMsMedian": 2052
};
