/* RENUEVA DECO — Conexión a Firebase (base de datos de reseñas)

   Cómo activarlo (una sola vez, ~5 minutos):
   1. Ve a https://console.firebase.google.com y crea un proyecto gratuito
      (puedes usar tu cuenta de Gmail renueva.deco.carpinteria@gmail.com).
   2. En el menú lateral entra a "Firestore Database" > "Crear base de datos"
      > elige cualquier región cercana > modo "Producción".
   3. En la pestaña "Reglas" de Firestore, pega el contenido del archivo
      firestore.rules.txt que dejé en la raíz del proyecto, y publica.
   4. En "Configuración del proyecto" (ícono de engranaje) > "Tus apps" >
      icono </> (Web) > registra una app (el nombre no importa).
      Firebase te mostrará un objeto "firebaseConfig" — cópialo completo.
   5. Reemplaza el objeto de abajo por el que te dio Firebase, o pégamelo
      a mí y yo lo dejo activado.
*/
const firebaseConfig = {
  apiKey: "AIzaSyCoQp6kFaGF1NXxVI9-fPvMJK_6nC30dQc",
  authDomain: "renueva-deco.firebaseapp.com",
  projectId: "renueva-deco",
  storageBucket: "renueva-deco.firebasestorage.app",
  messagingSenderId: "1061269046201",
  appId: "1:1061269046201:web:e28a8bf54629ab73caec68"
};

if (firebaseConfig.apiKey !== "REEMPLAZA_CON_TU_API_KEY" && window.firebase) {
  firebase.initializeApp(firebaseConfig);
}
