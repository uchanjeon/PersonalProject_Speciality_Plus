// 서버 초기화 작업
import { loadGameAssets } from './assets.js';
import { loadProtos } from './loadProtos.js';
// import { addGameSession } from '../session/game.session.js';

const initServer = async () => {
  try {
    await loadGameAssets();
    await loadProtos();
    // await addGameSession();
    // 다음 작업
  } catch (e) {
    console.error(e);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;
