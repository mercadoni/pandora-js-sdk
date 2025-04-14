interface HTTPClient {

    fetch(body: string, headers: Record<string, any>, method: string): Promise<Record<string, any>>
}

export default HTTPClient;