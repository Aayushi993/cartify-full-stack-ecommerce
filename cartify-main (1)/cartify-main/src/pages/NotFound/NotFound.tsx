import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>

      <h2 className="text-xl font-semibold mb-2">
        Oops! Page not found
      </h2>

      <p className="text-gray-500 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Button
        variant="contained"
        onClick={goHome}
        sx={{ backgroundColor: "#2874f0" }}
      >
        Go to Home
      </Button>
    </div>
  );
};

export default NotFound;