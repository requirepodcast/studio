import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sessionFileStore from 'session-file-store';
import passportInit from './utils/passport';

dotenv.config();

const app = express();
const FileStore = sessionFileStore(session);

app.set('view engine', 'pug');
app.set('views', './src/app/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: new FileStore({ path: './.sessions' }),
  }),
);
app.use(morgan('tiny'));
passportInit(app);

app.use('/static', express.static('public'));

import main from './routes/main.router';
import api from './routes/api.router';
import auth from './routes/auth.router';

app.use('/', main);
app.use('/api/v1', api);
app.use('/auth', auth);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on port ${port}`));
