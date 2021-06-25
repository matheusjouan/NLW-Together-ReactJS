/**
 * Todas as funcionalidades (em comum) que vão estar disponível em uma sala 
 * para um usuário admin tanto para usuário comum
 */

import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  },
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likedId: string | undefined;
}

// Tipagem objeto => chave/valor
type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  },
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    // Pega a referência da collection passando o documento específico
    const roomRef = database.ref(`rooms/${roomId}`);

    // Event Listener => Fica ouvindo sempre a sala "roomRef" mudar, executa novamente (tempo real)
    /**
     * Existe 4 eventos
     *  - value: monitora todos valores e substitui todos valores (renderiza toda a lista)
     *  - child_added: caso uma nova informação for incluida, insere somente ela e não mexe toda em tela
     *  - child_removed: caso uma informação for removida
     *  - child_moved: caso informação for movida
     */
    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions = databaseRoom.questions as FirebaseQuestions;

      // Convertendo em um Array (Lista) - chave/valor
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likedId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      })

      setQuestions(parsedQuestions);
      setTitle(databaseRoom.title);
    })

    // Remove os events listeners
    return () => {
      roomRef.off('value');
    }
  }, [roomId, user?.id]);

  return { questions, title }
}