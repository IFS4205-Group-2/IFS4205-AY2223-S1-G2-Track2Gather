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

export default function TracingRecords() {

  let originalDataRef = useRef([]);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useState(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://ifs4205-gp02-1.comp.nus.edu.sg/tracing/records', {
          credentials: "include",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const { status_code, records } = await res.json();
        if (status_code === 0) {
          originalDataRef.current = records;
          setData(records);
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
    const filteredData = originalDataRef.current.filter(row => row.tokenid1.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.time1.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.location1.toLocaleLowerCase().includes(target.toLocaleLowerCase()) 
      || row.tokenid2.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.time2.toLocaleLowerCase().includes(target.toLocaleLowerCase()));
    if (filteredData.length === 0 || target === '') {
      setData(originalDataRef.current);
      return;
    }
    setData(filteredData);
  }


  console.log(data);
  
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
          placeholder="Search for Infectants and Time..."
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
                Token ID
              </Th>
              <Th>
                 Time 
              </Th>
              <Th>
                Location
              </Th>
              <Th>
                Token ID 2
              </Th>
              <Th>
                Time 2
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              data.map((item, index) => {
                return (
                  <Tr key={`${item.tokenID}-${index}`}>
                    <Td>{item.tokenid1}</Td>
                    <Td>{item.time1}</Td>
                    <Td>{item.location1}</Td>
                    <Td>{item.tokenid2}</Td>
                    <Td>{item.time2}</Td>
  
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
