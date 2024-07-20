export interface Address {
  city: string;
  country: string;
  state: string;
  street: string;
  zip: string;
}

export interface Rate {
  price: number | "";
  unit: string;
}

export interface Item {
  _id: string;
  margin: number | "";
  name: string;
  rate: Rate;
  time: number | "";
  type: "labor" | "materials" | "equipment";
  units: number | "";
}

export interface EstimateData {
  _id: string;
  contractor_name: string;
  customer_address?: Address;
  customer_name: string;
  items: Item[];
  job_number: string;
}
