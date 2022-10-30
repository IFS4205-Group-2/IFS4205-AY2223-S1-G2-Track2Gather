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
import React, { useEffect, useState } from "react";

export default function TracingRecords() {
  const { data: records, isSuccess } = useQuery(["records"], async () => {
    const res = await fetch("https://ifs4205-gp02-1.comp.nus.edu.sg/tracing/records");
    const data = await res.json();
    return data;
  });
 
  const [data, setData] = useState([]);

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isSuccess) {
      setData(records);
    }
    return () => {};
  }, [isSuccess, records]);

  // codes for sort direction
  const [tokenid1, setInf1] = useState(0);
  const [time1, setInf2] = useState(0);
  const [location1, setInf3] = useState(0);
  const [tokenid2, setInf4] = useState(0);
  const [time2, setInf5] = useState(0);
 


  const getSortedData = (sortBy, val) => {
    if (!isSuccess) return [];
    const dataToSort = records.slice().sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      switch (typeof aVal) {
        case "string":
          return val ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        case "number":
          return val ? aVal - bVal : bVal - aVal;
        default:
          throw new Error("Unsupported value to sort by");
      }
    });
    setCount(count + 1);
    setData(dataToSort);
  };

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
              <Th
                onClick={() => {
                  getSortedData("tokenid1", tokenid1);
                  setInf1(!tokenid1);
                }}
                style={{ cursor: "pointer" }}
              >
                Token ID
              </Th>
              <Th
                onClick={() => {
                  getSortedData("time1", time1);
                  setInf2(!time1);
                }}
                style={{ cursor: "pointer" }}
              >
                Time 
              </Th>
              <Th
                onClick={() => {
                  getSortedData("location1", location1);
                  setInf3(!location1);
                }}
                style={{ cursor: "pointer" }}
              >
                Location
              </Th>
              <Th
                onClick={() => {
                  getSortedData("tokenid2", tokenid2);
                  setInf4(!tokenid2);
                }}
                style={{ cursor: "pointer" }}
              >
                Token ID 2
              </Th>
              <Th
                onClick={() => {
                  getSortedData("time2", time2);
                  setInf5(!time2);
                }}
                style={{ cursor: "pointer" }}
              >
                Time 2
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, i) => (
              <Tr key={i.toString()}>
                <Td>{item.tokenid1}</Td>
                <Td>{item.time1}</Td>
                <Td>{item.location1}</Td>
                <Td>{item.tokenid2}</Td>
                <Td>{item.time2}</Td>
                
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
