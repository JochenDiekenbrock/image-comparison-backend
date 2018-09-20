import * as Koa from 'koa';
import * as compress from 'koa-compress';
import * as logger from 'koa-logger';
import * as serve from 'koa-static';
import * as views from 'koa-views';
import * as nunjucks from 'nunjucks';
import * as path from 'path';

import {config} from './config';
import {routes} from './routes';

const app = new Koa();

app.on('error', (err) => {
    console.log(err);
});

app.use(logger());

const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.join(__dirname, '/views')),
);
// env.addFilter('shorten', function (str, count) {
//     return str.slice(0, count || 5)
// })
app.use(views(__dirname + '/views', {
    map: {html: 'nunjucks'}, extension: 'html', options: {
        nunjucksEnv: env,
    },

}));

app.use(routes);

app.use(serve(path.join(__dirname, '../public')));

// Compress
app.use(compress());

app.listen(config.port);

console.log(`Server running on port ${config.port}`);
