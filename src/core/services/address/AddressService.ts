import GetAddressesFilter from './GetAddressesFilter';
import CreateAddressInput from './CreateAddressInput';
import AddressModel from '../../models/address/AddressModel';

interface AddressService {
    getAddresses(filter: GetAddressesFilter): Promise<AddressModel[]>;
    createAddress(input: CreateAddressInput): Promise<AddressModel>;
}

export default AddressService;
