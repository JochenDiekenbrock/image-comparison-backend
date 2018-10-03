/*
    maps the normalized branch name (for example example-features-feature1)
    to the branch directory (for example example-features/feature1)
*/
export interface BranchDictionary {
    [branch: string]: string;
}
