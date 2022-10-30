import { Button, ButtonGroup, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, RadioGroup, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, VStack } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useRef, useState } from "react";
import * as Yup from "yup";
import TextField from "../../TextField";

export default function UserInformation() {
  const { isOpen: showUpdateDialog, onOpen: onOpenUpdateDialog, onClose: onCloseUpdateDialog } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEdit, setShowEdit] = useState(true);
  const originalDataRef = useRef([]);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useState(() => {
    async function fetchData() {
      try {
        const res = await fetch('http://172.25.76.159:4000/user/infos', {
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

  const handleOnUpdate = (index) => {
    setSelectedUser(index);
    onOpenUpdateDialog();
  }

  const filterData = (target) => {
    const filteredData = originalDataRef.current.filter(row => row.nric.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.name.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.recent_test_result.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.vaccination_history.toLocaleLowerCase().includes(target.toLocaleLowerCase()));
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
          placeholder="Search for user or status..."
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
        <Table variant='simple' colorScheme={'facebook'}>
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>NRIC</Th>
              <Th>Username</Th>
              <Th>Full Name</Th>
              <Th>Contact Number</Th>
              <Th>Home Address</Th>
              <Th>Email Address</Th>
              <Th>Gender</Th>
              <Th>Role</Th>
              <Th>Vaccination Status</Th>
              <Th>Test Result</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              data.map((info, index) => {
                return (
                  <Tr key={`${info.uid}-${index}`}>
                    <Td>{index + 1}</Td>
                    <Td>{info.nric}</Td>
                    <Td>{info.username}</Td>
                    <Td>{info.name}</Td>
                    <Td>{info.contact_no}</Td>
                    <Td>{info.address}</Td>
                    <Td>{info.email}</Td>
                    <Td>{info.gender}</Td>
                    <Td>{info.role}</Td>
                    <Td>{info.vaccination_history || 'No history'}</Td>
                    <Td>{info.recent_test_result || 'No results'}</Td>
                    <Td>
                      <Button colorScheme="teal" type="button" onClick={() => handleOnUpdate(index)} marginLeft={'5px'}>Update</Button>
                    </Td>
                  </Tr>
                )
              })
            }
          </Tbody>
        </Table>
      </TableContainer>
      { selectedUser != null
        ? <Modal
            onClose={onCloseUpdateDialog}
            isOpen={showUpdateDialog}
            motionPreset='slideInBottom'
            size={'xl'}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add a new account</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Formik
                  initialValues={{ 
                    name: originalDataRef.current[selectedUser].name,
                    username: originalDataRef.current[selectedUser].username,
                    nric: originalDataRef.current[selectedUser].nric,
                    address: originalDataRef.current[selectedUser].address,
                    phoneno: originalDataRef.current[selectedUser].contact_no,
                    email: originalDataRef.current[selectedUser].email,
                    password: "",
                    gender: originalDataRef.current[selectedUser].gender,
                    role: originalDataRef.current[selectedUser].rid,
                    vaccinationhistory: originalDataRef.current[selectedUser].vaccination_history,
                    testresult: originalDataRef.current[selectedUser].recent_test_result,
                  }}
                  validationSchema={Yup.object({
                    name: Yup.string()
                      .required("Full name is required!")
                      .matches(/^[A-Za-z\d. -]{1,}$/, "Please ensure that you name is correct!"),
                    address: Yup.string()
                      .required("Address required!")
                      .matches(/^[A-Za-z\d,. \-#()]{1,}$/, "Please ensure that your address is correct!"),
                    phoneno: Yup.string()
                      .required("Phone number required!")
                      .matches(/^[\d]{8}$/, "Please ensure that your phone number is correct!"),
                    email: Yup.string()
                      .required("Email address required!")
                      .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please ensure that your email address is correct!"),
                    role: Yup.string()
                      .required("Role required!")
                      .matches(/^[23]{1}$/, "Please ensure that the chosen role is valid!"),
                    gender: Yup.string()
                      .required("Gender required!")
                      .matches(/^Male|Female$/, "Please ensure that the chosen gender is valid!"),
                    password: Yup.string()
                      .min(12, "Password too short!")
                      .matches(/[A-Z]/, "Your password must contain at least one uppercase character.")
                      .matches(/[a-z]/, "Your password must contain at least one lowercase character.")
                      .matches(/[\d]/, "Your password must contain at least one digit.")
                      .matches(/[$-/:-?{-~!"^_`[\]#]/, "Your password must contain at least one special character."),
                    vaccinationhistory: Yup.string()
                      .matches(/^[A-Za-z\d\-+=!@#$()/|[\]{},.\s]{0,}$/, "Your input contains illegal characters!"),
                    testresult: Yup.string()
                      .required("Test result required!")
                      .matches(/^positive|negative|No test results$/, "Please ensure that the chosen test result is valid!"),
                  })}
                  
                  onSubmit={(values, actions) => {
                    const vals = { ...values, uid: originalDataRef.current[selectedUser].uid };
                    actions.resetForm();
                    fetch("http://172.25.76.159:4000/user/admin/update", {
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
                      disabled={true}
                    />

                    <TextField
                      name="name"
                      autoComplete="off"
                      label="Full Name"
                      type="text"
                      disabled={showEdit}
                    />

                    <TextField
                      name="nric"
                      autoComplete="off"
                      label="NRIC"
                      type="text"
                      disabled={true}
                    />

                    <TextField
                      name="address"
                      autoComplete="off"
                      label="Home Address"
                      type="text"
                      disabled={showEdit}
                    />

                    <TextField
                      name="phoneno"
                      autoComplete="off"
                      label="Phone Number"
                      type="text"
                      disabled={showEdit}
                    />

                    <TextField
                      name="email"
                      autoComplete="off"
                      label="Email Address"
                      type="email"
                      disabled={showEdit}
                    />

                    <RadioGroup name="gender" w={"100%"}>
                      <FormLabel>Gender</FormLabel>
                      <Stack>
                        <label>
                          <Field type="radio" name="gender" value="Male" disabled={showEdit}/>
                          <span style={{"padding-left": "10px"}}>Male</span>
                        </label>
                        <label>
                          <Field type="radio" name="gender" value="Female" disabled={showEdit}/>
                          <span style={{"padding-left": "10px"}}>Female</span>
                        </label>
                      </Stack>
                    </RadioGroup>

                    <RadioGroup name="role" w={"100%"}>
                      <FormLabel>Role</FormLabel>
                      <Stack>
                        <label>
                          <Field type="radio" name="role" value="3" disabled={showEdit}/>
                          <span style={{"padding-left": "10px"}}>Public User</span>
                        </label>
                        <label>
                          <Field type="radio" name="role" value="2" disabled={showEdit}/>
                          <span style={{"padding-left": "10px"}}>Contact Tracer</span>
                        </label>
                      </Stack>
                    </RadioGroup>

                    <TextField
                      name="vaccinationhistory"
                      autoComplete="off"
                      label="Vaccination Status"
                      type="text"
                      disabled={showEdit}
                    />

                    <RadioGroup name="testresult" w={"100%"}>
                      <FormLabel>Test Result</FormLabel>
                      <Stack>
                        <label>
                          <Field type="radio" name="testresult" value="positive" disabled={showEdit}/>
                          <span style={{"padding-left": "10px"}}>Positive</span>
                        </label>
                        <label>
                          <Field type="radio" name="testresult" value="negative" disabled={showEdit}/>
                          <span style={{"padding-left": "10px"}}>Negative</span>
                        </label>
                        <label>
                          <Field type="radio" name="testresult" value="No test results" disabled={showEdit}/>
                          <span style={{"padding-left": "10px"}}>No test results</span>
                        </label>
                      </Stack>
                    </RadioGroup>

                    <TextField
                      name="password"
                      autoComplete="off"
                      label="Password"
                      type="password"
                      disabled={showEdit}
                    />

                    <ButtonGroup pt="1rem">
                      <Button colorScheme="teal" type="button" display={showEdit ? 'block' : 'none'} onClick={() => setShowEdit(false)}>
                        Edit
                      </Button>
                      <Button colorScheme="red" type="button" display={showEdit ? 'none' : 'block'} onClick={() => setShowEdit(true)}>
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
        : null
      }
    </>
  );
}