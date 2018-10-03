import * as fs from 'fs';
import * as path from 'path';

import { RequestProcessingResult, TestResult } from '../model';
import { FileHelper } from './file-helper';
import { JsonHelper } from './json-helper';

export class AcceptHelper {
    public static async acceptTest(branchName: string, testName: string): Promise<RequestProcessingResult> {
        const dict = FileHelper.getBranchDictionary();

        const xmlFileDir = FileHelper.getBranchDirectoryFromProjectRoot(dict[branchName]);

        const fileName = path.join(xmlFileDir, `${testName}.xml`);
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

    private static async copyNewImageToBase(fileName: string, branchDir: string): Promise<RequestProcessingResult> {
        const testResult: TestResult = await JsonHelper.getTestResult(fileName, branchDir);
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

    private static async setTestState(fileName: string): Promise<RequestProcessingResult> {
        try {
            let data: any = await fs.promises.readFile(fileName, { encoding: 'UTF8' });
            data = data.replace(/false/g, 'true');

            await fs.promises.writeFile(fileName, data, 'utf8');
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
