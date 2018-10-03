import * as glob from 'glob';
import * as path from 'path';

import { config } from '../config';
import { BranchDictionary, TEST_RESULT_EXTENSION } from '../model';

export class FileHelper {
    public static getBranchDictionary(): BranchDictionary {
        const root = path.join('public', config.dataDir);
        let branchMap = this.readBranchDirectory(root);
        if (Object.keys(branchMap).length === 0) {
            branchMap = this.readBranchDirectory(path.join('public', 'example-data'));
        }

        return branchMap;
    }

    public static getTestResultFileNames(directory: string): string[] {
        return glob.sync(`*${TEST_RESULT_EXTENSION}`, {
            cwd: FileHelper.getBranchDirectoryFromProjectRoot(directory),
            nocase: true
        });
    }

    /* full path starting at project root, e.g. 'public/data/project' */
    public static getBranchDirectoryFromProjectRoot(branchDir: string) {
        if (this.isExampleData(branchDir)) {
            return path.join('public', 'example-data', branchDir);
        }
        return path.join('public', config.dataDir, branchDir);
    }

    public static getImageDirectoryForHtml(branchDir: string) {
        if (this.isExampleData(branchDir)) {
            return path.join('/', 'example-data', branchDir);
        }
        return path.join('/', config.dataDir, branchDir);
    }

    private static isExampleData(branchDir: string) {
        return branchDir === 'example-master' || branchDir.startsWith('example-features');
    }

    private static readBranchDirectory(rootDirectory: string) {
        const branchMap: BranchDictionary = {};
        const branchDirs = glob.sync(`**/*${TEST_RESULT_EXTENSION}`, { cwd: rootDirectory, nocase: true });
        branchDirs
            .map((filename) => path.dirname(filename))
            .filter(function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            })
            .forEach((dirname) => {
                // build branch name from the directory, filtering special characters
                const branchName = dirname.replace(/[^\d\w]/g, '-');
                branchMap[branchName] = dirname;
            });
        return branchMap;
    }
}
