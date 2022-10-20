import { useColorModeValue } from "@chakra-ui/react";
import { useState } from "react"
import Logo from "../Logo";
import NavContainer from "./NavContainer";
import NavLink from "./NavLink";
import NavToggle from "./NavToggle";

export default function NavBar(props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const logoColor = useColorModeValue('black', 'white');

  return (
    <NavContainer {...props} padding="22px 75px 22px 32px">
      <>
        <Logo
          w="100px"
          color={logoColor}
        />
        <NavToggle toggle={toggle} isOpen={isOpen} />
        <NavLink isOpen={isOpen} />
      </>
    </NavContainer>
  )
}