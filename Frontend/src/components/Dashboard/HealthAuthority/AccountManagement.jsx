import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useState, useRef } from "react";
import * as Yup from "yup";
import TextField from "../../TextField";

const fetchedData = [
  {
    'nric': 'SXXXX123D',
    'name': 'Tan Boon Huat',
    'phoneNumber': '87616251',
    'homeAddress': 'Singapore',
    'email': 'team2@test.com',
    'role': 'Contact Tracer',
    'creationDate': '2020/07/05'
  },
  {
    'nric': 'TXXXX221X',
    'name': 'Lim Kai Heng',
    'phoneNumber': '91872811',
    'homeAddress': 'Aljunied',
    'email': 'kewen@test.com',
    'role': 'User',
    'creationDate': '2020/07/08'
  },
  {
    'nric': 'TXXXX999D',
    'name': 'Chua Chin Chan',
    'phoneNumber': '90127451',
    'homeAddress': 'One north',
    'email': 'google@test.com',
    'role': 'Contact Tracer',
    'creationDate': '2020/07/09'
  },
  {
    'nric': 'SXXXX456A',
    'name': 'Loh Kean Ming',
    'phoneNumber': '89273651',
    'homeAddress': 'Kent Ridge',
    'email': 'test@test.com',
    'role': 'User',
    'creationDate': '2020/07/10'
  }
]

export default function AccountManagement() {
  const { isOpen: showDeleteDialog, onOpen: onOpenDeleteDialog, onClose: onCloseDeleteDialog } = useDisclosure();
  const { isOpen: showAddDialog, onOpen: onOpenAddDialog, onClose: onCloseAddDialog } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState('');
  const cancelRef = useRef();
  const [data, setData] = useState(fetchedData || []);

  const handleOnDelete = (nric) => {
    setSelectedUser(nric);
    onOpenDeleteDialog();
  }

  const handleOnDeleteConfirmation = () => {
    // Post delete result to backend
    console.log(selectedUser);
    onCloseDeleteDialog();
    window.location.reload(false);
  }

  const handleOnAdd = () => {
    onOpenAddDialog();
  }

  const filterData = (target) => {
    const filteredData = data.filter(row => row.nric.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.name.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.role.toLocaleLowerCase().includes(target.toLocaleLowerCase()));
    if (filteredData.length === 0 || target === '') {
      setData(fetchedData);
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
          placeholder="Search for user or role..."
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
      <TableContainer>
        <ButtonGroup pt="1rem" m={"0 0 10px 0"} w={"100%"} justifyContent={"right"}>
          <Button colorScheme="teal" type="button" onClick={handleOnAdd}>
            Add Account
          </Button>
        </ButtonGroup>
        <Table variant='simple' colorScheme={'facebook'}>
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>NRIC</Th>
              <Th>Full Name</Th>
              <Th>Contact Number</Th>
              <Th>Home Address</Th>
              <Th>Email Address</Th>
              <Th>Role</Th>
              <Th>Creation Date</Th>
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
                    <Td>{info.phoneNumber}</Td>
                    <Td>{info.homeAddress}</Td>
                    <Td>{info.email}</Td>
                    <Td>{info.role}</Td>
                    <Td>{info.creationDate}</Td>
                    <Td><Button colorScheme="red" type="button" onClick={() => handleOnDelete(info.nric)}>Delete</Button></Td>
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
              Delete Account
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
          <ModalHeader>Add a new account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ name: "", nric: "", address: "", phoneno: "", email: "", password: "", role: "" }}
              validationSchema={Yup.object({
                username: Yup.string()
                  .required("Username required!")
                  .min(6, "Username too short!"),
                password: Yup.string()
                  .required("Password required!")
                  .min(12, "Password too short!"),
              })}
              
              onSubmit={(values, actions) => {
                const vals = { ...values };
                actions.resetForm();
                fetch("http://localhost:4000/user/add", {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
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
                }}>
              <VStack
                as={Form}
                w={'100%'}
                spacing="1rem"
              >
                <TextField
                  name="name"
                  autoComplete="off"
                  label="Full Name"
                  type="text"
                />

                <TextField
                  name="nric"
                  autoComplete="off"
                  label="NRIC"
                  type="text"
                />

                <TextField
                  name="address"
                  autoComplete="off"
                  label="Home Address"
                  type="text"
                />

                <TextField
                  name="phoneno"
                  autoComplete="off"
                  label="Phone Number"
                  type="text"
                />

                <TextField
                  name="email"
                  autoComplete="off"
                  label="Email Address"
                  type="email"
                />

                <RadioGroup name="role" w={"100%"}>
                  <FormLabel>Role</FormLabel>
                  <Stack>
                    <Radio value={"User"}>User</Radio>
                    <Radio value={"Contact Tracer"}>Contact Tracer</Radio>
                  </Stack>
                </RadioGroup>

                <TextField
                  name="password"
                  autoComplete="off"
                  label="Password"
                  type="password"
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