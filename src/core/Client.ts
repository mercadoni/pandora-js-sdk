import fetch
    from "isomorphic-unfetch";
import GraphqlClient
    from "./http/GraphqlClient";

class Client implements GraphqlClient {

    private readonly baseUrl: string;
    private token: string;
    private defaultHeaders: Record<string, string>;

    constructor(baseUrl: string, token: string = '') {
        this.baseUrl = baseUrl;
        this.token = token;
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
        const data = await this.fetch(body, this.defaultHeaders, 'POST');
        this.throwIfErrors(data);
        return data;
    }

    async mutation(gql: string, variables: Record<string, any>): Promise<Record<string, any>> {
        const body = JSON.stringify({ query: gql, variables });
        const data = await this.fetch(body, this.defaultHeaders, 'POST');
        this.throwIfErrors(data);
        return data;
    }

    async fetch(body: string, headers: Record<string, any>, method: string): Promise<Record<string, any>> {
        const response = await fetch(`${this.baseUrl}`, {
            method,
            headers,
            body
        }).catch((error: Error) => {
            throw new Error(`Network error: ${error.message}`);
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json().catch(() => {
            throw new Error('Failed to parse server response as JSON');
        });
    }

    private throwIfErrors(data: Record<string, any>): void {
        if (data.errors?.length) {
            const messages = data.errors.map((e: { message: string }) => e.message).join('; ');
            throw new Error(messages);
        }
    }
}

export default Client;