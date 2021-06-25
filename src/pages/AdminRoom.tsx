import { useHistory, useParams } from 'react-router-dom'

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import logoImg from '../assets/images/logo.svg'
import '../styles/room.scss';
// import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { useRoom } from '../hooks/useRoom';

import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'


type RoomParams = {
  id: string;
}


export const AdminRoom = () => {

  // Parâmetros que essa rota vai receber (tipagem)
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const history = useHistory();

  // const { user } = useAuth();

  const { questions, title } = useRoom(roomId)

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  const handleEndRoom = async () => {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  const handleCheckQuestion = async (questionId: string, isAnswered: boolean) => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: !isAnswered,
    });

  }

  const handleHighlightQuestion = async (questionId: string, isHighlighted: boolean) => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: !isHighlighted,
    });
  }

  return (
    <div className="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              <button
                type="button"
                onClick={() => handleCheckQuestion(question.id, question.isAnswered)}
              >
                <img src={checkImg} alt="Marcar pergunta respondida" />
              </button>

              <button
                type="button"
                onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
              >
                <img src={answerImg} alt="Destaque a pergunta" />
              </button>

              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>

            </Question>))}
        </div>

      </main>

    </div >
  )
}