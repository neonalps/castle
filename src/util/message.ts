import { TrieNode } from "@src/crdt/merkle";
import { isNotDefined } from "./common";

export function serializeMerkle(merkle: TrieNode): string {
    return JSON.stringify(merkle);
}

export function deserializeMerkle(merkle?: string | null): TrieNode {
    if (isNotDefined(merkle)) {
        return {};
    }

    try {
        return JSON.parse(merkle as string);
    } catch (ex) {
        return {};
    }
}