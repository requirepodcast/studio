import { EventEmitter } from 'events';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra';
import { wordWrap } from '../utils/wordWrap';
import { encodeText } from '../utils/encodeText';

class RendererService {
  rendererEventEmitter: EventEmitter = new EventEmitter();
  isRendering: boolean = false;

  startRendering(episodeTitle: string, audioFile: string, outputFile: string): string {
    if (!this.isRendering) {
      if (fs.existsSync(`./public/uploads/${audioFile}`)) {
        const timeline = ffmpeg(`./public/uploads/${audioFile}`)
          .input('./public/assets/animation.mp4')
          .inputOption('-stream_loop -1')
          .input('./public/assets/RequireLogo.png')
          .inputOptions(['-r 25', '-stream_loop 75'])
          .complexFilter([
            '[2]scale=600:600, fade=in:50:25:alpha=1 [logo]',
            '[1][logo]overlay=180:240 [combined]',
            `[combined]drawtext=fontfile=FiraCode.ttf:text='${encodeText(
              wordWrap(episodeTitle),
            )}':fontsize=80:fontcolor='#ff5370':x=840:y=(h-text_h)/2:alpha='if(lt(t,4),0,if(lt(t,5),t-4,1))'`,
          ])
          .outputOption('-shortest');

        const output = timeline
          .output(`./public/output/${outputFile}`)
          .on('start', () =>
            fs.appendFile(
              './public/output/render.log',
              `${new Date()} | Started rendering file ${outputFile}`,
            ),
          )
          .on('progress', e => {
            fs.appendFile(
              './public/output/render.log',
              `${new Date()} | Rendering progress ${Math.floor(e.percent)}% | Filesize ${
                e.targetSize
              }`,
            );
            this.rendererEventEmitter.emit('progress', e);
          })
          .on('error', err => {
            this.isRendering = false;
            this.rendererEventEmitter.emit('error', err);
            fs.appendFile('./public/output/render.log', `${new Date()} | Rendering error ${err}`);
          })
          .on('finish', e => {
            this.isRendering = false;
            this.rendererEventEmitter.emit('finish');
            fs.appendFile('./public/output/render.log', `${new Date()} | Rendering finished!`);
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
