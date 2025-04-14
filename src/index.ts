import Platform
    from "./core/Platform";
import HomeFilter
    from "./core/services/home/HomeFilter";


(async function fetchHome() {
    const platform = new Platform('YOUR_API_URL', 'D1');

    const homeFilter = new HomeFilter()
        .byStore('11808')
        .byPlatform('WEB')
        .byScreenSize('large');


    const home = await platform.homeService.home(homeFilter);

})();

