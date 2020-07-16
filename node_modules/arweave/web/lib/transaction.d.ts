declare class BaseObject {
    [key: string]: any;
    get(field: string): string;
    get(field: string, options: {
        decode: true;
        string: false;
    }): Uint8Array;
    get(field: string, options: {
        decode: true;
        string: true;
    }): string;
}
export declare class Tag extends BaseObject {
    readonly name: string;
    readonly value: string;
    constructor(name: string, value: string, decode?: boolean);
}
export interface TransactionInterface {
    format: number;
    id: string;
    last_tx: string;
    owner: string;
    tags: Tag[];
    target: string;
    quantity: string;
    data: string;
    reward: string;
    signature: string;
    data_size: string;
    data_root: string;
    data_tree: string[];
}
export default class Transaction extends BaseObject implements TransactionInterface {
    readonly format: number;
    id: string;
    readonly last_tx: string;
    readonly owner: string;
    readonly tags: Tag[];
    readonly target: string;
    readonly quantity: string;
    readonly data: string;
    readonly data_size: string;
    readonly data_root: string;
    readonly data_tree: string[];
    readonly reward: string;
    signature: string;
    constructor(attributes?: Partial<TransactionInterface>);
    addTag(name: string, value: string): void;
    toJSON(): {
        format: number;
        id: string;
        last_tx: string;
        owner: string;
        tags: Tag[];
        target: string;
        quantity: string;
        data: string;
        data_size: string;
        data_root: string;
        data_tree: string[];
        reward: string;
        signature: string;
    };
    setSignature({ signature, id }: {
        signature: string;
        id: string;
    }): void;
    getSignatureData(): Promise<Uint8Array>;
}
export {};
