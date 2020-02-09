import { TestResult } from 'image-comparison-frontend';
import { AcceptHelper, FileHelper, JsonHelper } from '../helper';
import { RequestProcessingResult } from '../model';
import { ParameterizedContext } from 'koa';
import { IRouterParamContext } from 'koa-router';

export class BranchController {
    public static async branch(ctx: IRouterParamContext & ParameterizedContext) {
        const branchName = ctx.params.name;
        const branchDictionary = FileHelper.getBranchDictionary();
        const branchDir = branchDictionary[branchName];
        if (!branchDir) {
            const response = ctx.response;
            response.status = 500;
            response.message = `Unknown branch ${branchName}`;
            return;
        }
        const results: TestResult[] = await JsonHelper.getTestResults(branchDir);
        await ctx.render('branch', { branchDir, branchName, testResults: results });
    }

    public static async accept(ctx: IRouterParamContext & ParameterizedContext) {
        await BranchController.handle(ctx, AcceptHelper.acceptTest);
    }

    public static async delete(ctx: IRouterParamContext & ParameterizedContext) {
        await BranchController.handle(ctx, FileHelper.deleteTest);
    }

    private static async handle(
        ctx: IRouterParamContext & ParameterizedContext,
        handler: (branchName: string, testName: string) => Promise<RequestProcessingResult>
    ) {
        const body = (ctx.request as any).body;
        const branchName = body.branchDir;
        const testName = body.name;
        const result = await handler(branchName, testName);
        const response = ctx.response;
        if (result.success) {
            response.status = 200;
        } else {
            response.status = 500;
            response.message = result.error;
        }
    }
}
