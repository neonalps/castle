import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { createHmac, randomBytes } from "crypto";

export interface CryptoConfig {
    algorithm: {
        hash: string;
    },
    joinChar: string;
    symmetricKey: string;
}

export class CryptoService {

    private static readonly HEX = "hex";

    private readonly hashAlgorithm: string;
    private readonly keyBuffer: Buffer;

    constructor(config: CryptoConfig) {
        validateNotNull(config, "config");
        validateNotBlank(config.algorithm.hash, "config.algorithm.hash");
        validateNotBlank(config.joinChar, "config.joinChar");
        validateNotBlank(config.symmetricKey, "config.symmetricKey");

        this.hashAlgorithm = config.algorithm.hash;
        this.keyBuffer = Buffer.from(config.symmetricKey, CryptoService.HEX);
    }

    public hash(input: string): string {
        validateNotBlank(input, "input");

        return createHmac(this.hashAlgorithm, this.keyBuffer).update(input).digest(CryptoService.HEX);
    }
}