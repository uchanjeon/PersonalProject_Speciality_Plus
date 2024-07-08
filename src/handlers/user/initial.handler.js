import { addUser, getUserById } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { getGameSession } from '../../session/game.session.js';
import CustomError from './../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, playerId, latency } = payload;

    addUser( socket, deviceId, playerId, latency);

    // 입장하려는 게임 세션이 session.js > gameSessions에 존재하는지 확인
    const gameSession = getGameSession();
    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    };

    // 입장하려는 유저 정보가 session.js > userSessions에 존재하는지 확인
    const user = getUserById(deviceId);
    console.log(deviceId,`init`);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, ' 유저를 찾을 수 없습니다.');
    }

    // 입장하려는 유저 정보가 없다면 session.js > userSessions에 등록(addUser 함수로 등록함)
    const existUser = gameSession.getUser(user.id);
    if (!existUser) {
      gameSession.addUser(user);
    }

    // 유저 정보 응답 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: deviceId },
      deviceId,
    );

    // 소켓을 통해 클라이언트에게 응답 메시지 전송
    socket.write(initialResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default initialHandler;
