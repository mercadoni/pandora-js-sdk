import Filter from '../../models/Filter';

class RefreshTokensFilter extends Filter {
    constructor(config: {
        refreshToken: string;
    }) {
        super();
        this.query['refreshToken'] = config.refreshToken;
    }
}

export default RefreshTokensFilter;
