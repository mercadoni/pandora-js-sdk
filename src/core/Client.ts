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
        const body = JSON.stringify({
            query: gql,
            variables: variables
        });
        return this.fetch(body, this.defaultHeaders, 'POST');
    }

    async mutation(gql: string, variables: Record<string, any>): Promise<Record<string, any>> {
        const body = JSON.stringify({
            query: gql,
            variables: variables
        });
        return this.fetch(body, this.defaultHeaders, 'POST');
    }


    async fetch(body: string, headers: Record<string, any>, method: string): Promise<Record<string, any>> {
        return fetch(`${this.baseUrl}`, {
            method: method,
            headers: headers,
            body: body
        })
            .then((r) =>
                r.json())
            .catch((data) => {
                throw new Error(data.message);
            });

    }
}

export default Client;