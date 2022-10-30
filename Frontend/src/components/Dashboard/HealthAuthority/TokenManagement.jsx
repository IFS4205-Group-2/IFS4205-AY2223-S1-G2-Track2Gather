import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useState, useRef } from "react";
import * as Yup from "yup";
import TextField from "../../TextField";

export default function TokenManagement() {
  const { isOpen: showDeleteDialog, onOpen: onOpenDeleteDialog, onClose: onCloseDeleteDialog } = useDisclosure();
  const { isOpen: showAddDialog, onOpen: onOpenAddDialog, onClose: onCloseAddDialog } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState('');
  const cancelRef = useRef();
  let originalDataRef = useRef([]);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useState(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://ifs4205-gp02-1.comp.nus.edu.sg/token/info', {
          credentials: "include",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const { status_code, tokenInfos } = await res.json();
        if (status_code === 0) {
          originalDataRef.current = tokenInfos;
          setData(tokenInfos);
          return;
        }
      } catch(e) {
        console.log(e);
        return;
      }
    }
    fetchData();
  }, [token]);

  const handleOnDelete = (uid) => {
    setSelectedUser(uid);
    onOpenDeleteDialog();
  }

  const handleOnDeleteConfirmation = () => {
    fetch("https://ifs4205-gp02-1.comp.nus.edu.sg/token/delete", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ "uid": selectedUser }),
    })
    .catch(err => {
      console.log(err);
      return;
    })
    .then(res => {
      return;
    })
    .finally(() => {
      window.location.reload();
    })
  }

  const handleOnAdd = () => {
    onOpenAddDialog();
  }

  const filterData = (target) => {
    const filteredData = originalDataRef.current.filter(row => row.nric.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.name.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.tid.toLocaleLowerCase().includes(target.toLocaleLowerCase()));
    if (filteredData.length === 0 || target === '') {
      setData(originalDataRef.current);
      return;
    }
    setData(filteredData);
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      >

        <p>Search for:</p>
        <input
          type="text"
          onChange={(e) => filterData(e.target.value)}
          placeholder="Search for user or token..."
          style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: 5,
            marginLeft: 20,
            paddingLeft: 10,
            paddingRight: 10,
            width: 350,
            height: 30
          }}
        />
      </div>
      <ButtonGroup pt="1rem" m={"0 0 10px 0"} w={"100%"} justifyContent={"right"}>
        <Button colorScheme="teal" type="button" onClick={handleOnAdd}>
          Add Token
        </Button>
      </ButtonGroup>
      <TableContainer>
        <Table variant='simple' colorScheme={'facebook'}>
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>NRIC</Th>
              <Th>Full Name</Th>
              <Th>Token ID</Th>
              <Th>Assigned Date</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              data.map((info, index) => {
                return (
                  <Tr key={`${info.tokenID}-${index}`}>
                    <Td>{index + 1}</Td>
                    <Td>{info.nric}</Td>
                    <Td>{info.name}</Td>
                    <Td>{info.tid}</Td>
                    <Td>{info.assigneddate}</Td>
                    <Td><Button colorScheme="red" type="button" onClick={() => handleOnDelete(info.uid)}>Delete</Button></Td>
                  </Tr>
                )
              })
            }
          </Tbody>
        </Table>
      </TableContainer>
      <AlertDialog
        motionPreset='slideInBottom'
        isOpen={showDeleteDialog}
        leastDestructiveRef={cancelRef}
        onClose={onCloseDeleteDialog}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Token
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDeleteDialog}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleOnDeleteConfirmation} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Modal
        isCentered
        onClose={onCloseAddDialog}
        isOpen={showAddDialog}
        motionPreset='slideInBottom'
        size={'xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ nric: "", tokenID: "" }}
              validationSchema={Yup.object({
                nric: Yup.string()
                  .required("NRIC required!")
                  .min(9, "NRIC is too short!")
                  .max(9, "NRIC is too long!")
                  .matches(/^[STGF]{1}[\d]{7}[A-Z]{1}$/, "Please ensure that your NRIC is correct!"),
                tokenID: Yup.string()
                  .required("Token ID required!")
                  .min(17, "Token ID too short!")
                  .max(17, "Token ID too long!")
                  .matches(/^[\dA-Fa-f]{2}:[\dA-Fa-f]{2}:[\dA-Fa-f]{2}:[\dA-Fa-f]{2}:[\dA-Fa-f]{2}:[\dA-Fa-f]{2}$/, "Please ensure that your token ID is correct!"),
              })}
              
              onSubmit={(values, actions) => {
                const vals = { ...values };
                actions.resetForm();
                fetch("https://ifs4205-gp02-1.comp.nus.edu.sg/token/add", {
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
                <TextField
                  name="nric"
                  autoComplete="off"
                  label="NRIC"
                  type="text"
                />

                <TextField
                  name="tokenID"
                  autoComplete="off"
                  label="Token ID"
                  type="text"
                />

                <ButtonGroup pt="1rem">
                  <Button mr={3} onClick={onCloseAddDialog}>
                    Cancel
                  </Button>
                  <Button colorScheme="teal" type="submit">
                    Add
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