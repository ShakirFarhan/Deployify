import { Server } from 'socket.io';
import { sub } from './redis.service';

class SocketService {
  private _io: Server;
  constructor() {
    this._io = new Server({
      cors: {
        origin: '*',
      },
    });
    sub.psubscribe('LOGS:*');
  }
  get io() {
    return this._io;
  }
  public initListeners() {
    let io = this.io;
    io.on('connection', (socket) => {
      socket.on('subscribe', (channel) => {
        socket.join(channel);
        socket.emit('message', `Joined ${channel}`);
      });

      sub.on('pmessage', (pattern, channel, message) => {
        io.to(channel).emit('message', JSON.parse(message));
      });
    });
    io.listen(8765);
  }
}

export default SocketService;
