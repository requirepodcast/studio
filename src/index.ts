import ffmpeg from 'fluent-ffmpeg';

const timeline = ffmpeg()
  .input('assets/animation.mp4')
  .input('assets/RequireLogo.png')
  .complexFilter('[1:v]scale=400:400 [logo]; [0][logo]overlay=0:0');
const output = timeline.output('output/output.mp4');

output.run();
