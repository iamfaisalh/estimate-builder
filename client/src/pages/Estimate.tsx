import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EstimateData, Item } from "../lib/types";
import api from "../lib/api";
import Button from "../components/Button";
import { formatMoney, toTitle } from "../lib/functions";

interface ItemRowProps {
  index: number;
  item: Item;
  rowSpan: number;
}

function ItemRow({ index, item, rowSpan }: ItemRowProps) {
  return (
    <tr>
      {index === 0 && <td rowSpan={rowSpan}>{toTitle(item.type)}</td>}
      <td>{item.name}</td>
      <td colSpan={item.type === "materials" ? 2 : 1}>
        {item.units}{" "}
        {item.type === "labor"
          ? "crew"
          : item.type === "materials"
          ? item.rate.unit.endsWith("s")
            ? item.rate.unit
            : item.rate.unit + "s"
          : ""}
      </td>
      {item.type !== "materials" && (
        <td>
          {item.time}{" "}
          {item.rate.unit.endsWith("s") ? item.rate.unit : item.rate.unit + "s"}
        </td>
      )}
      <td>
        {formatMoney(item.rate.price === "" ? 0 : item.rate.price)} /{" "}
        {item.rate.unit}
      </td>
      <td>{formatMoney(item.cost)}</td>
      <td>{item.margin}%</td>
      <td>{formatMoney(item.price)}</td>
    </tr>
  );
}

function Estimate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [estimate, setEstimate] = useState<EstimateData | undefined>(undefined);
  const [laborItems, setLaborItems] = useState<Item[]>([]);
  const [materialItems, setMaterialItems] = useState<Item[]>([]);
  const [equipmentItems, setEquipmentItems] = useState<Item[]>([]);
  const [message, setMessage] = useState<string>("Estimate not found");

  useEffect(() => {
    if (loading && id) {
      api({ url: "/estimates/" + id, method: "GET" })
        .then((response) => {
          setEstimate(response.data.estimate);
          setLaborItems(response.data.labor_items || []);
          setMaterialItems(response.data.material_items || []);
          setEquipmentItems(response.data.equipment_items || []);
        })
        .catch((error) =>
          error?.data?.message ? setMessage(error.data.message) : null
        )
        .finally(() => setLoading(false));
    }
  }, [loading, id]);

  if (loading) return null;
  return (
    <div className="container h-100 p-5">
      {!estimate && (
        <div className="row h-100">
          <div className="col my-auto pb-5">
            <div className="text-center mb-5">
              <h2 className="text-body-emphasis my-4">
                {!id ? "Invalid Estimate" : message}
              </h2>
              <div className="d-inline-flex gap-2">
                <Button className="px-4" onClick={() => navigate("/")}>
                  Go to home
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {estimate && (
        <div className="row align-items-center">
          <div className="col">
            <div className="row">
              <Button
                // color="secondary"
                className="px-4 w-auto mx-auto my-4"
                onClick={() => navigate("/")}
              >
                Go to home
              </Button>
            </div>
            <div
              style={{ overflow: "hidden" }}
              className="card text-bg-dark mb-3 mx-auto"
            >
              <div className="card-header">
                <div className="row">
                  <div className="col-12 col-sm-6 ">
                    <div className="row g-2">
                      <div className="col">
                        <strong>Prepared by</strong>
                      </div>
                    </div>
                    <div className="row g-2">
                      <div className="col">{estimate.contractor_name}</div>
                    </div>
                    <div className="row g-2">
                      <div className="col">
                        Job number: {estimate.job_number}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 text-start text-sm-end ml-auto">
                    <div className="row g-2 text-body-emphasis">
                      <div className="col">
                        <strong>Prepared for</strong>
                      </div>
                    </div>
                    <div className="row g-2">
                      <div className="col">{estimate.customer_name}</div>
                    </div>
                    {estimate.customer_address && (
                      <>
                        <div className="row g-2">
                          <div className="col">
                            {toTitle(estimate.customer_address.street)}
                          </div>
                        </div>
                        <div className="row g-2">
                          <div className="col">
                            {toTitle(estimate.customer_address.city)},{" "}
                            {estimate.customer_address.state.length > 2
                              ? toTitle(estimate.customer_address.state)
                              : estimate.customer_address.state.toUpperCase()}{" "}
                            {toTitle(estimate.customer_address.zip)}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-bordered m-0">
                    <thead>
                      <tr>
                        <th scope="col">Type</th>
                        <th scope="col">Item</th>
                        <th scope="col">Units</th>
                        <th scope="col">Time</th>
                        <th scope="col">Rate</th>
                        <th scope="col">Cost</th>
                        <th scope="col">Margin</th>
                        <th scope="col">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laborItems.length > 0 &&
                        laborItems.map((item, index) => (
                          <ItemRow
                            key={item._id}
                            index={index}
                            item={item}
                            rowSpan={laborItems.length}
                          />
                        ))}
                      {materialItems.length > 0 &&
                        materialItems.map((item, index) => (
                          <ItemRow
                            key={item._id}
                            index={index}
                            item={item}
                            rowSpan={materialItems.length}
                          />
                        ))}
                      {equipmentItems.length > 0 &&
                        equipmentItems.map((item, index) => (
                          <ItemRow
                            key={item._id}
                            index={index}
                            item={item}
                            rowSpan={equipmentItems.length}
                          />
                        ))}
                      <tr>
                        <th className="text-end" colSpan={5}>
                          Total
                        </th>
                        <td>{formatMoney(estimate.total_cost)}</td>
                        <td>{estimate.total_margin}%</td>
                        <td>{formatMoney(estimate.total_price)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Estimate;
