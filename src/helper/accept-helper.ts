import * as fs from 'fs';
import { TEST_RESULT_EXTENSION, TestResult } from 'image-comparison-frontend';
import * as path from 'path';

import { RequestProcessingResult } from '../model';
import { FileHelper } from './file-helper';
import { JsonHelper } from './json-helper';

export class AcceptHelper {
    public static async acceptTest(branchName: string, testFileName: string): Promise<RequestProcessingResult> {
        const dict = FileHelper.getBranchDictionary();

        const testResultDir = FileHelper.getBranchDirectoryFromProjectRoot(dict[branchName]);

        const testResultFileWithPath = path.join(testResultDir, `${testFileName}${TEST_RESULT_EXTENSION}`);

        let result = await AcceptHelper.saveSuccess(testResultFileWithPath);
        if (!result.success) {
            return result;
        }

        const testResult: TestResult = await JsonHelper.getTestResult(testResultFileWithPath, dict[branchName]);
        result = await AcceptHelper.copyNewImageToBase(testResult);
        if (!result.success) {
            return result;
        }

        return { success: true };
    }

    private static async copyNewImageToBase(testResult: TestResult): Promise<RequestProcessingResult> {
        try {
            await fs.promises.copyFile(
                path.join('public', testResult.actualImage),
                path.join('public', testResult.baselineImage)
            );
        } catch (err) {
            return AcceptHelper.fail(String(err));
        }
        return { success: true };
    }

    private static async saveSuccess(testResultFileWithPath: string): Promise<RequestProcessingResult> {
        try {
            const content = await fs.promises.readFile(testResultFileWithPath, { encoding: 'utf8' });
            const testResult: TestResult = JSON.parse(content);

            testResult.success = true;

            await fs.promises.writeFile(testResultFileWithPath, JSON.stringify(testResult, undefined, 4), 'utf8');
        } catch (err) {
            return AcceptHelper.fail(String(err));
        }

        return { success: true };
    }

    private static fail(error: string): RequestProcessingResult {
        console.log({ error });
        return { success: false, error };
    }
}
