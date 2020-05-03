import socketServer from 'socket.io';
import { Server } from 'http';
import { protectedWebsocket } from '../utils/auth';
import RendererService from './rendererService';

export default (http: Server) => {
  const io = socketServer(http);

  io.use(protectedWebsocket);

  io.on('connection', () => {
    RendererService.rendererEventEmitter.on('progress', e => {
      io.emit('progress', e);
    });

    RendererService.rendererEventEmitter.on('error', err => {
      io.emit('error', err);
    });

    RendererService.rendererEventEmitter.on('finish', err => {
      io.emit('finish', err);
    });
  });
};
