import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import React, { useState } from "react";

const FetchedData = [
  {
    infectant1: "Alice",
    infectant2: " Bernard",
    time: "2020/12/11 09:12 AM",
  },
  {
    infectant1: "David",
    infectant2: "Claria",
    time: "2022/05/16 02:15 AM",
  },
  {
    infectant1: "Claria",
    infectant2: "David",
    time: "2021/07/13 09:12 PM",
  },
  {
    infectant1: "Claria",
    infectant2: "Emily",
    time: "2020/03/18 04:42 AM",
  },
  {
    infectant1: "Sandy",
    infectant2: "Bernard",
    time: "2021/01/14 09:15 AM",
  },
];
export default function TracingRecords() {
  const [data, setData] = useState(FetchedData);
  const [count, setCount] = useState(0);

  const getSortedData = (sortBy) => {
    let dataToSort = data;
    dataToSort.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      switch (typeof aVal) {
        case "string":
          return aVal.localeCompare(bVal);
        case "number":
          return aVal - bVal;
        default:
          throw new Error("Unsupported value to sort by");
      }
    });
    setCount(count + 1);
    setData(dataToSort);
  };

  const filterTable = (e) => {
    let filterFunc = (item) => {
      if (
        item.infectant1.indexOf(e) >= 0 ||
        item.infectant2.indexOf(e) >= 0 ||
        item.time.indexOf(e) >= 0
      )
        return true;
    };

    let dataForState = FetchedData.filter((item) => filterFunc(item));
    setData(dataForState);
  };
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
            height: 30
          }}
        />
      </div>
      <TableContainer>
        <Table variant="simple" colorScheme={"facebook"}>
          <Thead>
            <Tr>
              <Th
                onClick={() => getSortedData("infectant1")}
                style={{ cursor: "pointer" }}
              >
                Infectant 1
              </Th>
              <Th
                onClick={() => getSortedData("infectant2")}
                style={{ cursor: "pointer" }}
              >
                Infectant 2
              </Th>
              <Th
                onClick={() => getSortedData("time")}
                style={{ cursor: "pointer" }}
              >
                Time of Close Contact
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, i) => (
              <Tr key={i.toString()}>
                <Td>{item.infectant1}</Td>
                <Td>{item.infectant2}</Td>
                <Td>{item.time}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
