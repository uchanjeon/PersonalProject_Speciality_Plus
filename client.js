import net from 'net';
import { getProtoMessages, loadProtos } from './src/init/loadProtos.js';
import { gameSessions } from './src/session/sessions.js';
// import { addGameSession } from './src/session/game.session.js';

const TOTAL_LENGTH = 4; // 전체 길이를 나타내는 4바이트
const PACKET_TYPE_LENGTH = 1; // 패킷타입을 나타내는 1바이트

let userId;
let sequence;
const deviceId = '11111';

const createPacket = (handlerId, payload, clientVersion = '1.0.0', type, name) => {
  const protoMessages = getProtoMessages();
  const PayloadType = protoMessages[type][name];
  if (!PayloadType) {
    throw new Error('PayloadType을 찾을 수 없습니다.');
  }

  const payloadMessage = PayloadType.create(payload);
  const payloadBuffer = PayloadType.encode(payloadMessage).finish();

  return {
    handlerId,
    userId,
    clientVersion,
    sequence,
    payload: payloadBuffer,
  };
};

const sendPacket = (socket, packet) => {
  const protoMessages = getProtoMessages();

  const Packet = protoMessages.common.Packet;
  if (!Packet) {
    console.error('Packet 메시지를 찾을 수 없습니다.');
    return;
  }

  const buffer = Packet.encode(packet).finish();

  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(TOTAL_LENGTH);
  packetLength.writeUInt32BE(buffer.length + TOTAL_LENGTH + PACKET_TYPE_LENGTH, 0); // 패킷 길이에 타입 바이트 포함

  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(PACKET_TYPE_LENGTH);
  packetType.writeUInt8(1, 0); // NORMAL TYPE

  // 길이 정보와 메시지를 함께 전송
  const packetWithLength = Buffer.concat([packetLength, packetType, buffer]);

  socket.write(packetWithLength);
};

// 서버에 연결할 호스트와 포트
const HOST = 'localhost';
const PORT = 5555;

const client = new net.Socket();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

client.connect(PORT, HOST, async () => {
  console.log('Connected to server');
  await loadProtos();

  const successPacket = createPacket(0, { deviceId }, '1.0.0', 'initial', 'InitialPacket');

  await sendPacket(client, successPacket);
  await delay(500);

  const createGamePacket = createPacket(
    5,
    { timestamp: Date.now() },
    '1.0.0',
    'game',
    'JoinGamePayload',
  );

  await sendPacket(client, createGamePacket);
});

client.on('data', (data) => {
  // 1. 길이 정보 수신 (4바이트)
  const length = data.readUInt32BE(0);
  const totalHeaderLength = TOTAL_LENGTH + PACKET_TYPE_LENGTH;

  // 2. 패킷 타입 정보 수신 (1바이트)
  const packetType = data.readUInt8(4);
  const packet = data.slice(totalHeaderLength, length); // 패킷 데이터

  if (packetType === 1) {
    const protoMessages = getProtoMessages();
    const Response = protoMessages.response.Response;

    try {
      const response = Response.decode(packet);
      const responseData = JSON.parse(Buffer.from(response.data).toString());
      if (response.handlerId === 0) {
        userId = responseData.userId;
      }
      console.log(`client.js`, gameSessions);
      console.log('응답 데이터:', responseData);
      sequence = response.sequence;
    } catch (e) {
      console.log(e);
    }
  }
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('Client error:', err);
});

process.on('SIGINT', () => {
  client.end('클라이언트가 종료됩니다.', () => {
    process.exit(0);
  });
});
