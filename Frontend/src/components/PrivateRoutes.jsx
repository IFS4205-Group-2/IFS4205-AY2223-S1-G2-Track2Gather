import { useContext } from "react";
import { AccountContext } from "./AccountContext";

const { Navigate } = require("react-router");

const useAuth = () => {
  const { user } = useContext(AccountContext);
  return user && user.loggedIn;
};

const PrivateRoutes = ({ children }) => {
  const isAuth = useAuth();
  return isAuth ? children : <Navigate replace to="/login" />;
};

export default PrivateRoutes;
