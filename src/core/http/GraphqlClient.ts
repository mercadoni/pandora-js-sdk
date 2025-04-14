import HTTPClient from "./HTTPClient";

interface GraphqlClient extends HTTPClient {

    query(gql: string, variables: Record<string, any>): Promise<Record<string, any>>;

    mutation(gql: string, variables: Record<string, any>): Promise<Record<string, any>>;

}

export default GraphqlClient;