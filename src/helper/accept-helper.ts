import * as fs from 'fs';
import { TEST_RESULT_EXTENSION, TestResult } from 'image-comparison-frontend';
import * as path from 'path';

import { RequestProcessingResult } from '../model';
import { FileHelper } from './file-helper';
import { Helper } from './helper';
import { JsonHelper } from './json-helper';

export class AcceptHelper {
    public static async acceptTest(branchName: string, testFileName: string): Promise<RequestProcessingResult> {
        const dict = FileHelper.getBranchDictionary();

        const testResultDir = FileHelper.getBranchDirectoryFromProjectRoot(dict[branchName]);

        const testResultFileWithPath = path.join(testResultDir, `${testFileName}${TEST_RESULT_EXTENSION}`);

        const result = await AcceptHelper.saveSuccess(testResultFileWithPath);
        if (!result.success) {
            return result;
        }

        const testResult: TestResult = await JsonHelper.getTestResult(testResultFileWithPath, dict[branchName]);
        try {
            return await FileHelper.copyNewImageToBase(testResult);
        } catch (err) {
            return Helper.fail(String(err));
        }
    }

    private static async saveSuccess(testResultFileWithPath: string): Promise<RequestProcessingResult> {
        try {
            const content = await fs.promises.readFile(testResultFileWithPath, { encoding: 'utf8' });
            const testResult: TestResult = JSON.parse(content);

            testResult.success = true;

            await fs.promises.writeFile(testResultFileWithPath, JSON.stringify(testResult, undefined, 4), 'utf8');
        } catch (err) {
            return Helper.fail(String(err));
        }

        return { success: true };
    }
}
