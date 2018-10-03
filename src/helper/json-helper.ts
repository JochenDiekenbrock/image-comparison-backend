import * as fs from 'fs';
import * as path from 'path';

import { TestResult } from '../model';
import { FileHelper } from './file-helper';

export class JsonHelper {
    public static async getTestResults(branchDir: string): Promise<TestResult[]> {
        const testResultFileNames = FileHelper.getTestResultFileNames(branchDir);

        const testResultDir = FileHelper.getBranchDirectoryFromProjectRoot(branchDir);

        return Promise.all(testResultFileNames.map((testResultFile) => {
            const testResultFileWithPath = path.join(testResultDir, testResultFile);

            return JsonHelper.getTestResult(testResultFileWithPath, branchDir);
        }));
    }

    public static async getTestResult(testResultFileWithPath: string, branchDir: string): Promise<TestResult> {
        const content = await fs.promises.readFile(testResultFileWithPath, { encoding: 'utf8' });
        const result: TestResult = JSON.parse(content);

        const imageDirectory = FileHelper.getImageDirectoryForHtml(branchDir);
        result.baselineImage = path.join(imageDirectory, result.baselineImage);
        result.actualImage = path.join(imageDirectory, result.actualImage);
        if (!result.success) {
            result.diffImage = result.diffImage ? path.join(imageDirectory, result.diffImage) : undefined;
        }
        result.date = new Date(result.date);

        return result;
    }
}
