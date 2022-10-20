import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import PersonalStats from "./PersonalStats";
import ARTResult from "./ARTResult";
import PersonalInfoForm from "./PersonalInfoForm";

export default function UserDashboard() {
  return (
    <>
      <Tabs variant='soft-rounded' colorScheme='green'>
          <TabList>
            <Tab>Personal Status</Tab>
            <Tab>Upload ART Result</Tab>
            <Tab>Update Personal Info</Tab>
          </TabList>
          <TabPanels style={{ marginTop: '10px' }}>
            <TabPanel>
              <PersonalStats />
            </TabPanel>
            <TabPanel>
              <ARTResult />
            </TabPanel>
            <TabPanel>
              <PersonalInfoForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
    </>
  );
}