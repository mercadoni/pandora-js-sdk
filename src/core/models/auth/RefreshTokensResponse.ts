class RefreshTokensResponse {
    token: string;
    refreshToken: string;

    constructor(config: {
        token: string;
        refreshToken: string;
    }) {
        this.token = config.token;
        this.refreshToken = config.refreshToken;
    }

    static fromJson(json: Record<string, any>): RefreshTokensResponse {
        return new RefreshTokensResponse({
            token: json.token || '',
            refreshToken: json.refreshToken || '',
        });
    }
}

export default RefreshTokensResponse;
