import app from './app';  // Importar la aplicación desde app.ts

const PORT = process.env.PORT || 3010; // Asegúrate de que el puerto coincida con el de app.ts

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
