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
    const res = await fetch("http://172.25.76.159:4000/tracing/records");
    const data = await res.json();
    return data;
  });
  console.log(records);
  const [data, setData] = useState([]);

 

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isSuccess) {
      setData(records);
    }

    return () => {};
  }, [isSuccess, records]);

  // codes for sort direction
  const [inf1, setInf1] = useState(0);
  const [inf2, setInf2] = useState(0);
  const [inf3, setInf3] = useState(0);

  const getSortedData = (sortBy, val) => {
    if (!isSuccess) return [];
    const dataToSort = records.slice().sort((a, b) => {
      // let dataToSort = data;
      // dataToSort.sort((a, b) => {
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
        item.inf1.indexOf(e) >= 0 ||
        item.inf2.indexOf(e) >= 0 ||
        item.inf3.indexOf(e) >= 0
      )
        return true;
    };

    let dataForState = records.filter((item) => filterFunc(item));
    setData(dataForState);
  };

  // useEffect(() => {}, [inf1, inf2, inf3]);
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
                  getSortedData("inf1", inf1);
                  setInf1(!inf1);
                }}
                style={{ cursor: "pointer" }}
              >
                Infectant 1
              </Th>
              <Th
                onClick={() => {
                  getSortedData("inf2", inf2);
                  setInf2(!inf2);
                }}
                style={{ cursor: "pointer" }}
              >
                Infectant 2
              </Th>
              <Th
                onClick={() => {
                  getSortedData("inf3", inf3);
                  setInf3(!inf3);
                }}
                style={{ cursor: "pointer" }}
              >
                Time of Close Contact
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, i) => (
              <Tr key={i.toString()}>
                <Td>{item.inf1}</Td>
                <Td>{item.inf2}</Td>
                <Td>{item.inf3}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
