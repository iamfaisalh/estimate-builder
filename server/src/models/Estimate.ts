import { Schema, model, Document } from "mongoose";

export interface Rate {
  price: number;
  unit: string;
}

const rate_schema = new Schema<Rate>({
  price: { type: Number, default: 0, required: true },
  unit: { type: String, trim: true, lowercase: true, required: true },
});

export interface Item {
  margin: number;
  name: string;
  rate: Rate;
  time: number;
  type: "labor" | "materials" | "equipment";
  units: number;
}

const item_schema = new Schema<Item>({
  margin: { type: Number, default: 0, required: true },
  name: { type: String, trim: true, required: true },
  rate: { type: rate_schema, required: true },
  time: { type: Number, default: 0 },
  type: { type: String, enum: ["labor", "materials", "equipment"] },
  units: { type: Number, default: 1, required: true },
});

export interface Address {
  city: string;
  country: string;
  state: string;
  street: string;
  zip: string;
}

const address_schema = new Schema<Address>({
  city: { type: String, trim: true, lowercase: true, required: true },
  country: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    default: "united states",
  },
  state: { type: String, trim: true, lowercase: true, required: true },
  street: { type: String, trim: true, lowercase: true, required: true },
  zip: { type: String, trim: true, lowercase: true, required: true },
});

export interface EstimateData {
  contractor_name: string;
  customer_address?: Address;
  customer_name: string;
  items: Item[];
  job_number: string;
}

export interface Estimate extends Document {
  contractor_name: string;
  customer_address?: Address;
  customer_name: string;
  items: Item[];
  job_number: string;
}

const estimate_schema = new Schema<Estimate>(
  {
    contractor_name: { type: String, trim: true, required: true },
    customer_address: { type: address_schema },
    customer_name: { type: String, trim: true, required: true },
    items: [item_schema],
    job_number: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const EstimateModel = model<Estimate>("Estimate", estimate_schema);

export default EstimateModel;
