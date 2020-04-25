import ffmpeg from 'fluent-ffmpeg';
import { wordWrap } from './utils/wordWrap';

const episodeTitle = 'require(#6) - Ciągła Integracja';
const audioFile = 'assets/linus_music.mp3';

const timeline = ffmpeg(audioFile)
  .input('assets/animation.mp4')
  .inputOption('-stream_loop -1')
  .input('assets/RequireLogo.png')
  .complexFilter([
    '[2:v]scale=600:600 [logo]',
    '[1][logo]overlay=180:240 [combined]',
    `[combined]drawtext=fontfile=assets/FiraCode.ttf:text='${wordWrap(
      episodeTitle,
    )}':fontsize=80:fontcolor='#ff5370':x=840:y=(h-text_h)/2`,
  ])
  .outputOption('-shortest');

const output = timeline.output('output/output.mp4');

output.run();
