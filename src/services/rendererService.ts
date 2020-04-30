import { EventEmitter } from 'events';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs-extra';
import { wordWrap } from '../utils/wordWrap';

class RendererService {
  rendererEventEmitter: EventEmitter = new EventEmitter();
  isRendering: boolean = false;

  startRendering(episodeTitle: string): string {
    if (!this.isRendering) {
      if (fs.existsSync('./public/assets/linus_music.mp3')) {
        const timeline = ffmpeg('./public/assets/linus_music.mp3')
          .input('./public/assets/animation.mp4')
          .inputOption('-stream_loop -1')
          .input('./public/assets/RequireLogo.png')
          .inputOptions(['-r 25', '-stream_loop 75'])
          .complexFilter([
            '[2]scale=600:600, fade=in:50:25:alpha=1 [logo]',
            '[1][logo]overlay=180:240 [combined]',
            `[combined]drawtext=fontfile=FiraCode.ttf:text='${wordWrap(
              episodeTitle,
            )}':fontsize=80:fontcolor='#ff5370':x=840:y=(h-text_h)/2:alpha='if(lt(t,4),0,if(lt(t,5),t-4,1))'`,
          ])
          .outputOption('-shortest');

        const output = timeline
          .output('./public/output.mp4')
          .on('progress', e => {
            this.rendererEventEmitter.emit('progress', e);
            console.log(Math.floor(e.percent) + '%');
          })
          .on('finish', () => {
            this.isRendering = false;
            this.rendererEventEmitter.emit('finish');
          });

        this.isRendering = true;

        output.run();

        return 'Started rendering';
      }

      throw `Audio file isn't uploaded`;
    }

    throw 'Rendering process already started!';
  }
}

export default new RendererService();
