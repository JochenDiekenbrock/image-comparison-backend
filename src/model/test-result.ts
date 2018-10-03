export interface TestResult {
    /* true, if the image comparison mismatch was below browser.protractorImageComparison.saveAboveTolerance */
    success: boolean;

    /* Date when the test was run */
    date: Date;

    testName: string;

    /* the testname as it is used to create image/testresult filenames */
    testFileName: string;

    /* the image that was created during this test run. Path is relativ to the current directory */
    actualImage: string;

    /* the baseline image that is the reference for the image comparison. Path is relativ to the current directory */
    baselineImage: string;

    /* if the test encountered a difference between baselintImage and actualImage, this image highlights the
       differences. Path is relativ to the current directory
       */
    diffImage?: string;
}

export const TEST_RESULT_EXTENSION = '.test-result.json';
