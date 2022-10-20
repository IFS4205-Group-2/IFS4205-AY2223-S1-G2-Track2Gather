import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import ContactTracerOverview from "./ContactTracerOverview";
import TracingRecords from "./TracingRecords";
import CloseContactInformation from "./CloseContactInformation";

export default function ContactTracerDashboard() {
  return (
    <>
      <Tabs variant='soft-rounded' colorScheme='green'>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Tracing Records</Tab>
            <Tab>Contact Details of infectants</Tab>
          </TabList>
          <TabPanels style={{ marginTop: '10px' }}>
            <TabPanel>
              <ContactTracerOverview />
            </TabPanel>
            <TabPanel>
              <TracingRecords />
            </TabPanel>
            <TabPanel>
              <CloseContactInformation />
            </TabPanel>
          </TabPanels>
        </Tabs>
    </>
  );
}