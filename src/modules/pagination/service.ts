import { IllegalStateError } from "@src/api/error/illegal-state-error";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { Base64Utils } from "@src/util/base64";
import { PaginationParams, PaginationQueryParams } from "./constants";

export class PaginationService {

    public getLastElement<T>(input: T[]): T {
        if (!input || input.length === 0) {
            throw new IllegalStateError("Unable to get last element of undefined or empty array");
        }

        return input[input.length - 1];
    }

    public decode<T extends PaginationParams<unknown>>(source: string): T {
        validateNotBlank(source, "source");

        const decoded = JSON.parse(Base64Utils.decode(source)) as T;
        this.validateNextPageKey(decoded);
        return decoded;
    }
    
    public encode(source: unknown): string {
        validateNotNull(source, "source");

        return Base64Utils.encode(JSON.stringify(source));
    }

    private validateNextPageKey(params: PaginationParams<unknown>) {
        if (!params.limit || !params.lastSeen) {
            throw new IllegalStateError("Invalid next page key passed");
        }
    }

}