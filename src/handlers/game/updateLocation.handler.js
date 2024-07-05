import { getGameSession } from "../../session/game.session.js";
import CustomError from "../../utils/error/customError.js";
import { handleError } from '../../utils/error/errorHandler.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';


const updateLocationHandler = async ({ socket, userId, payload }) => {
  try {
    const { x, y } = payload;
    const gameSession = getGameSession();

    
    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    user.updatePosition(x, y);

    const packet = gameSession.getUserLocation(userId);

    socket.write(packet);
  } catch (error) {
    handleError(socket, error);
  }
};

export default updateLocationHandler;
