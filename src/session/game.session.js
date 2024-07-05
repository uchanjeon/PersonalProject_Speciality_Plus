import { gameSessions } from './sessions.js';
import Game from '../classes/models/game.class.js';

export const addGameSession = () => {
  const session = new Game(1);
  gameSessions.push(session);
  return session;
};

export const removeGameSession = () => {
  const index = gameSessions.findIndex((session) => session.id === 1);
  if (index !== -1) {
    return gameSessions.splice(index, 1)[0];
  }
};

export const getGameSession = () => {
  return gameSessions.find((session) => session.id === 1);
};

export const getAllGameSessions = () => {
  return gameSessions;
};

