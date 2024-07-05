export const packetNames = {
  // 1
  common: {
    Packet: 'common.Packet',
  },
  // 0
  initial: {
    InitialPacket: 'initial.InitialPacket',
  },
  game: {
    // CreateGamePayload: 'game.CreateGamePayload',
    JoinGamePayload: 'game.JoinGamePayload',
    UpdateLocationPayload : 'game.UpdateLocationPayload',
  },
  response: {
    Response: 'response.Response',
  },
  gameNotification: {
    LocationUpdate: 'gameNotification.LocationUpdate',
  },
};
