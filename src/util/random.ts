import { validateNotBlank, validateNotNull } from "./validation";

export class RandomSource {

    public createRandomString(characters: string, size: number): string {
        validateNotBlank(characters, "characters");
        validateNotNull(size, "size");

        const result: string[] = [];
        const charactersLength = characters.length;

        for (let i = 0; i < size; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }

        return result.join("");
    }

}