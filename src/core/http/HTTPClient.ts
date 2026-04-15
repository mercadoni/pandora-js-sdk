interface HTTPClient {

    fetch(body: string): Promise<Record<string, any>>
}

export default HTTPClient;