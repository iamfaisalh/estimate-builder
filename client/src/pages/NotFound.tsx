import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="container h-100 p-5 text-center">
      <h1 className="mb-2">404 Not Found</h1>
      <Button className="mb-2" onClick={() => navigate("/")}>
        Go to home
      </Button>
    </div>
  );
}

export default NotFound;
