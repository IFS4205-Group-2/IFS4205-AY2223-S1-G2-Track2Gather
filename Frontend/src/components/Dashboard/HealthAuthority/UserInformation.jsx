import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import { useState, useRef } from "react";

const fetchedData = [
  {
    'nric': 'SXXXX123D',
    'name': 'Tan Boon Huat',
    'phoneNumber': '87616251',
    'homeAddress': 'Singapore',
    'email': 'team2@test.com',
    'role': 'Contact Tracer',
    'vaccinationStatus': '1st Booster',
    'status': 'Positive'
  },
  {
    'nric': 'TXXXX221X',
    'name': 'Lim Kai Heng',
    'phoneNumber': '91872811',
    'homeAddress': 'Aljunied',
    'email': 'kewen@test.com',
    'role': 'User',
    'vaccinationStatus': '1st Booster',
    'status': 'Positive'
  },
  {
    'nric': 'TXXXX999D',
    'name': 'Chua Chin Chan',
    'phoneNumber': '90127451',
    'homeAddress': 'One north',
    'email': 'google@test.com',
    'role': 'Contact Tracer',
    'vaccinationStatus': '2nd Shot',
    'status': 'Negative'
  },
  {
    'nric': 'SXXXX456A',
    'name': 'Loh Kean Ming',
    'phoneNumber': '89273651',
    'homeAddress': 'Kent Ridge',
    'email': 'test@test.com',
    'role': 'User',
    'vaccinationStatus': '1st Shot',
    'status': 'Quarantine'
  }
]

export default function UserInformation() {
  const { isOpen: showDeleteDialog, onOpen: onOpenDeleteDialog, onClose: onCloseDeleteDialog } = useDisclosure();
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

  const filterData = (target) => {
    const filteredData = data.filter(row => row.nric.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.name.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.status.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.vaccinationStatus.toLocaleLowerCase().includes(target.toLocaleLowerCase()));
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
              <Th>Full Name</Th>
              <Th>Contact Number</Th>
              <Th>Home Address</Th>
              <Th>Email Address</Th>
              <Th>Role</Th>
              <Th>Vaccination Status</Th>
              <Th>Status</Th>
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
                    <Td>{info.vaccinationStatus}</Td>
                    <Td>{info.status}</Td>
                    <Td>
                      <Button colorScheme="red" type="button" onClick={() => handleOnDelete(info.nric)}>Delete</Button>
                      <Button colorScheme="yellow" type="button" onClick={() => handleOnDelete(info.nric)} marginLeft={'5px'}>View</Button>
                      <Button colorScheme="teal" type="button" onClick={() => handleOnDelete(info.nric)} marginLeft={'5px'}>Update</Button>
                    </Td>
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
    </>
  );
}