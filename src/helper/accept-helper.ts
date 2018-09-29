import * as fs from 'fs';
import * as path from 'path';

import { Result, TestResult } from '../model';
import { FileHelper } from './file-helper';
import { JsonHelper } from './json-helper';

export class AcceptHelper {
    public static async acceptTest(branchName: string, testName: string): Promise<Result> {
        const dict = FileHelper.getBranchDictionary();

        const xmlFileDir = FileHelper.getBranchDirectoryFromProjectRoot(dict[branchName]);

        const fileName = `${xmlFileDir}${path.sep}${testName}.xml`;
        let result = await AcceptHelper.setTestState(fileName);
        if (!result.success) {
            return result;
        }

        result = await AcceptHelper.copyNewImageToBase(fileName, dict[branchName]);
        if (!result.success) {
            return result;
        }

        return { success: true };
    }

    private static async copyNewImageToBase(fileName: string, branchDir: string): Promise<Result> {
        const testResult: TestResult = await JsonHelper.getTestResult(fileName, branchDir);
        try {
            await fs.promises.copyFile('public' + testResult.currentFile.file, 'public' + testResult.baseFile);
        } catch (err) {
            return AcceptHelper.fail(String(err));
        }
        return { success: true };
    }

    private static async setTestState(fileName: string): Promise<Result> {
        try {
            let data: any = await fs.promises.readFile(fileName, { encoding: 'UTF8' });
            data = data.replace(/false/g, 'true');

            await fs.promises.writeFile(fileName, data, 'utf8');
        } catch (err) {
            return AcceptHelper.fail(String(err));
        }

        return { success: true };
    }

    private static fail(error: string): Result {
        console.log({ error });
        return { success: false, error };
    }
}
