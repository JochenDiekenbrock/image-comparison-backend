import { FileHelper } from '../helper';
import { IRouterParamContext } from 'koa-router';
import { ParameterizedContext } from 'koa';

export class MainController {
    public static async home(ctx: IRouterParamContext & ParameterizedContext) {
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
