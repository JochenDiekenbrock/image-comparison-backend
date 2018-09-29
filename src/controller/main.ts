import * as Router from 'koa-router';

import { FileHelper } from '../helper';

export class MainController {
    public static async home(ctx: Router.IRouterContext) {
        const dict = FileHelper.getBranchDictionary();
        const branchCount = Object.keys(dict).length;
        if (branchCount === 0) {
            await ctx.render('error', { text: 'No branch found!' });
        } else if (branchCount === 1) {
            await ctx.redirect('branch/' + Object.keys(dict)[0]);
        } else {
            await ctx.render('branchs', { branchDictionary: dict });
        }
    }
}
