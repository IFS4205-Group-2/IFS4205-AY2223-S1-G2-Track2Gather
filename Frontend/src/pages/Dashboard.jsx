import UserDashboard from "../components/Dashboard/User/UserDashboard";
import ContactTracerDashboard from "../components/Dashboard/ContractTracer/ContactTracerDashboard";
import NavBar from "../components/Nav/NavBar";
import { USER_ROLES } from "../constants";
import HealthAuthorityDashboard from "../components/Dashboard/HealthAuthority/HealthAuthorityDashboard";

export default function Dashboard() {
  // TODO: fetch role from JWT token
  const userRole = 'healthAuthority';

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