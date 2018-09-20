import * as koaBody from 'koa-body';
import * as Router from 'koa-router';

import controller = require('./controller');

const router = new Router();

router.get('/', controller.MainController.home);
router.get('/branch/:name', controller.BranchController.branch);
router.post('/api/accept', koaBody({multipart: true}), controller.BranchController.accept);

export const routes = router.routes();
