import { Button, ButtonGroup, Text, Heading, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import { AccountContext } from "../AccountContext";
import * as Yup from "yup";
import TextField from "../TextField";
import ResearcherCSV from "../ResearcherCSV";
import { JSEncrypt } from "jsencrypt";

const Login = () => {
  const { setUser } = useContext(AccountContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const encrypt = new JSEncrypt();  

  const publicKey = `-----BEGIN PUBLIC KEY-----
  MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA0erjMYWiedDlOG5dVoxs
  8v59e5cW4mtkHsYhcc+XkMDNbWh66+34hI5ZZxmQdi+rANAaA/Ho4WaIGVTmInSr
  oo5JWQ0I/bpBHfA0tD2VYALI5mwTQrbSKGT/2H4xRs49GlhY0NJ02+wVSq2Ks21+
  R8+aAoDiQdP0ZrKAqaEmNCZufYDIK81PEHSlOYoXpyy9OBzWD143rEr5jq8oQXXH
  ZZXhUPfDmSzpb7DvF0jiOl36HfmX08xojzJ2lX/LRObAVYNQrbMxfUPQlLST2+lz
  GsqsfQQMJgtCP3WsZehI2kKrb8M0bZCvrplJ4K3GYUDgU9AqGdSdy2QjP1NfGVUM
  5jOEgBRDLuEicmCuNCddhRGkYNt4XnV6dzgWj2/Z/lqYv0IJvygA/wC8UqQakuYj
  bhTET72ApPOfHC4Wc4vRN3jx8ViOPaN/SOJ9vdhlw5n0AXWPTGyQ+JeEtLp/sxsd
  sNWe+pBQ+RWUG2S1qqzMaBFG9lwK9wLrqQoyRkqwtmjw1MFW3hdDJXvOEv7BCdd4
  eKfYQqT4KjU2Eh+LLi6qdbE6uOsfUEKDUxW0fdtIuvPsDpunX6swLSju0dAjhhT1
  hcgyFwHB3bq0srrk7IilLF9DyLKaDi8mZA2VOf1myxCorbIVSHChnvgiDljTNLib
  +/UymJN/9kenYk2whVu9nhMCAwEAAQ==
  -----END PUBLIC KEY-----`;


  return (
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={Yup.object({
          username: Yup.string()
            .required("Username required!")
            .min(6, "Username too short!"),
          password: Yup.string()
            .required("Password required!")
            .min(6, "Password too short!"),
        })}
      
        onSubmit={(values, actions) => {
          const vals = { ...values };
          
          //encrypt values submitted
          encrypt.setPublicKey(publicKey);
          //console.log(encrypted);

          actions.resetForm();
          fetch("http://localhost:4000/auth/login", { //to be changed
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              {
                "username": encrypt.encrypt(vals.username),
                "password": encrypt.encrypt(vals.password)
            })
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
              setUser({ ...data });
              if (data.status) {
                setError(data.status);
              } else if (data.loggedIn) {
                localStorage.setItem("token", data.token);
                navigate("/home");
              }
            });
        }}
      >
        <VStack
          as={Form}
          w={{ base: "90%", md: "500px" }}
          m="auto"
          justify="center"
          h="100vh"
          spacing="1rem"
        >
          <Heading>Log In</Heading>
          <Text as="p" color="red.500">
            {error}
          </Text>
          <TextField
            name="username"
            placeholder="Enter username"
            autoComplete="off"
            label="Username"
          />

          <TextField
            name="password"
            placeholder="Enter password"
            autoComplete="off"
            label="Password"
            type="password"
          />

          <ButtonGroup pt="1rem">
            <Button colorScheme="teal" type="submit">
              Log In
            </Button>
            <Button onClick={() => navigate("/register")}>
              Create Account
            </Button>
          </ButtonGroup>
          <ResearcherCSV />
        </VStack>
       
        
      </Formik>
  );
};

export default Login;