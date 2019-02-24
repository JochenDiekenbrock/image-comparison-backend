import { TestResult } from 'image-comparison-frontend';
import { Context, Response } from 'koa';

import { AcceptHelper, FileHelper, JsonHelper } from '../helper';

export class BranchController {
    public static async branch(ctx: Context) {
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

    public static async accept(ctx: any) {
        const branchName = ctx.request.body.branchDir;
        const testName = ctx.request.body.name;
        const result = await AcceptHelper.acceptTest(branchName, testName);
        const response: Response = ctx.response;
        if (result.success) {
            response.status = 200;
        } else {
            response.status = 500;
            response.message = result.error;
        }
    }

    public static async delete(ctx: any) {
        const branchName = ctx.request.body.branchDir;
        const testName = ctx.request.body.name;
        const result = await FileHelper.deleteTest(branchName, testName);
        const response: Response = ctx.response;
        if (result.success) {
            response.status = 200;
        } else {
            response.status = 500;
            response.message = result.error;
        }
    }
}
