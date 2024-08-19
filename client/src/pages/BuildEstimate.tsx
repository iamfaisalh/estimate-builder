import { SetStateAction, useState, Dispatch } from "react";
import Field from "../components/Field";
import InputField from "../components/InputField";
import { Address, Item } from "../lib/types";
import { generateRandomString, toTitle } from "../lib/functions";
import Button from "../components/Button";
import Alert, { AlertObject } from "../components/Alert";
import Switch from "../components/Switch";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

interface CreateEstimateBody {
  contractor_name: string;
  customer_address?: Address;
  customer_name: string;
  items: Item[];
}

interface ItemRowProps {
  index: number;
  item: Item;
  setItems: Dispatch<SetStateAction<Item[]>>;
}

function ItemRow({ index, item, setItems }: ItemRowProps) {
  const calculateValue = (number: number, minimum: number = 0) => {
    if (isNaN(number)) return "";
    else if (number < minimum) return -1;
    return number;
  };

  return (
    <>
      {index > 0 && <div className="border-top"></div>}
      <div className="row g-2 align-items-center">
        {/* ITEM NAME */}
        <div className="col-md-6">
          <Field label="Item" labelProps={{ htmlFor: "item-" + item._id }}>
            <InputField
              type="text"
              id={"item-" + item._id}
              placeholder="Enter item..."
              value={item.name}
              onChange={(e) =>
                setItems((prev) => {
                  const new_items = [...prev];
                  new_items[index].name = e.target.value;
                  return new_items;
                })
              }
            />
          </Field>
        </div>

        {/* UNITS */}
        <div className="col-md-6">
          <Field
            label={"Units (qty)"}
            labelProps={{ htmlFor: "units-" + item._id }}
          >
            <InputField
              type="number"
              id={"units-" + item._id}
              placeholder={"1"}
              min={1}
              value={item.units}
              onChange={(e) => {
                let new_value: number | "" = calculateValue(
                  e.target.valueAsNumber,
                  1
                );
                if (new_value === -1) return;
                setItems((prev) => {
                  const new_items = [...prev];
                  new_items[index].units = new_value;
                  return new_items;
                });
              }}
            />
          </Field>
        </div>

        {/* TIME */}
        {item.type !== "materials" && (
          <div className="col-md-6">
            <Field
              label={`Time ${
                item.rate.unit.trim().length > 0
                  ? `(${
                      item.rate.unit.endsWith("s")
                        ? item.rate.unit
                        : item.rate.unit + "s"
                    })`
                  : ""
              }`}
              labelProps={{ htmlFor: "time-" + item._id }}
            >
              <InputField
                type="number"
                id={"time-" + item._id}
                placeholder={"0"}
                min={0}
                value={item.time}
                onChange={(e) => {
                  let new_value: number | "" = calculateValue(
                    e.target.valueAsNumber,
                    0
                  );
                  if (new_value === -1) return;
                  setItems((prev) => {
                    const new_items = [...prev];
                    new_items[index].time = new_value;
                    return new_items;
                  });
                }}
              />
            </Field>
          </div>
        )}

        {/* RATE (price) */}
        <div className="col-md-6">
          <Field
            label="Rate ($)"
            labelProps={{ htmlFor: "rate-price-" + item._id }}
          >
            <InputField
              type="number"
              id={"rate-price-" + item._id}
              placeholder={"0"}
              min={0}
              value={item.rate.price}
              onChange={(e) => {
                let new_value: number | "" = calculateValue(
                  e.target.valueAsNumber,
                  0
                );
                if (new_value === -1) return;
                setItems((prev) => {
                  const new_items = [...prev];
                  new_items[index].rate = {
                    ...new_items[index].rate,
                    price: new_value,
                  };
                  return new_items;
                });
              }}
            />
          </Field>
        </div>

        {/* RATE (unit) */}
        <div className="col-md-6">
          <Field
            label={
              "Rate Unit " +
              (item.type === "materials" ? "(e.g. gallon)" : "(e.g. hr)")
            }
            labelProps={{
              htmlFor: "rate-unit-" + item._id,
            }}
          >
            <InputField
              type="text"
              id={"rate-unit-" + item._id}
              placeholder={"hr"}
              value={item.rate.unit}
              onChange={(e) =>
                setItems((prev) => {
                  const new_items = [...prev];
                  new_items[index].rate = {
                    ...new_items[index].rate,
                    unit: e.target.value,
                  };
                  return new_items;
                })
              }
            />
          </Field>
        </div>

        {/* MARGIN */}
        <div className="col-md-6">
          <Field
            label="Margin (%)"
            labelProps={{ htmlFor: "margin-" + item._id }}
          >
            <InputField
              type="number"
              id={"margin-" + item._id}
              placeholder={"0"}
              min={0}
              value={item.margin}
              onChange={(e) => {
                let new_value: number | "" = calculateValue(
                  e.target.valueAsNumber,
                  0
                );
                if (new_value === -1) return;
                setItems((prev) => {
                  const new_items = [...prev];
                  new_items[index].margin = new_value;
                  return new_items;
                });
              }}
            />
          </Field>
        </div>

        {/* DELETE ITEM */}
        <div className="col-12">
          <Button
            color="danger"
            onClick={() =>
              setItems((prev) => prev.filter((this_item, i) => i !== index))
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
            </svg>
          </Button>
        </div>
      </div>
    </>
  );
}

const INIT_ALERT: AlertObject = {
  active: false,
};

const INIT_ITEM: Item = {
  _id: "",
  cost: 0,
  margin: "",
  name: "",
  price: 0,
  rate: {
    price: "",
    unit: "",
  },
  time: "",
  type: "labor",
  units: "",
};

const INIT_ADDRESS: Address = {
  city: "",
  country: "united states",
  state: "",
  street: "",
  zip: "",
};

function BuildEstimate() {
  const navigate = useNavigate();
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
  const [alertObject, setAlertObject] = useState<AlertObject>(INIT_ALERT);
  const [contractorName, setContractorName] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<Address>(INIT_ADDRESS);
  const [includeAddress, setIncludeAddress] = useState<boolean>(true);
  const [laborItems, setLaborItems] = useState<Item[]>([]);
  const [materialItems, setMaterialItems] = useState<Item[]>([]);
  const [equipmentItems, setEquipmentItems] = useState<Item[]>([]);

  const getPositionOfItem = (
    id: string,
    type: "labor" | "materials" | "equipment"
  ) => {
    if (type === "labor") return laborItems.findIndex((i) => i._id === id);
    if (type === "materials")
      return materialItems.findIndex((i) => i._id === id);
    return equipmentItems.findIndex((i) => i._id === id);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const new_alert_object: AlertObject = {
      active: true,
      color: "danger",
      message: "Something went wrong.",
    };
    try {
      setSubmitDisabled(true);

      const body: CreateEstimateBody = {
        contractor_name: contractorName.trim(),
        customer_name: customerName.trim(),
        items: [...laborItems, ...materialItems, ...equipmentItems],
      };

      if (contractorName.trim().length === 0) {
        new_alert_object.message = "Contractor name is required.";
        throw new Error();
      }

      if (customerName.trim().length === 0) {
        new_alert_object.message = "Customer name is required.";
        throw new Error();
      }

      if (includeAddress) {
        const new_address: Address = {
          city: customerAddress.city.trim().toLowerCase(),
          country: customerAddress.country,
          state: customerAddress.state.trim().toLowerCase(),
          street: customerAddress.street.trim().toLowerCase(),
          zip: customerAddress.zip.trim().toLowerCase(),
        };

        if (new_address.street.length === 0) {
          new_alert_object.message = "Address is required.";
          throw new Error();
        }

        if (new_address.city.length === 0) {
          new_alert_object.message = "City is required.";
          throw new Error();
        }

        if (new_address.state.length === 0) {
          new_alert_object.message = "State is required.";
          throw new Error();
        }

        if (new_address.zip.length === 0) {
          new_alert_object.message = "Zip code is required.";
          throw new Error();
        }

        body.customer_address = { ...new_address };
      }

      if (body.items.length === 0) {
        new_alert_object.message =
          "At least one item is required for the estimate.";
        throw new Error();
      }

      let i;
      for (i = 0; i < body.items.length; i++) {
        const item = body.items[i];
        const position = getPositionOfItem(item._id, item.type) + 1;

        if (item.name.trim().length === 0) {
          new_alert_object.message = `${toTitle(
            item.type
          )} item ${position} is required.`;
          throw new Error();
        }

        if (item.units === "" || item.units < 1) {
          new_alert_object.message = `${toTitle(
            item.type
          )} item ${position} units must be greater than 0.`;
          throw new Error();
        }

        if (item.type !== "materials") {
          if (item.time === "" || item.time <= 0) {
            new_alert_object.message = `${toTitle(
              item.type
            )} item ${position} time must be greater than 0.`;
            throw new Error();
          }
        }

        if (item.rate.price === "") {
          item.rate.price = 0;
          body.items[i].rate.price = 0;
        }

        if (item.rate.price < 0) {
          new_alert_object.message = `${toTitle(
            item.type
          )} item ${position} rate must be a positive value.`;
          throw new Error();
        }

        if (item.rate.unit.trim().length === 0) {
          new_alert_object.message = `${toTitle(
            item.type
          )} item ${position} rate unit is required.`;
          throw new Error();
        }

        if (item.margin === "") {
          item.margin = 0;
          body.items[i].margin = 0;
        }

        if (item.margin < 0) {
          new_alert_object.message = `${toTitle(
            item.type
          )} item ${position} margin must be a positive value.`;
          throw new Error();
        }
      }

      console.log("BODY", body);

      const response = await api({
        url: "/estimates",
        method: "POST",
        data: body,
      });

      setAlertObject({
        ...new_alert_object,
        color: "success",
        message: response.data.message,
      });

      setContractorName("");
      setCustomerName("");
      setCustomerAddress(INIT_ADDRESS);
      setIncludeAddress(true);
      setLaborItems([]);
      setMaterialItems([]);
      setEquipmentItems([]);
      setSubmitDisabled(false);
    } catch (error: any) {
      if (error?.data?.message) new_alert_object.message = error.data.message;
      setAlertObject(new_alert_object);
      setSubmitDisabled(false);
    }
  };

  return (
    <>
      {/* ALERT */}
      {alertObject.active && (
        <Alert
          color={alertObject.color}
          className="position-fixed top-0 end-0 mt-3 mx-3 z-3"
          onClose={() => setAlertObject(INIT_ALERT)}
        >
          {alertObject.message}
        </Alert>
      )}
      <div className="container h-100 p-5">
        <div className="row g-2 align-items-center">
          <Button className="mb-5 w-auto mx-auto" onClick={() => navigate("/")}>
            View All Estimates
          </Button>
        </div>
        <h3 className="text-center">Estimate Builder</h3>
        <form className="row g-3">
          {/* CONTRACTOR NAME */}
          <div className="row g-2 mt-5">
            <div className="col-md">
              <Field
                label="Contractor Name (You)"
                labelProps={{ htmlFor: "contractor_name" }}
              >
                <InputField
                  type="text"
                  id="contractor_name"
                  placeholder="Paving Co."
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                />
              </Field>
            </div>
          </div>

          <h6 className="mb-0 mt-5">Customer Information</h6>
          {/* CUSTOMER NAME */}
          <div className="row g-2">
            <div className="col-md">
              <Field label="Name" labelProps={{ htmlFor: "customer_name" }}>
                <InputField
                  type="text"
                  id="customer_name"
                  placeholder="Max Kostow"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </Field>
            </div>
          </div>

          {/* ADDRESS TOGGLE */}
          <Switch
            toggle={includeAddress}
            setToggle={setIncludeAddress}
            label="Include Address"
          />

          {/* ADDRESS */}
          {includeAddress && (
            <>
              <div className="row g-2">
                <div className="col-md">
                  <Field label="Address" labelProps={{ htmlFor: "street" }}>
                    <InputField
                      type="text"
                      id="street"
                      placeholder="44 Tehama Street"
                      value={customerAddress.street}
                      onChange={(e) =>
                        setCustomerAddress((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
              </div>
              <div className="row g-2">
                <div className="col-md-6">
                  <Field label="City" labelProps={{ htmlFor: "city" }}>
                    <InputField
                      type="text"
                      id="city"
                      placeholder="San Francisco"
                      value={customerAddress.city}
                      onChange={(e) =>
                        setCustomerAddress((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
                <div className="col-md-4">
                  <Field label="State" labelProps={{ htmlFor: "state" }}>
                    <InputField
                      type="text"
                      id="state"
                      placeholder="CA"
                      value={customerAddress.state}
                      onChange={(e) =>
                        setCustomerAddress((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
                <div className="col-md-2">
                  <Field label="Zip Code" labelProps={{ htmlFor: "zip" }}>
                    <InputField
                      type="text"
                      id="zip"
                      placeholder="94133"
                      value={customerAddress.zip}
                      onChange={(e) =>
                        setCustomerAddress((prev) => ({
                          ...prev,
                          zip: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
              </div>
            </>
          )}

          {/* LABOR ITEMS */}
          <h6 className="mb-0 mt-5">Labor</h6>
          {laborItems.map((item, index) => (
            <ItemRow
              key={"lir-" + item._id}
              index={index}
              item={item}
              setItems={setLaborItems}
            />
          ))}
          <div className="row g-2 align-items-center">
            <Button
              className="w-auto"
              color="secondary"
              onClick={() =>
                setLaborItems((prev) => [
                  ...prev,
                  {
                    ...INIT_ITEM,
                    _id:
                      generateRandomString(10) + "-" + generateRandomString(5),
                  },
                ])
              }
            >
              Add Item +
            </Button>
          </div>

          {/* MATERIAL ITEMS */}
          <h6 className="mb-0 mt-5">Materials</h6>
          {materialItems.map((item, index) => (
            <ItemRow
              key={"mr-" + item._id}
              index={index}
              item={item}
              setItems={setMaterialItems}
            />
          ))}
          <div className="row g-2 align-items-center">
            <Button
              className="w-auto"
              color="secondary"
              onClick={() =>
                setMaterialItems((prev) => [
                  ...prev,
                  {
                    ...INIT_ITEM,
                    _id:
                      generateRandomString(10) + "-" + generateRandomString(5),
                    type: "materials",
                  },
                ])
              }
            >
              Add Item +
            </Button>
          </div>

          {/* EQUIPMENT ITEMS */}
          <h6 className="mb-0 mt-5">Equipment</h6>
          {equipmentItems.map((item, index) => (
            <ItemRow
              key={"er-" + item._id}
              index={index}
              item={item}
              setItems={setEquipmentItems}
            />
          ))}
          <div className="row g-2 align-items-center">
            <Button
              className="w-auto"
              color="secondary"
              onClick={() =>
                setEquipmentItems((prev) => [
                  ...prev,
                  {
                    ...INIT_ITEM,
                    _id:
                      generateRandomString(10) + "-" + generateRandomString(5),
                    type: "equipment",
                  },
                ])
              }
            >
              Add Item +
            </Button>
          </div>

          {/* SUBMIT */}
          <div className="row g-2 align-items-center mt-5">
            <Button
              type="submit"
              disabled={submitDisabled}
              className="mb-5"
              onClick={handleSubmit}
            >
              Submit Estimate
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default BuildEstimate;
