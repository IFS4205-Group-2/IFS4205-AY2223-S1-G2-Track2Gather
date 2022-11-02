import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import React, { useRef, useState } from "react";

export default function CloseContactInformation() {

  let originalDataRef = useRef([]);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useState(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://ifs4205-gp02-1.comp.nus.edu.sg/tracing/contacts', {
          credentials: "include",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const { status_code, contacts } = await res.json();
        if (status_code === 0) {
          originalDataRef.current = contacts;
          setData(contacts);
          return;
        }
      } catch(e) {
        console.log(e);
        return;
      }
    }
    fetchData();
  }, [token]);
 
  const filterData = (target) => {
    const filteredData = originalDataRef.current.filter(row => row.name.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.email.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.contact_no.toLocaleLowerCase().includes(target.toLocaleLowerCase()) 
      || row.gender.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.tid.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.zipcode.toLocaleLowerCase().includes(target.toLocaleLowerCase()));

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
          marginBottom: 20,
        }}
      >
        <p>Search for:</p>
        <input
          type="text"
          onChange={(e) => filterData(e.target.value)}
          placeholder="Search"
          style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: 5,
            marginLeft: 20,
            paddingLeft: 10,
            paddingRight: 10,
            width: 350,
            height: 30,
          }}
        />
      </div>
      <TableContainer>
        <Table variant="simple" colorScheme={"facebook"}>
          <Thead>
            <Tr>
              <Th>
                Name
              </Th>
              <Th>
                Email
              </Th>
              <Th>
                Contact Number
              </Th>
              <Th>
                Gender
              </Th>
              <Th>
                Zip Code
              </Th>
              <Th>
                Token ID
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              data.map((item, index) => {
                return (
                  <Tr key={`${item.tokenID}-${index}`}>
                    <Td>{item.name}</Td>
                    <Td>{item.email}</Td>
                    <Td>{item.contact_no}</Td>
                    <Td>{item.gender}</Td>
                    <Td>{item.zipcode}</Td>
                    <Td>{item.tid}</Td>
  
                  </Tr>
                )
              })
            }
          
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
