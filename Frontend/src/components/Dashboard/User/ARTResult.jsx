import { Button, ButtonGroup, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

export default function ARTResult() {
  return (
    <>
      <TableContainer>
        <Table variant='simple' colorScheme={'facebook'}>
          <Thead>
            <Tr>
              <Th>Upload Timestamp</Th>
              <Th>Test Result</Th>
              <Th>Image Link</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>2020/12/11 09:12 AM</Td>
              <Td>Negative</Td>
              <Td><a href="https://www.google.com">https://www.google.com</a></Td>
            </Tr>
            <Tr>
              <Td>2021/05/12 08:20 PM</Td>
              <Td>Positive</Td>
              <Td><a href="https://www.apple.com">https://www.apple.com</a></Td>
            </Tr>
            <Tr>
              <Td>2021/05/13 11:47 AM</Td>
              <Td>Positive</Td>
              <Td><a href="https://www.tiktok.com">https://www.tiktok.com</a></Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <ButtonGroup pt="1rem" m={"20px 0"} w={"100%"} justifyContent={"center"}>
        <Button colorScheme="teal" type="button">
          Upload Test Result
        </Button>
      </ButtonGroup>
    </>
  );
}