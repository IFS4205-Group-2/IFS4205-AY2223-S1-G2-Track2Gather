import { Button, ButtonGroup, Heading, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import TextField from "../../TextField";
import * as Yup from "yup";
import { useState } from "react";

export default function PersonalInfoForm() {
  const [showEdit, setShowEdit] = useState(true);

  return (
    <Formik
      initialValues={{ name: "Lok Ke Wen", nric: "*****563D", address: "50 Tuas Ave 11 #03-38 Tuas Lot S(639107)", phoneno: "87651289", email: "kewen@test.com", password: "heello W0rkd!" }}
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
        fetch("http://localhost:4000/user/update", {
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
        <Heading>Your Particulars</Heading>
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
          disabled={showEdit}
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
  );
}