"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const CHUNK_SIZE = 256 * 1024;
const NOTE_SIZE = 32;
async function computeRootHash(data) {
    let taggedChunks = [];
    {
        let rest = data;
        let pos = 0;
        while (rest.byteLength >= CHUNK_SIZE) {
            let chunk = rest.slice(0, CHUNK_SIZE);
            let id = await common_1.default.crypto.hash(chunk);
            pos += chunk.byteLength;
            taggedChunks.push({ id, end: pos });
            rest = rest.slice(CHUNK_SIZE);
        }
        taggedChunks.push({
            id: await common_1.default.crypto.hash(rest),
            end: pos + rest.byteLength
        });
    }
    let nodes = await Promise.all(taggedChunks.map(({ id, end }) => hashLeaf(id, end)));
    while (nodes.length > 1) {
        let nextNodes = [];
        for (let i = 0; i < nodes.length; i += 2) {
            nextNodes.push(await hashBranch(nodes[i], nodes[i + 1]));
        }
        nodes = nextNodes;
    }
    const [{ id: rootHash }] = nodes;
    return rootHash;
}
exports.computeRootHash = computeRootHash;
async function hashBranch(left, right) {
    if (!right) {
        return left;
    }
    return {
        id: await hash([
            await hash(left.id),
            await hash(right.id),
            await hash(noteToBuffer(left.max))
        ]),
        max: right.max
    };
}
async function hashLeaf(data, note) {
    return {
        id: await hash([await hash(data), await hash(noteToBuffer(note))]),
        max: note
    };
}
async function hash(data) {
    if (Array.isArray(data)) {
        data = common_1.default.utils.concatBuffers(data);
    }
    return await common_1.default.crypto.hash(data);
}
function noteToBuffer(note) {
    const buffer = new Uint8Array(NOTE_SIZE);
    for (let i = NOTE_SIZE - 1; i > 0 && note > 0; i--, note = note >> 8) {
        buffer[i] = note;
    }
    return buffer;
}
//# sourceMappingURL=merkle.js.map