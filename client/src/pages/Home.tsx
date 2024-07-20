import { useEffect, useState } from "react";
import { EstimateData } from "../lib/types";
import api from "../lib/api";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [estimates, setEstimates] = useState<EstimateData[]>([]);

  useEffect(() => {
    if (loading) {
      api({ url: "/estimates", method: "GET" })
        .then((response) => setEstimates([...response.data]))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
  }, [loading]);

  if (loading) return null;
  return (
    <div className="container h-100 p-5">
      <h3 className="text-center">Estimates</h3>
      {estimates.length === 0 && (
        <div className="row h-100">
          <div className="col my-auto pb-5">
            <div className="text-center mb-5">
              <h2 className="text-body-emphasis my-4">No estimates found</h2>
              <div className="d-inline-flex gap-2">
                <Button
                  className="px-4"
                  onClick={() => navigate("/estimates/build")}
                >
                  Build Estimate +
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {estimates.length > 0 && (
        <>
          <div className="row g-2 align-items-center mt-3 mb-4">
            <Button
              className="px-4 w-auto mx-auto"
              onClick={() => navigate("/estimates/build")}
            >
              Build Estimate
            </Button>
          </div>
          <div className="row row-cols-1 row-cols-md-3 g-4 pb-5">
            {estimates.map((estimate) => (
              <div key={estimate._id} className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{estimate.contractor_name}</h5>
                    <hr></hr>
                    <p className="card-text">
                      Customer: {estimate.customer_name}
                      <br></br>
                      Job number: {estimate.job_number}
                    </p>
                    <Button
                      color="secondary"
                      onClick={() => navigate(`/estimate/${estimate._id}`)}
                    >
                      View Estimate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
