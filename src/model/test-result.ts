export interface TestResult {
    name: string;
    result: boolean;
    baseFile: string;
    currentFile: {
        file: string;
        date: string;
    };
    diffFile?: string;
}
