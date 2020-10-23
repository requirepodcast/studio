import socketServer from 'socket.io';
import { Server } from 'http';
import { protectedWebsocket } from '../utils/auth';
import RendererService from '../core/renderer';

export default (http: Server) => {
  const io = socketServer(http);

  io.use(protectedWebsocket);

  io.on('connection', socket => {
    socket.emit('status', {
      isRendering: RendererService.isRendering,
      currentRender: RendererService.currentRender ? RendererService.currentRender : undefined,
    });
  });

  RendererService.rendererEventEmitter.on('progress', e => {
    io.emit('progress', e);
  });

  RendererService.rendererEventEmitter.on('error', err => {
    io.emit('error', err);
  });

  RendererService.rendererEventEmitter.on('finish', e => {
    io.emit('finish', e);
  });

  RendererService.rendererEventEmitter.on('start', e => io.emit('start', e));
};
