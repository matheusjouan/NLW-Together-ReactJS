import { Link, useHistory } from 'react-router-dom';


import { Button } from '../components/Button'

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';


export function NewRoom() {

  const { user } = useAuth();
  const history = useHistory();

  const [newRoom, setNewRoom] = useState('');

  const handleCreateRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    // Referência para uma collection no B.D não relacional
    // Dentro do B.D vou ter uma collection 'rooms'
    const roomRef = database.ref('rooms');

    // Salvando um registro (document) na collection 'rooms'
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorID: user?.id,
    })

    // Redirecionado para o id inserido do registro no B.D do firebase
    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Logo Letmeask" />

          <h2>Criar uma nova sala</h2>

          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nova sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />

            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>

        </div>
      </main>
    </div>
  )
}