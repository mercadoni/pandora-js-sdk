import Search from "../../models/Search";
import SearchFilter from "../../models/SearchFilter";

interface ProductService {

    search(filter: SearchFilter): Promise<Search>;

}

export default ProductService;