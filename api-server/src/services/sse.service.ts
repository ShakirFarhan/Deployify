import { Response } from 'express';
class SentEventService {
  public static start(res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  }
  public static sendLogToClient(res: Response, log: string) {
    res.write('data: ' + `${log}\n\n`);
  }
}

export default SentEventService;
