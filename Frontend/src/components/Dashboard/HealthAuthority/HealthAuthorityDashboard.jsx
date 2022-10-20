import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import AccountManagement from "./AccountManagement";
import HealthAuthorityOverview from "./HealthAuthorityOverview";
import TokenManagement from "./TokenManagement";
import UserInformation from "./UserInformation";

export default function HealthAuthorityDashboard() {
  return (
    <>
      <Tabs variant='soft-rounded' colorScheme='green'>
        <TabList>
          <Tab>Overall Status</Tab>
          <Tab>User Information</Tab>
          <Tab>Account Management</Tab>
          <Tab>Token Management</Tab>
        </TabList>
        <TabPanels style={{ marginTop: '10px' }}>
          <TabPanel>
            <HealthAuthorityOverview />
          </TabPanel>
          <TabPanel>
            <UserInformation />
          </TabPanel>
          <TabPanel>
            <AccountManagement />
          </TabPanel>
          <TabPanel>
            <TokenManagement />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}