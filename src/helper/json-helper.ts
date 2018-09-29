import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';

import { TestResult, XmlTestResult } from '../model';
import { FileHelper } from './file-helper';

export class JsonHelper {
    public static async getTestResults(branchDir: string): Promise<TestResult[]> {
        const xmls = FileHelper.getXmlFileNames(branchDir);

        const xmlFileDir = FileHelper.getBranchDirectoryFromProjectRoot(branchDir);

        return Promise.all(
            xmls.map((xmlFile) => {
                const xmlFileWithPath = path.join(xmlFileDir, xmlFile);

                return JsonHelper.getTestResult(xmlFileWithPath, branchDir);
            })
        );
    }

    public static async getTestResult(xmlFileWithPath: string, branchDir: string): Promise<TestResult> {
        const xml = fs.readFileSync(xmlFileWithPath, { encoding: 'UTF-8' });
        return new Promise((resolve: (result: TestResult) => void, reject) =>
            new xml2js.Parser().parseString(xml, (err: any, json: XmlTestResult) => {
                if (err) {
                    reject(err);
                } else {
                    const vrTest = json.VisualRegressionTest;
                    const screenShot = vrTest.ScreenShot[0];
                    const imageDirectory = FileHelper.getImageDirectoryForHtml(branchDir);
                    const baseFile = path.join(imageDirectory, JsonHelper.getFileInfo(screenShot.BaseFile[0]).filename);
                    const currentFileInfo = JsonHelper.getFileInfo(screenShot.CurrFile[0]);
                    const currentFile = path.join(imageDirectory, currentFileInfo.filename);
                    const isSuccessful = vrTest.$.result === 'true';
                    let diffFile;
                    if (!isSuccessful) {
                        diffFile = screenShot.DiffFile
                            ? path.join(imageDirectory, JsonHelper.getFileInfo(screenShot.DiffFile[0]).filename)
                            : undefined;
                    }
                    const result = {
                        baseFile,
                        currentFile: { file: currentFile, date: currentFileInfo.time },
                        diffFile,
                        name: vrTest.$.name,
                        result: isSuccessful
                    };
                    resolve(result);
                }
            })
        );
    }

    private static getFileInfo(file: any): { filename: string; time?: string } {
        if (typeof file === 'string') {
            return { filename: file };
        }
        return { filename: file._, time: file.$ ? file.$.time : undefined };
    }
}
