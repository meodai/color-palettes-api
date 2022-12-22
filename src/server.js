import {
  allVendors, 
  getRandomPalette,
  getAllVendorsByKey,
} from './palettes.js';
import {URLSearchParams} from 'url';
import Koa from 'koa';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();

router.get('/', async (ctx, next) => {
  // ctx.router available
  ctx.body = 'Hello World';
  await next();
});

router.get('/random', async (ctx, next) => {
  // ctx.router available
  const currentPalette = getRandomPalette();
  console.log(currentPalette);
  ctx.body = currentPalette;
  await next();
});


router.get('/random/', async (ctx, next) => {
  // ctx.router available
  const currentPalette = getRandomPalette();
  if (ctx.query.size) {
    console.log(ctx.query.size);
  }
  ctx.body = currentPalette;
  await next();
});

router.get('/palette/:keyword', async (ctx, next) => {
  // ctx.router available
  const currentPalette = getAllVendorsByKey(ctx.params.keyword);
  console.log(currentPalette);
  
  if (currentPalette.length > 0) {
    ctx.body = currentPalette;
  } else {
    ctx.body = `No palette found for keyword ${ctx.params.keyword}`;
    ctx.status = 404;
  }

  await next();
});

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.on('error', async (err, ctx) => {
  console.log('server error', err, ctx)
});

app.listen(3000);