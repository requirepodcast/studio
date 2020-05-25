import { EventEmitter } from 'events';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra';
import { wordWrap } from '../utils/wordWrap';
import { encodeText } from '../utils/encodeText';
import { sendNotification } from '../utils/sendNotification';

class RendererService {
  rendererEventEmitter: EventEmitter = new EventEmitter();
  isRendering: boolean = false;
  currentRender: object;

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
            `[combined]drawtext=fontfile=./public/assets/FiraCode.ttf:text='${encodeText(
              wordWrap(episodeTitle),
            )}':fontsize=80:fontcolor='#ff5370':x=840:y=(h-text_h)/2:alpha='if(lt(t,4),0,if(lt(t,5),t-4,1))'`,
          ])
          .outputOption('-shortest');

        const renderLog = `./public/output/${outputFile.replace('.mp4', '')}_render.log`;
        fs.removeSync(renderLog);

        let lastProgress: number;

        const output = timeline
          .output(`./public/output/${outputFile}`)
          .on('start', () => {
            this.rendererEventEmitter.emit(
              'start',
              `${new Date()} | Started rendering file ${outputFile} \n`,
            );
            fs.appendFile(renderLog, `${new Date()} | Started rendering file ${outputFile} \n`);
            sendNotification({
              title: 'Renderowanie odcinka',
              description: `Rozpoczęto renderowanie odcinka \`\`\`${episodeTitle}\`\`\``,
            });
          })
          .on('progress', e => {
            if (Math.floor(e.percent) !== lastProgress) {
              this.rendererEventEmitter.emit(
                'progress',
                `${new Date()} | Rendering progress ${Math.floor(e.percent)}% | Filesize ${
                  e.targetSize
                } \n`,
              );
              fs.appendFile(
                renderLog,
                `${new Date()} | Rendering progress ${Math.floor(e.percent)}% | Filesize ${
                  e.targetSize
                } \n`,
              );
              lastProgress = Math.floor(e.percent);
            }
          })
          .on('error', err => {
            this.isRendering = false;
            this.currentRender = undefined;
            this.rendererEventEmitter.emit('error', `${new Date()} | Rendering error ${err} \n`);
            fs.appendFile(renderLog, `${new Date()} | Rendering error ${err} \n`);
            sendNotification({
              title: 'Renderowanie odcinka',
              description: `Błąd podczas renderowania odcinka \`\`\`${episodeTitle}\`\`\``,
            });
          })
          .on('end', e => {
            this.isRendering = false;
            this.currentRender = undefined;
            this.rendererEventEmitter.emit('finish', `${new Date()} | Rendering finished! \n`);
            fs.appendFile(renderLog, `${new Date()} | Rendering finished! \n`);
            sendNotification({
              title: 'Renderowanie odcinka',
              description: `Zakończono renderowanie odcinka \`\`\`${episodeTitle}\`\`\``,
            });
          });

        this.isRendering = true;
        this.currentRender = {
          renderLog,
          audioFile,
          outputFile,
          episodeTitle,
        };

        output.run();

        return 'Started rendering';
      }

      throw `Audio file isn't uploaded`;
    }

    throw 'Rendering process already started!';
  }
}

export default new RendererService();
