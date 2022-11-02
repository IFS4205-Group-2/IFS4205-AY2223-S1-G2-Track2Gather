import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";

export default function TracingRecords() {
  const cancelRef = useRef();
  let originalDataRef = useRef([]);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useState(() => {
    async function fetchData() {
      try {
        const res = await fetch(fetch("https://ifs4205-gp02-1.comp.nus.edu.sg/tracing/records"), {
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


  const filterTable = (e) => {
    if (!isSuccess) return [];
    let filterFunc = (item) => {
      if (
        item?.tokenid1?.toString().indexOf(e) >= 0 ||
        item.time1.toString().indexOf(e) >= 0 ||
        item.location1.indexOf(e) >=0 ||
        item?.tokenid2?.toString().indexOf(e) >= 0 ||
        item.time2.toString().indexOf(e) >= 0 
        
      )
        return true;
    };

    let dataForState = records.filter((item) => filterFunc(item));
    if(dataForState.length === 0 || dataForState === ''){
      setData(data);
      return;
    }
    setData(dataForState);
  };

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
          onChange={(e) => filterTable(e.target.value)}
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
              data.map((info, index) => {
                return (
                  <Tr key={`${info.tokenID}-${index}`}>
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
