
export interface Tenant {
  id: number;
  name: string;
  url: string;
  phone: string;
  clientId: string;
  clientUrl: string;
  title: string;
  favIcon: string;
  bannerHome: string;
  logo: string;
  status: string;
  schemaName: string;
  plan?: any; // Using any for now since Plan type doesn't exist
}
