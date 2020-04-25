import ffmpeg from 'fluent-ffmpeg';

const timeline = ffmpeg()
  .input('assets/animation.mp4')
  .input('assets/RequireLogo.png')
  .complexFilter([
    '[1:v]scale=600:600 [logo]',
    '[0][logo]overlay=180:240 [combined]',
    "[combined]drawtext=fontfile=assets/FiraCode.ttf:text='dupa':fontsize=80:fontcolor=white:x=w/2:y=(h-text_h)/2",
  ]);

const output = timeline.output('output/output.mp4');

output.run();
