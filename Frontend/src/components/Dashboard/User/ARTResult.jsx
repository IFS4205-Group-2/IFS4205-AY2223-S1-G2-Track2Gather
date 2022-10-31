import { Button, ButtonGroup, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, RadioGroup, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, VStack } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

export default function ARTResult() {
  const { isOpen: showUpdateDialog, onOpen: onOpenUpdateDialog, onClose: onCloseUpdateDialog } = useDisclosure();
  const token = localStorage.getItem("token");
  const [info, setInfo] = useState({});

  useState(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://ifs4205-gp02-1.comp.nus.edu.sg/medical/info', {
          credentials: "include",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const { status_code, ...data } = await res.json();
        if (status_code === 0) {
          setInfo(data);
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
      <TableContainer>
        <Table variant='simple' colorScheme={'facebook'}>
          <Thead>
            <Tr>
              <Th>Vaccination History</Th>
              <Th>Latest Test Result</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{info?.vaccination_history || "No vaccination history"}</Td>
              <Td>{info?.recent_test_result || "No test result"}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <ButtonGroup pt="1rem" m={"20px 0"} w={"100%"} justifyContent={"center"}>
        <Button colorScheme="teal" type="button" onClick={onOpenUpdateDialog}>
          Upload Test Result
        </Button>
      </ButtonGroup>
      <Modal
        isCentered
        onClose={onCloseUpdateDialog}
        isOpen={showUpdateDialog}
        motionPreset='slideInBottom'
        size={'xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Test Result</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ testresult: "" }}
              validationSchema={Yup.object({
                testresult: Yup.string()
                  .required("Test result required!")
              })}            
              onSubmit={(values, actions) => {
                const vals = { ...values };
                actions.resetForm();
                fetch("https://ifs4205-gp02-1.comp.nus.edu.sg/medical/update", {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(vals),
                })
                .catch(err => {
                  return;
                })
                .then(res => {
                  if (!res || !res.ok || res.status >= 400) {
                    return;
                  }
                  return res.json();
                })
                .then(data => {
                  if (!data) return;
                });
                window.location.reload();
              }}>
              <VStack
                as={Form}
                w={'100%'}
                spacing="1rem"
              >
                <RadioGroup name="testresult" w={"100%"}>
                  <FormLabel>Test Result</FormLabel>
                  <Stack>
                    <label>
                      <Field type="radio" name="testresult" value="positive"/>
                      <span style={{"padding-left": "10px"}}>Positive</span>
                    </label>
                    <label>
                      <Field type="radio" name="testresult" value="negative"/>
                      <span style={{"padding-left": "10px"}}>Negative</span>
                    </label>
                  </Stack>
                </RadioGroup>

                <ButtonGroup pt="1rem">
                  <Button mr={3} onClick={onCloseUpdateDialog}>
                    Cancel
                  </Button>
                  <Button colorScheme="teal" type="submit">
                    Update
                  </Button>
                </ButtonGroup>
              </VStack>
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}