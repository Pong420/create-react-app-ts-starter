export interface Param$GetLoginArrayBuffer {
  pid: string;
  username: string;
  password: string;
  isTry?: boolean;
}

export interface Param$LoginLoginServer extends Param$GetLoginArrayBuffer {}

export interface Response$LoginLoginServer {
  slotToken: string;
  userFlag: number | '';
}
