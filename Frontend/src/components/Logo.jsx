import { Box, Text } from "@chakra-ui/react"

export default function Logo({w, color}) {
  return (
    <Box w={w} color={color} minWidth="125px" >
      <Text fontSize="lg" fontWeight="bold">
        Track2Gather
      </Text>
    </Box>
  );
}