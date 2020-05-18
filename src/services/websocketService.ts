import socketServer from 'socket.io';
import { Server } from 'http';
import { protectedWebsocket } from '../utils/auth';
import RendererService from './rendererService';

export default (http: Server) => {
  const io = socketServer(http);

  io.use(protectedWebsocket);

  io.on('connection', socket => {
    socket.emit('status', { isRendering: RendererService.isRendering });

    RendererService.rendererEventEmitter.on('progress', e => {
      io.emit(
        'progress',
        `${new Date()} | Rendering progress ${Math.floor(e.percent)}% | Filesize ${e.targetSize}`,
      );
    });

    RendererService.rendererEventEmitter.on('error', err => {
      io.emit('error', `${new Date()} | Rendering error ${err}`);
    });

    RendererService.rendererEventEmitter.on('finish', e => {
      io.emit('finish', `${new Date()} | Rendering finished!`);
    });
  });
};
