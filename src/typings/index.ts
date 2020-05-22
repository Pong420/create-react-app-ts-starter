// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
export type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

export type AllowedNames<Base, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base];

export type SubType<Base, Condition> = Pick<
  Base,
  AllowedNames<Base, Condition>
>;

export type ValueOf<T> = T[keyof T];

export * from './loginServer';

export interface Schema$Params {
  gameid: string;
  env: string;
  dimension: string;
  lockRatio: string;
  // pid: string;
  // username: string;
  // slotToken: string;
  // userFlag: string;
  lang: string;
  disableBetTimeout: string;
  runOnBlur: string;
  disableFullscreen: string;
  skipQA: string;
  hideFPS: string;
  disableHomeBtn: string;
  lobbyUrl: string;
  canvas: string;
}
