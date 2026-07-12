import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRadio } from "@/contexts/RadioContext";

// Redirect legacy /radio route into the global radio sheet experience.
const RadioPage = () => {
  const navigate = useNavigate();
  const { openSheet } = useRadio();

  useEffect(() => {
    openSheet();
    navigate("/", { replace: true });
  }, [navigate, openSheet]);

  return null;
};

export default RadioPage;
