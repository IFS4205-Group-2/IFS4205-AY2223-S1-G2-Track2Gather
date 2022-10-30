import UserDashboard from "../components/Dashboard/User/UserDashboard";
import ContactTracerDashboard from "../components/Dashboard/ContractTracer/ContactTracerDashboard";
import NavBar from "../components/Nav/NavBar";
import { USER_ROLES } from "../constants";
import HealthAuthorityDashboard from "../components/Dashboard/HealthAuthority/HealthAuthorityDashboard";
import { useState } from "react";

export default function Dashboard() {
  const [userRole, setUserRole] = useState({});
  const token = localStorage.getItem("token");

  useState(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://ifs4205-gp02-1.comp.nus.edu.sg/user/role', {
          credentials: "include",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const { status_code, ...data } = await res.json();
        if (status_code === 0) {
          setUserRole(data.rid);
          return;
        }
      } catch(e) {
        console.log(e);
        return;
      }
    }
    fetchData();
  }, [token]);

  return (
    <>
      <NavBar />
      <div style={{ paddingLeft: '32px', paddingRight: '32px' }}>
        { userRole === USER_ROLES.user 
          ? <UserDashboard /> 
          : userRole === USER_ROLES.contactTracer
            ? <ContactTracerDashboard />
            : userRole === USER_ROLES.healthAuthority
              ? <HealthAuthorityDashboard />
              : null
        }
      </div>
    </>
  );
}