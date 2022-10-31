import { Button, ButtonGroup, Heading, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import TextField from "../../TextField";
import * as Yup from "yup";
import { useEffect, useState } from "react";

export default function PersonalInfoForm() {
  const [showEdit, setShowEdit] = useState(true);
  const token = localStorage.getItem("token");
  const [userInfo, setUserInfo] = useState({});
  
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://ifs4205-gp02-1.comp.nus.edu.sg/user/info', {
          credentials: "include",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const { status_code, ...data } = await res.json();
        if (status_code === 0) {
          setUserInfo(data);
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
    <Formik
      enableReinitialize
      initialValues={{ name: userInfo.name, nric: userInfo.nric, address: userInfo.address, zipcode: userInfo.zipcode, phoneno: userInfo.contact_no, email: userInfo.email }}
      validationSchema={Yup.object({
        nric: Yup.string()
          .required("NRIC required!")
          .min(9, "NRIC is too short!")
          .max(9, "NRIC is too long!")
          .matches(/^[*]{5}[\d]{3}[A-Za-z]{1}$/, "Please ensure that your NRIC is correct!"),
        name: Yup.string()
          .required("Full name is required!")
          .matches(/^[A-Za-z\d. -]{1,}$/, "Please ensure that you name is correct!"),
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
          .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please ensure that your email address is correct!")
      })}
      
      onSubmit={(values, actions) => {
        const vals = { ...values };
        actions.resetForm();
        fetch("https://ifs4205-gp02-1.comp.nus.edu.sg/user/update", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(vals),
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
          name="zipcode"
          autoComplete="off"
          label="Postal Code"
          type="number"
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