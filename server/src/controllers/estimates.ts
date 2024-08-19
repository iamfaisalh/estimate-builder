import { RequestHandler } from "express";
import EstimateModel, {
  Address,
  Estimate,
  EstimateData,
  Item,
} from "../models/Estimate";
import CustomError from "../util/CustomError";
import {
  calculateCost,
  calculatePrice,
  generateRandomString,
  toTitle,
} from "../util/functions";
import { isValidObjectId } from "mongoose";

const addressIsValid = (address: Address) => {
  try {
    if (
      address.city.trim().length === 0 ||
      address.country.trim().length === 0 ||
      address.state.trim().length === 0 ||
      address.street.trim().length === 0 ||
      address.zip.trim().length === 0
    ) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export interface CreateEstimateBody {
  contractor_name: string;
  customer_address?: Address;
  customer_name: string;
  items: Item[];
}

export const create: RequestHandler = async (req, res, next) => {
  try {
    const {
      contractor_name,
      customer_address,
      customer_name,
      items,
    }: CreateEstimateBody = req.body;

    const body_keys = Object.keys(req.body);

    if (
      !body_keys.includes("contractor_name") ||
      !body_keys.includes("customer_name") ||
      !body_keys.includes("items")
    )
      throw new CustomError("Invalid request.", 400);

    const new_estimate_data: EstimateData = {
      contractor_name: contractor_name?.trim() || "",
      customer_name: customer_name?.trim() || "",
      items: [],
      job_number:
        generateRandomString(5, true) + "-" + generateRandomString(4, true),
      total_cost: 0,
      total_margin: 0,
      total_price: 0,
    };

    if (new_estimate_data.contractor_name.length === 0)
      throw new CustomError("Contractor name is required.", 400);

    if (new_estimate_data.customer_name.length === 0)
      throw new CustomError("Customer name is required.", 400);

    if (customer_address) {
      if (!addressIsValid(customer_address))
        throw new CustomError("Address is invalid.", 400);

      new_estimate_data.customer_address = {
        city: customer_address.city.trim().toLowerCase(),
        country: customer_address.country.trim().toLowerCase(),
        state: customer_address.state.trim().toLowerCase(),
        street: customer_address.street.trim().toLowerCase(),
        zip: customer_address.zip.trim().toLowerCase(),
      };
    }

    if (items.length === 0)
      throw new CustomError(
        "At least one item is required for the estimate.",
        400
      );

    let i;
    for (i = 0; i < items.length; i++) {
      const item_keys = Object.keys(items[i]);
      if (
        !items[i] ||
        !item_keys.includes("margin") ||
        !item_keys.includes("name") ||
        !item_keys.includes("rate") ||
        !item_keys.includes("time") ||
        !item_keys.includes("type") ||
        !item_keys.includes("units")
      )
        throw new CustomError("Invalid item found.", 400);

      const item: Item = {
        cost: 0,
        margin: items[i].margin || 0,
        name: items[i].name?.trim() || "",
        price: 0,
        rate: {
          price: items[i].rate.price || 0,
          unit: items[i].rate.unit?.trim() || "",
        },
        time: items[i].time || 0,
        type: items[i].type,
        units: items[i].units || 1,
      };

      if (
        item.type !== "equipment" &&
        item.type !== "labor" &&
        item.type !== "materials"
      )
        throw new CustomError("Invalid item type.", 400);

      if (item.name.length === 0)
        throw new CustomError(`${toTitle(item.type)} item is required.`, 400);

      if (item.units < 1) {
        throw new CustomError(
          `${toTitle(item.type)} item units must be greater than 0.`,
          400
        );
      }

      if (item.type !== "materials") {
        if (item.time <= 0)
          throw new CustomError(
            `${toTitle(item.type)} item time must be greater than 0.`,
            400
          );
      }

      if (item.rate.price < 0) {
        throw new CustomError(
          `${toTitle(item.type)} item rate must be a positive value.`,
          400
        );
      }

      if (item.rate.unit.length === 0) {
        throw new CustomError(
          `${toTitle(item.type)} item rate unit is required.`,
          400
        );
      }

      if (item.margin < 0) {
        throw new CustomError(
          `${toTitle(item.type)} item margin must be a positive value.`,
          400
        );
      }

      item.cost = calculateCost(
        item.units || 1,
        item.rate.price || 0,
        item.time || 0,
        item.type
      );
      item.price = calculatePrice(item.cost, item.margin || 0);
      new_estimate_data.total_cost += item.cost;
      new_estimate_data.total_price += item.cost / (1 - item.margin / 100.0);
      new_estimate_data.items.push(item);
    }

    new_estimate_data.total_cost = parseFloat(
      new_estimate_data.total_cost.toFixed(2)
    );
    new_estimate_data.total_price = parseFloat(
      new_estimate_data.total_price.toFixed(2)
    );
    new_estimate_data.total_margin = parseFloat(
      (
        (100 * (new_estimate_data.total_price - new_estimate_data.total_cost)) /
        new_estimate_data.total_price
      ).toFixed(2)
    );

    const estimate: Estimate = new EstimateModel(new_estimate_data);
    await estimate.save();

    return res.json({ message: "Successfully created estimate!" });
  } catch (error) {
    next(error);
  }
};

export const fetchAll: RequestHandler = async (req, res, next) => {
  try {
    const estimates = await EstimateModel.find(
      {},
      { _id: 1, contractor_name: 1, customer_name: 1, job_number: 1 }
    );
    return res.json(estimates);
  } catch (error) {
    next(error);
  }
};

export const fetchOne: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) throw new CustomError("Invalid estimate", 400);
    const estimate = await EstimateModel.findById(id);

    if (!estimate) throw new CustomError("Estimate not found", 400);

    const labor_items: Item[] = [];
    const material_items: Item[] = [];
    const equipment_items: Item[] = [];

    let i;

    for (i = 0; i < estimate.items.length; i++) {
      const item = estimate.items[i];
      if (item.type === "labor") labor_items.push(item);
      else if (item.type === "materials") material_items.push(item);
      else equipment_items.push(item);
    }

    return res.json({
      estimate,
      labor_items,
      material_items,
      equipment_items,
    });
  } catch (error) {
    next(error);
  }
};
