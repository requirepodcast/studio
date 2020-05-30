import { EventEmitter } from 'events';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra';
import { wordWrapString as wordWrap } from '../utils/wordWrap';
import { encodeText } from '../utils/encodeText';
import { sendNotification } from '../utils/sendNotification';

const renderRatio = 0.93; // Based on my previous render, in the future automatically calculated from other renders

class RendererService {
  rendererEventEmitter: EventEmitter = new EventEmitter();
  isRendering: boolean = false;
  currentRender: object;

  startRendering(episodeTitle: string, audioFile: string, outputFile: string, user: any): string {
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

        const renderLog = `./public/renderer/${outputFile.replace('.mp4', '')}_render.log`;
        fs.removeSync(renderLog);

        const addToLog = (message: string) => fs.appendFile(renderLog, message);

        let lastProgress: number;

        const output = timeline
          .output(`./public/renderer/${outputFile}`)
          .on('codecData', data => {
            this.rendererEventEmitter.emit(
              'start',
              `${new Date()} | Started rendering file ${outputFile} \n`,
            );
            addToLog(`${new Date()} | Started rendering file ${outputFile} \n`);

            const duration = data.duration
              .split(':')
              .map((val: number, i: number) => val * Math.pow(60, 2 - i))
              .reduce((a: number, b: number) => a + b, 0);

            const est = {
              h: Math.floor((duration * renderRatio) / 3600),
              m: Math.floor(((duration * renderRatio) % 3600) / 60),
            };
            sendNotification({
              title: 'Renderowanie odcinka',
              description: `***Rozpoczęto renderowanie odcinka:***
              Tytuł: **${episodeTitle}**
              Plik audio: **${audioFile}**
              Plik wideo: **${outputFile}**
              Rozpoczęcie: **${new Date()}**
              Użytkownik: **${user.name}**
              Przewidywany czas renderowania: **${est.h} godzin ${est.m} minut**`,
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
              addToLog(
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
            addToLog(`${new Date()} | Rendering error ${err} \n`);
            sendNotification({
              title: 'Renderowanie odcinka',
              description: `***Błąd podczas renderowania odcinka:***
              Tytuł: **${episodeTitle}**
              Plik audio: **${audioFile}**`,
            });
          })
          .on('end', e => {
            this.isRendering = false;
            this.currentRender = undefined;
            this.rendererEventEmitter.emit('finish', `${new Date()} | Rendering finished! \n`);
            addToLog(`${new Date()} | Rendering finished! \n`);
            sendNotification({
              title: 'Renderowanie odcinka',
              description: `***Zakończono renderowanie odcinka:***
              Tytuł: **${episodeTitle}**
              Plik audio: **${audioFile}**
              Plik wideo: **${outputFile}**`,
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
