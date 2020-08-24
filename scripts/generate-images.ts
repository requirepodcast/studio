import { PromotionalImageGenerator } from '../src/core/pig';

const [title, description] = process.argv.slice(2);

const pig = new PromotionalImageGenerator(title, description);

pig.generate();
