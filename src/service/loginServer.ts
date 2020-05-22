import { MD5, LibWordArray } from 'crypto-js';
import {
  Param$GetLoginArrayBuffer,
  Param$LoginLoginServer,
  Response$LoginLoginServer,
} from '../typings';

function connectToServer() {
  return new Promise<WebSocket>((resolve, reject) => {
    const socket = new WebSocket(window.preference.WEB_SOCKET_URL);
    socket.binaryType = 'arraybuffer';

    const timeout = setTimeout(
      () => reject(new Error('connect to server timeout')),
      5000
    );

    socket.onerror = reject;

    socket.onopen = () => {
      clearTimeout(timeout);
      resolve(socket);
    };

    socket.onclose = () => {
      // eslint-disable-next-line
      console.log('Login server is closed');
    };
  });
}

function getLoginArrayBuffer({
  pid,
  isTry,
  username,
  password,
}: Param$GetLoginArrayBuffer) {
  const CMD_LOGIN_EGAME = 0x011013; // 電子遊戲登录请求 with password
  const CMD_LOGIN_EGAME_TRY = 0xc011013; // 電子遊戲(Try) 登录请求 with password

  const cmd = isTry ? CMD_LOGIN_EGAME_TRY : CMD_LOGIN_EGAME;

  const loginName = '' + pid + username;
  const hashcode: LibWordArray = MD5(loginName + 'baccarat' + password) as any;
  const data = new ArrayBuffer(0x3e);
  const view = new DataView(data);

  view.setUint32(0, cmd, false);
  view.setUint32(4, 0x3e, false);
  view.setUint32(8, 0, false);

  var iName;
  for (iName = 0; iName < loginName.length; ++iName) {
    view.setUint8(12 + iName, loginName.charCodeAt(iName));
  }
  while (iName < 30) {
    view.setUint8(12 + iName, 0);
    ++iName;
  }

  view.setUint32(42, hashcode.words[0], false);
  view.setUint32(46, hashcode.words[1], false);
  view.setUint32(50, hashcode.words[2], false);
  view.setUint32(54, hashcode.words[3], false);

  view.setUint32(58, 0, false);

  return data;
}

function analyseMsgData(message: MessageEvent, residue: ArrayBuffer | null) {
  let data;

  if (residue != null) {
    let newData = new ArrayBuffer(message.data.byteLength + residue.byteLength);
    data = new DataView(newData);

    let offset = 0;
    let bytes = new Uint8Array(residue);
    for (let i = 0; i < residue.byteLength; ++i) {
      data.setUint8(offset++, bytes[i]);
    }
    bytes = new Uint8Array(message.data);
    for (let i = 0; i < message.data.byteLength; ++i) {
      data.setUint8(offset++, bytes[i]);
    }

    residue = null;
  } else {
    data = new DataView(message.data);
  }

  return data;
}

function getHexToken(token: number[]): string {
  return token
    .map((tokenToken) => tokenToken.toString(16).padStart(8, '0'))
    .join('')
    .toUpperCase();
}

export async function loginToLoginServer(params: Param$LoginLoginServer) {
  const socket = await connectToServer();
  const result = await new Promise<Response$LoginLoginServer>(
    (resolve, reject) => {
      let residue: ArrayBuffer | null = null;

      socket.onmessage = (message) => {
        let cmd, size;
        let iCurrent = 0;
        const data = analyseMsgData(message, residue);
        let length = data.buffer.byteLength;

        // Skip the header [CMD, Size, Seq]
        while (length >= 12) {
          cmd = data.getUint32(iCurrent, false);
          size = data.getUint32(iCurrent + 4, false);
          // if (cmd > 1) console.log('onLoginMessage 0x' + cmd.toString(16));

          var retCode = 0;
          if (length < size) break;
          switch (cmd) {
            case 0x20001:
              retCode = data.getUint32(iCurrent + 12, false);
              // this.applyErrorCode(retCode);
              if (retCode === 0) {
                // eslint-disable-next-line
                console.log('Login server is connected!');

                const token = [
                  data.getUint32(iCurrent + 16, false),
                  data.getUint32(iCurrent + 20, false),
                  data.getUint32(iCurrent + 24, false),
                  data.getUint32(iCurrent + 28, false),
                ];

                //Skip server time (index + 8)
                //Skip something else (index + 4)

                const userType = data.getUint32(iCurrent + 40, false);
                let userTypeString = userType.toString(2);
                let i;
                const len = userTypeString.length;
                if (len < 4) {
                  for (i = 0; i < 4 - len; i++) {
                    userTypeString = '0' + userTypeString;
                  }
                }
                const userFlag = parseInt(
                  userTypeString[userTypeString.length - 1]
                );

                resolve({ slotToken: getHexToken(token), userFlag });
              } else {
                reject(new Error('Login server return error code: ' + retCode));
              }
              break;

            default:
              // eslint-disable-next-line
              console.log('[LoginServer] Unhandled cmd: 0x' + cmd.toString(16));
              break;
          }

          iCurrent += size;
          length -= size;
        }

        if (length) {
          residue = data.buffer.slice(iCurrent);
        }
      };

      socket.onerror = reject;

      socket.send(getLoginArrayBuffer(params));
    }
  );

  socket.close();

  return result;
}
