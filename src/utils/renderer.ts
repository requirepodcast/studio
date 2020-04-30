import ffmpeg from 'fluent-ffmpeg';
import { wordWrap } from './wordWrap';

const episodeTitle = 'require(#6) - Ciągła Integracja';
const audioFile = 'assets/linus_music.mp3';

const timeline = ffmpeg(audioFile)
  .input('animation.mp4')
  .inputOption('-stream_loop -1')
  .input('RequireLogo.png')
  .inputOptions(['-r 25', '-stream_loop 75'])
  .complexFilter([
    '[2]scale=600:600, fade=in:50:25:alpha=1 [logo]',
    '[1][logo]overlay=180:240 [combined]',
    `[combined]drawtext=fontfile=FiraCode.ttf:text='${wordWrap(
      episodeTitle,
    )}':fontsize=80:fontcolor='#ff5370':x=840:y=(h-text_h)/2:alpha='if(lt(t,4),0,if(lt(t,5),t-4,1))'`,
  ])
  .outputOption('-shortest');

const output = timeline.output('output/output.mp4');

output.run();
