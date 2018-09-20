import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';

import {TestResult, XmlTestResult} from '../model';
import {FileHelper} from './file-helper';

export class JsonHelper {
    public static async getTestResults(branch: string): Promise<TestResult[]> {
        const branchDictionary = FileHelper.getBranchDictionary();
        const branchDir = branchDictionary[branch];
        const xmls = FileHelper.getXmlFileNames(branchDir);

        const xmlFileDir = FileHelper.getBranchDirectoryFromProjectRoot(branchDir);

        return Promise.all(xmls.map((xmlFile) => {
            const xmlFileWithPath = xmlFileDir + path.sep + xmlFile;
            return JsonHelper.getTestResult(xmlFileWithPath, branchDir);
        }));
    }

    public static async getTestResult(xmlFileWithPath: string, branchDir: string): Promise<TestResult> {
        const xml = fs.readFileSync(xmlFileWithPath, {encoding: 'UTF-8'});
        return new Promise(
            (resolve: (result: TestResult) => void, reject) =>
                new xml2js.Parser().parseString(xml, (err: any, json: XmlTestResult) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        const vrTest = json.VisualRegressionTest;
                        const screenShot = vrTest.ScreenShot[0];
                        const imageDirectory = FileHelper.getImageDirectoryForHtml(branchDir) + path.sep;
                        const baseFile = `${imageDirectory}${screenShot.BaseFile[0]}`;
                        const currentFile = `${imageDirectory}${screenShot.CurrFile[0]._}`;
                        const diffFile = screenShot.DiffFile ? `${imageDirectory}${screenShot.DiffFile[0]}` : undefined;
                        const result = {
                            baseFile,
                            currentFile: {file: currentFile, date: screenShot.CurrFile[0].$.time},
                            diffFile,
                            name: vrTest.$.name,
                            result: vrTest.$.result === 'true',
                        };
                        resolve(result);
                    }
                }));
    }
}
