import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { MONGO_URI } from "../config";
import { faker } from "@faker-js/faker/locale/en_US";
import { Item } from "../models/Estimate";
import { CreateEstimateBody } from "../controllers/estimates";
import { toTitle } from "../util/functions";

// Random items for the estimate mock data
const RANDOM_ESTIMATE_ITEMS = {
  labor: [
    "Digout",
    "Paving",
    "Driving",
    "Sealing",
    "Cleanup",
    "Finishing",
    "Base Preparation",
    "Joint Cutting",
    "Grade Adjustment",
    "Compaction",
  ],
  materials: [
    "Concrete",
    "Asphalt",
    "Brick",
    "Stone Pavers",
    "Slate Pavers",
    "Clay Pavers",
    "Granite Pavers",
    "Gravel",
    "Sand",
    "Limestone",
  ],
  equipment: [
    "Bobcat",
    "Truck",
    "Paver",
    "Roller",
    "Excavator",
    "Power Trowel",
    "Concrete Mixer",
    "Grader",
  ],
};

const ITEM_TYPES: Array<"labor" | "materials" | "equipment"> = [
  "labor",
  "materials",
  "equipment",
];

const generateMockEstimateBody = (override_item_size?: number) => {
  const estimate: CreateEstimateBody = {
    contractor_name: faker.company.name(),
    customer_address: {
      city: faker.location.city(),
      country: "united states",
      state: faker.location.state({ abbreviated: true }),
      street: faker.location.streetAddress(),
      zip: faker.location.zipCode(),
    },
    customer_name: faker.person.fullName(),
    items: [],
  };

  const items_size =
    override_item_size || faker.number.int({ min: 1, max: 10 });

  let i;
  for (i = 0; i < items_size; i++) {
    const item_type: "labor" | "materials" | "equipment" =
      ITEM_TYPES[faker.number.int({ min: 0, max: ITEM_TYPES.length - 1 })];
    const new_item: Item = {
      margin: faker.number.int({ min: 0, max: 40 }),
      name: RANDOM_ESTIMATE_ITEMS[item_type][
        faker.number.int({
          min: 0,
          max: RANDOM_ESTIMATE_ITEMS[item_type].length - 1,
        })
      ],
      rate: {
        price: faker.number.int({ min: 0, max: 80 }),
        unit: item_type === "materials" ? "ton" : "hr",
      },
      time:
        item_type === "materials" ? 0 : faker.number.int({ min: 1, max: 10 }),
      type: item_type,
      units: faker.number.int({
        min: 1,
        max: item_type === "materials" ? 100 : 8,
      }),
    };
    estimate.items.push(new_item);
  }
  return estimate;
};

// Connecting to the database before each test
beforeEach(async () => {
  await mongoose.connect(MONGO_URI);
});

// Closing database connection after each test
afterEach(async () => {
  await mongoose.connection.close();
});

describe("Test endpoint: GET /api/estimates", () => {
  it("should successfully return a list of estimates", async () => {
    const response = await request(app).get("/api/estimates");
    // console.log("Estimates List:\n", response.body);
    expect(response.status).toBe(200);
    expect(response.body);
  });
});

describe("Test endpoint: GET /api/estimates/:id", () => {
  it("should handle invalid estimate IDs", async () => {
    const response = await request(app).get("/api/estimates/69493882");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid estimate" });
  });

  it("should handle estimates that do not exist", async () => {
    const response = await request(app).get(
      "/api/estimates/6698a102418ad2245fec79e4"
    );
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Estimate not found" });
  });
});

describe("Test endpoint: POST /api/estimates", () => {
  it("should handle a missing property in the request body", async () => {
    const body = {
      contractor_name: faker.company.name(),
      items: [],
    };
    const response = await request(app).post("/api/estimates").send(body);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid request." });
  });

  it("should handle an estimate with no items", async () => {
    const body = {
      contractor_name: faker.company.name(),
      customer_name: faker.person.fullName(),
      items: [],
    };
    const response = await request(app).post("/api/estimates").send(body);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "At least one item is required for the estimate.",
    });
  });

  it("should handle an invalid estimate item", async () => {
    const body = generateMockEstimateBody(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const test_body: any = { ...body, items: [...body.items] };
    delete test_body.items[0].name;
    const response = await request(app).post("/api/estimates").send(test_body);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid item found." });
  });

  it("should handle a negative rate price on an estimate item", async () => {
    const body = generateMockEstimateBody(1);
    body.items[0].rate.price = -20;
    const response = await request(app).post("/api/estimates").send(body);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: `${toTitle(
        body.items[0].type
      )} item rate must be a positive value.`,
    });
  });

  it("should successfully create an estimate", async () => {
    const body = generateMockEstimateBody();
    const response = await request(app).post("/api/estimates").send(body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully created estimate!",
    });
  });
});
