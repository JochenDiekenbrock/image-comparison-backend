import * as glob from 'glob';
import * as path from 'path';

import {config} from '../config';
import {BranchDictionary} from '../model';

export class FileHelper {
    public static getBranchDictionary(): BranchDictionary {
        const root = `public${path.sep}${config.dataDir}`;
        const branchMap: BranchDictionary = {};
        const branchDirs = glob.sync('**/*.xml', {cwd: root, nocase: true});
        branchDirs
            .map((filename) => path.dirname(filename))
            .filter(function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            })
            .forEach((dirname) => {
                const branchName = dirname.substring(dirname.lastIndexOf(path.sep) + 1);
                branchMap[branchName] = dirname;
            })
        ;

        return branchMap;
    }

    public static getXmlFileNames(directory: string): string[] {
        return glob.sync('*.xml', {cwd: FileHelper.getBranchDirectoryFromProjectRoot(directory), nocase: true});
    }

    /* full path starting at project root, e.g. 'public/data/project' */
    public static getBranchDirectoryFromProjectRoot(branchDir: string) {
        return `public${path.sep}${config.dataDir}${path.sep}${branchDir}`;
    }

    public static getImageDirectoryForHtml(branchDir: string) {
        return `/${config.dataDir}${path.sep}${branchDir}${path.sep}images`;
    }
}
