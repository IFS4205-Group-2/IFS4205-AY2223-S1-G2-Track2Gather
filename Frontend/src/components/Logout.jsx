
import { useNavigate } from "react-router";
import { Button, ButtonGroup } from "@chakra-ui/react";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
  <ButtonGroup pt="1rem">
        <Button colorScheme="red" onClick={handleLogOut}>
            Log Out
        </Button>
  </ButtonGroup>
    
  );
};

export default Logout;