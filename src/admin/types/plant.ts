import { Features } from "./features";


export interface Plan {

        id: number;
        name: string;
        description: string;
        price: number;
        specialPrice: number;
        joiningPrice: number;
        billingCycle: number;
        featureList: Features;
        createdTime: string;
        updatedTime: string;
        active: boolean;
        check:boolean;
      }
   
  
