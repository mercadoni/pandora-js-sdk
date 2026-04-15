import fetch
    from "isomorphic-unfetch";
import GraphqlClient
    from "./http/GraphqlClient";
import Logger
    from "./http/Logger";

class Client implements GraphqlClient {

    private readonly baseUrl: string;
    private token: string;
    private defaultHeaders: Record<string, string>;
    private readonly debug: boolean;
    private readonly logger: Logger;

    constructor(baseUrl: string, token: string = '', debug: boolean = false, logger: Logger = console) {
        this.baseUrl = baseUrl;
        this.token = token;
        this.debug = debug;
        this.logger = logger;
        this.defaultHeaders = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "token": token
        }
    }

    setToken(token: string): void {
        this.token = token;
        this.defaultHeaders["token"] = token;
    }

    async query(gql: string, variables: Record<string, any>): Promise<Record<string, any>> {
        const body = JSON.stringify({ query: gql, variables });
        this.log('[SDK] query →', { url: this.baseUrl, variables, query: gql });
        const data = await this.fetch(body);
        this.throwIfErrors(data);
        return data;
    }

    async mutation(gql: string, variables: Record<string, any>): Promise<Record<string, any>> {
        const body = JSON.stringify({ query: gql, variables });
        this.log('[SDK] mutation →', { url: this.baseUrl, variables, query: gql });
        const data = await this.fetch(body);
        this.throwIfErrors(data);
        return data;
    }

    async fetch(body: string): Promise<Record<string, any>> {
        const response = await fetch(`${this.baseUrl}`, {
            method: 'POST',
            headers: this.defaultHeaders,
            body
        }).catch((error: Error) => {
            this.logError('[SDK] network error', error.message);
            throw new Error(`Network error: ${error.message}`);
        });

        if (!response.ok) {
            this.logError('[SDK] HTTP error', `${response.status} ${response.statusText}`);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json().catch(() => {
            this.logError('[SDK] failed to parse response as JSON');
            throw new Error('Failed to parse server response as JSON');
        });

        this.log('[SDK] response ←', { status: response.status, data });
        return data;
    }

    private throwIfErrors(data: Record<string, any>): void {
        if (data.errors?.length) {
            const messages = data.errors.map((e: { message: string }) => e.message).join('; ');
            this.logError('[SDK] GraphQL errors', messages);
            throw new Error(messages);
        }
    }

    private log(label: string, data?: any): void {
        if (this.debug) this.logger.log(label, data !== undefined ? JSON.stringify(data, null, 2) : '');
    }

    private logError(label: string, data?: any): void {
        if (this.debug) this.logger.error(label, data !== undefined ? JSON.stringify(data, null, 2) : '');
    }
}

export default Client;