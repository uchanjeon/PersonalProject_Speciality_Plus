import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';

export const addUser = (socket, uuid, playerId, latency) => {
  const user = new User(socket, uuid, playerId, latency);
  userSessions.push(user);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserById = (id) => {
  console.log(userSessions);
  console.log('userSession',id);
  for (let i = 0; i < userSessions.length; i++) {
    if (userSessions[i].id === id) {
      return userSessions[i];
    }
  }
  return userSessions.find((user) => user.id === id);
};
