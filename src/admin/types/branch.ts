import { Country } from "./country";
import { District } from "./district";
import { State } from "./state";

export interface Branch{
    id: number;
    name: string;
    code: string;
    location: string;
    active: boolean;
    state: State;
    district: District;
    country: Country;
    city: string;
    mapUrl: string;
    pincode: number;
    image: string;
    latitude: number;
    longitude: number;

}
