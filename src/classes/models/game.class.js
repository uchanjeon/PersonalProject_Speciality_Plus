const MAX_PLAYERS = 2;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.state = 'waiting'; // 'waiting', 'inProgress'
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Game session is full');
    }
    this.users.push(user);

  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);

  }

  startGame() {
    this.state = 'inProgress';
  }

  getAllLocation() {
    const locationData = this.users.map((user) => {
      return { id: user.id, playerId: user.playerId, x: user.x, y: user.y };
    });
    return createLocationUpdatePacket(locationData);
  }

  getUserLocation(userId) {
    let locationData = [];
    this.users.forEach((user) => {
      if (user.id !== userId) {
        locationData.push({ id: user.id, playerId: user.playerId, x: user.x, y: user.y });
      }
    });
    return createLocationUpdatePacket(locationData);
  }
}

export default Game;
