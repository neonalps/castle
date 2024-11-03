import { randomUUID } from "crypto";

export class UuidSource {

    public getRandomUuid(): string {
        return randomUUID();
    }

}