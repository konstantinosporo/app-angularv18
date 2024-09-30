// @types/server.d.ts
declare module 'server' {
  import { Express } from 'express';

  export function app(): Express;
}
