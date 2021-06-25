import firebase from 'firebase/app';

// Para cada serviço que for utilizado, importar de forma separada
import 'firebase/auth';
import 'firebase/database';

// Credenciais após criado uma aplicação no firebase (site)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATEBASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSASING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

// Inicializa o firebase
firebase.initializeApp(firebaseConfig);

// Definição e exportação dos recursos p/ utilizar na aplicação
const auth = firebase.auth();
const database = firebase.database();

export { firebase, auth, database }