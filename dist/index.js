"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const timeline = fluent_ffmpeg_1.default()
    .input('assets/animation.mp4')
    .input('assets/RequireLogo.png')
    .complexFilter('[1:v]scale=100:100 [i1]; [0][i1]overlay=0:0');
const output = timeline.output('output/output.mp4');
output.run();
//# sourceMappingURL=index.js.map