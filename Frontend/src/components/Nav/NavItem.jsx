import { Link, Text, useColorModeValue } from "@chakra-ui/react";

export default function NavItem({ children, to = "/", ...rest }) {
  const navItemColor = useColorModeValue("black", "white");
  return (
    <Link href={to} style={{ textDecoration: 'none', fontWeight: 700 }}>
      <Text display="block" color={navItemColor}>
        {children}
      </Text>
    </Link>
  )
}