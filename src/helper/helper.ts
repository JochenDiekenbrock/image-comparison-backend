import { RequestProcessingResult } from '../model';

export class Helper {
    public static fail(error: string): RequestProcessingResult {
        console.log({ error });
        return { success: false, error };
    }
}
