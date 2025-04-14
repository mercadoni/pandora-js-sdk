import HomeFilter from "./HomeFilter";
import Home from "../../models/home/Home";

interface HomeService {

    home(filter: HomeFilter): Promise<Home>;

}

export default HomeService;