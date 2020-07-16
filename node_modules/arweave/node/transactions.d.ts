/// <reference types="node" />
import Api from "./lib/api";
import CryptoInterface from "./lib/crypto/crypto-interface";
import Transaction from "./lib/transaction";
import { JWKInterface } from "./lib/wallet";
import { AxiosResponse } from "axios";
export interface TransactionConfirmedData {
    block_indep_hash: string;
    block_height: number;
    number_of_confirmations: number;
}
export interface TransactionStatusResponse {
    status: number;
    confirmed: TransactionConfirmedData | null;
}
export default class Transactions {
    private api;
    private crypto;
    constructor(api: Api, crypto: CryptoInterface);
    getTransactionAnchor(): Promise<string>;
    getPrice(byteSize: number, targetAddress?: string): Promise<string>;
    get(id: string): Promise<Transaction>;
    fromRaw(attributes: object): Transaction;
    search(tagName: string, tagValue: string): Promise<string[]>;
    getStatus(id: string): Promise<TransactionStatusResponse>;
    getData(id: string, options?: {
        decode?: boolean;
        string?: boolean;
    }): Promise<string | Uint8Array>;
    sign(transaction: Transaction, jwk: JWKInterface): Promise<void>;
    verify(transaction: Transaction): Promise<boolean>;
    post(transaction: Transaction | Buffer | string | object): Promise<AxiosResponse>;
}
