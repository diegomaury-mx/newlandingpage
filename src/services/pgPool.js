// Stub de pgPool para evitar error en shutdown
// Puedes reemplazar este archivo con la implementación real si es necesario

module.exports = {
  end: async () => {
    // No-op
    return Promise.resolve();
  }
};
