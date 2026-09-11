import GetAddressesFilter from './GetAddressesFilter';
import AddressModel from '../../models/address/AddressModel';

interface AddressService {
    getAddresses(filter: GetAddressesFilter): Promise<AddressModel[]>;
}

export default AddressService;
