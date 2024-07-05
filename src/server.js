import net from 'net';
import initServer from './init/index.js';
import { config } from './config/config.js';
import { onConnection } from './events/onConnection.js';
// import { addGameSession } from './session/game.session.js';

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(` [ 서버 : ${config.server.host} ] / 포트 : ${config.server.port} ]가 실행 중입니다.`);
      console.log(server.address());
      // addGameSession();
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
