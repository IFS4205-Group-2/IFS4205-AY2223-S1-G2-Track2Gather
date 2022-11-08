import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, RadioGroup, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, VStack } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useRef, useState } from "react";
import * as Yup from "yup";
import TextField from "../../TextField";

export default function AccountManagement() {
  const { isOpen: showDeleteDialog, onOpen: onOpenDeleteDialog, onClose: onCloseDeleteDialog } = useDisclosure();
  const { isOpen: showAddDialog, onOpen: onOpenAddDialog, onClose: onCloseAddDialog } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState('');
  const cancelRef = useRef();
  const originalDataRef = useRef([]);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useState(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://ifs4205-gp02-1.comp.nus.edu.sg/user/infos', {
          credentials: "include",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const { status_code, userInfos } = await res.json();
        if (status_code === 0) {
          originalDataRef.current = userInfos;
          setData(userInfos);
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
    console.log(uid);
    onOpenDeleteDialog();
  }

  const handleOnDeleteConfirmation = () => {
    fetch("https://ifs4205-gp02-1.comp.nus.edu.sg/user/delete", {
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
      || row.role.toLocaleLowerCase().includes(target.toLocaleLowerCase()));
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
      <ButtonGroup pt="1rem" m={"0 0 10px 0"} w={"100%"} justifyContent={"right"}>
        <Button colorScheme="teal" type="button" onClick={handleOnAdd}>
          Add Account
        </Button>
      </ButtonGroup>
      <TableContainer>
        <Table variant='simple' colorScheme={'facebook'}>
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>NRIC</Th>
              <Th>Username</Th>
              <Th>Full Name</Th>
              <Th>Contact Number</Th>
              <Th>Home Address</Th>
              <Th>Postal Code</Th>
              <Th>Date of Birth</Th>
              <Th>Email Address</Th>
              <Th>Gender</Th>
              <Th>Role</Th>
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
                    <Td>{info.username}</Td>
                    <Td>{info.name}</Td>
                    <Td>{info.contact_no}</Td>
                    <Td>{info.address}</Td>
                    <Td>{info.zipcode}</Td>
                    <Td>{info.date_of_birth}</Td>
                    <Td>{info.email}</Td>
                    <Td>{info.gender}</Td>
                    <Td>{info.role}</Td>
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
              initialValues={{ name: "", nric: "", username: "", address: "", phoneno: "", email: "", password: "", gender: "", zipcode: "", dateOfBirth: "" }}
              validationSchema={Yup.object({
                nric: Yup.string()
                  .required("NRIC required!")
                  .min(9, "NRIC is too short!")
                  .max(9, "NRIC is too long!")
                  .matches(/^[STGF]{1}[\d]{7}[A-Z]{1}$/, "Please ensure that your NRIC is correct!"),
                name: Yup.string()
                  .required("Full name is required!")
                  .matches(/^[A-Za-z\d. -]{1,}$/, "Please ensure that you name is correct!"),
                username: Yup.string()
                  .required("Username is required!")
                  .min(6, "Username too short!")
                  .matches(/^[A-Za-z\d. -]{1,}$/, "Please ensure that you username is correct!"),
                address: Yup.string()
                  .required("Address required!")
                  .matches(/^[A-Za-z\d,. \-#()]{1,}$/, "Please ensure that your address is correct!"),
                zipcode: Yup.string()
                  .required("Postal code required!")
                  .matches(/^[\d]{6}$/, "Please ensure that your postal code is correct!"),
                phoneno: Yup.string()
                  .required("Phone number required!")
                  .matches(/^[\d]{8}$/, "Please ensure that your phone number is correct!"),
                email: Yup.string()
                  .required("Email address required!")
                  .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please ensure that your email address is correct!"),
                role: Yup.string()
                  .required("Role required!")
                  .matches(/^[234]{1}$/, "Please ensure that the chosen role is valid!"),
                gender: Yup.string()
                  .required("Gender required!")
                  .matches(/^Male|Female$/, "Please ensure that the chosen gender is valid!"),
                password: Yup.string()
                  .required("Password required!")
                  .min(12, "Password too short!")
                  .matches(/^(?=.*[0-9])(?=.*[- ?!@#$%^&*\/\\])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9- ?!@#$%^&*\/\\]{12,}$/, "Your password must contain at least one uppercase character, one lowercase character, one digit and one special character."),
              })}
              
              onSubmit={(values, actions) => {
                const vals = { ...values };
                actions.resetForm();
                fetch("https://ifs4205-gp02-1.comp.nus.edu.sg/user/add", {
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
                })
                .finally(() => {
                  window.location.reload();
                })
              }}>
              <VStack
                as={Form}
                w={'100%'}
                spacing="1rem"
              >
                <TextField
                  name="username"
                  autoComplete="off"
                  label="Username"
                  type="text"
                />

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
                  name="zipcode"
                  autoComplete="off"
                  label="Postal Code"
                  type="number"
                />

                <TextField
                  name="dateOfBirth"
                  autoComplete="off"
                  label="Date of Birth"
                  type="date"
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

                <RadioGroup name="gender" w={"100%"}>
                  <FormLabel>Gender</FormLabel>
                  <Stack>
                    <label>
                      <Field type="radio" name="gender" value="Male" />
                      <span style={{"padding-left": "10px"}}>Male</span>
                    </label>
                    <label>
                      <Field type="radio" name="gender" value="Female" />
                      <span style={{"padding-left": "10px"}}>Female</span>
                    </label>
                  </Stack>
                </RadioGroup>

                <RadioGroup name="role" w={"100%"}>
                  <FormLabel>Role</FormLabel>
                  <Stack>
                    <label>
                      <Field type="radio" name="role" value="3" />
                      <span style={{"padding-left": "10px"}}>Public User</span>
                    </label>
                    <label>
                      <Field type="radio" name="role" value="2" />
                      <span style={{"padding-left": "10px"}}>Contact Tracer</span>
                    </label>
                    <label>
                      <Field type="radio" name="role" value="4" />
                      <span style={{"padding-left": "10px"}}>Researcher</span>
                    </label>
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