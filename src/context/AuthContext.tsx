import { createContext, ReactNode, useEffect, useState } from 'react';
import { firebase, auth } from '../services/firebase';


type AuthContextData = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

type User = {
  id: string;
  name: string;
  avatar: string;
}

export const AuthContext = createContext({} as AuthContextData);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {


  const [user, setUser] = useState<User>();

  useEffect(() => {
    // Event Listener que verifica se um usuário já logou anteriormente
    // Caso ele fecha a aba e volte ou de um F5, já traz as info do usuário pq ele estava logado anteriormente
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        })
      }
    })

    // Todos Event Listener no useEffect() deve ser desativado no final
    // Retira todo Event Listener após a execução, para não ficar escutando
    return () => {
      unsubscribe();
    }
  }, []);

  const signInWithGoogle = async () => {

    // Defino o provedor de serviço a ser autenticado na aplicação
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider)

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account')
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}