import Platform
    from "./core/Platform";
import HomeFilter
    from "./core/services/home/HomeFilter";

// Example : GetHome
(async function fetchHome() {

    const platform = new Platform({
        baseUrl: 'YOUR_API_URL',
        clientId: 'YOUR_CLIENT_ID'
    });

    const homeFilter = new HomeFilter({
        byStore: 'YOUR_STORE_ID',
        byPlatform: 'WEB',
        byScreenSize: 'large'
    })

    const home = await platform.homeService.home({filter: homeFilter});

})();

