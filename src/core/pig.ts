import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs-extra';
import sanitizeFilename from 'sanitize-filename';
import { wordWrapArray as wordWrap } from '../utils/wordWrap';

registerFont('public/assets/FiraCode.ttf', { family: 'FiraCode' });

const sanitize = (text: string) => sanitizeFilename(text);

export class PromotionalImageGenerator {
  episodeTitle: string;
  episodeDescription: string;
  outputDirectory: string;

  constructor(episodeTitle: string, episodeDescription: string) {
    this.episodeTitle = episodeTitle;
    this.episodeDescription = episodeDescription;
    this.outputDirectory = `./public/pig/${sanitize(this.episodeTitle)}`;

    !fs.existsSync(this.outputDirectory) && fs.mkdirSync(this.outputDirectory);
  }

  private async generateInstagram() {
    const canvas = createCanvas(1000, 1000);
    const ctx = canvas.getContext('2d');

    // Background
    const bg = await loadImage('public/assets/Background.png');
    const bgScale = Math.max(canvas.width / bg.width, canvas.height / bg.height);
    const bgX = canvas.width / 2 - (bg.width / 2) * bgScale;
    const bgY = canvas.height / 2 - (bg.height / 2) * bgScale;
    ctx.drawImage(bg, bgX, bgY, bg.width * bgScale, bg.height * bgScale);

    // Logo
    const logo = await loadImage('public/assets/RequireLogo.png');
    ctx.drawImage(logo, 100, 100, 350, 350);

    // "New episode" title
    ctx.font = '80px FiraCode';
    ctx.fillStyle = '#ff5370';
    ctx.fillText('Nowy\nodcinek!', 500, 250);

    // Episode title
    ctx.font = '65px FiraCode';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    const textLines = wordWrap(this.episodeTitle, 21);
    const titleHeight = 70 * textLines.length;
    const titleBase = 700 - titleHeight / 2;
    textLines.map((line, i) => {
      ctx.fillText(line, 500, titleBase + i * 70);
    });

    // Platforms note
    ctx.font = '30px FiraCode';
    ctx.fillStyle = '#ff5370';
    ctx.textAlign = 'left';
    ctx.fillText('Dostępny na dowolnej platformie streamingowej', 25, 900);

    // PLatforms icons
    const spotify = await loadImage('public/assets/SpotifyLogo.png');
    const apple = await loadImage('public/assets/ApplePodcastsLogo.png');
    const google = await loadImage('public/assets/GooglePodcastsLogo.png');
    const anchor = await loadImage('public/assets/AnchorLogo.png');
    const youtube = await loadImage('public/assets/YouTubeLogo.png');

    ctx.drawImage(spotify, 25, 925, 50, 50);
    ctx.drawImage(apple, 100, 925, 50, 50);
    ctx.drawImage(google, 175, 925, 50, 50);
    ctx.drawImage(anchor, 250, 925, 50, 50);
    ctx.drawImage(youtube, 325, 925, 50, 50);

    const stream = canvas.createPNGStream();
    const out = fs.createWriteStream(`${this.outputDirectory}/ig.png`);

    stream.pipe(out);

    return escape(`/static/pig/${sanitize(this.episodeTitle)}/ig.png`);
  }

  private async generateTwitter() {
    const canvas = createCanvas(1200, 675);
    const ctx = canvas.getContext('2d');

    // Background
    const bg = await loadImage('public/assets/Background.png');
    const bgScale = Math.max(canvas.width / bg.width, canvas.height / bg.height);
    const bgX = canvas.width / 2 - (bg.width / 2) * bgScale;
    const bgY = canvas.height / 2 - (bg.height / 2) * bgScale;
    ctx.drawImage(bg, bgX, bgY, bg.width * bgScale, bg.height * bgScale);

    // Logo
    const logo = await loadImage('public/assets/RequireLogo.png');
    ctx.drawImage(logo, 50, 100, 475, 475);

    // Title and description
    const titleLines = wordWrap(this.episodeTitle, 20);
    const titleHeight = titleLines.length * 60;

    const descriptionLines = wordWrap(this.episodeDescription, 39);
    const descriptionHeight = descriptionLines.length * 30;

    const textHeight = titleHeight + descriptionHeight + 50;
    const textBase = canvas.height / 2 - textHeight / 2;

    ctx.font = '50px FiraCode';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#ff5370';
    ctx.textAlign = 'left';
    titleLines.map((line, i) => {
      ctx.fillText(line, 575, textBase + i * 60);
    });

    ctx.font = '25px FiraCode';
    ctx.fillStyle = 'white';
    descriptionLines.map((line, i) => {
      ctx.fillText(line, 575, textBase + titleHeight + 50 + i * 30);
    });

    const stream = canvas.createPNGStream();
    const out = fs.createWriteStream(`${this.outputDirectory}/tw.png`);

    stream.pipe(out);

    return escape(`/static/pig/${sanitize(this.episodeTitle)}/tw.png`);
  }

  async generate() {
    const ig = await this.generateInstagram();
    const tw = await this.generateTwitter();
    fs.writeJsonSync(`${this.outputDirectory}/data.json`, {
      episodeTitle: this.episodeTitle,
      episodeDescription: this.episodeDescription,
      ig,
      tw,
    });
    return { ig, tw };
  }
}
