import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";

import React, { useState } from "react";

const FetchedData = [
  {
    infectant: "Alice",
    contactNumber: "92030886"
  },
  {
    infectant: "David",
    contactNumber: "91114265"
  },
  {
    infectant: "Claira",
    contactNumber: "81231454"
  },
  {
    infectant: "Sandy",
    contactNumber: "90329412"
  },
  {
    infectant: "Emily",
    contactNumber: "87241234"
  },
];
export default function CloseContactInformation() {
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
        item.infectant.indexOf(e) >= 0 ||
        item.contactNumber.indexOf(e) >= 0
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
          placeholder="Search for Infectant or Contact..."
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
                onClick={() => getSortedData("infectant")}
                style={{ cursor: "pointer" }}
              >
                Infectant 
              </Th>
              <Th
                onClick={() => getSortedData("contactNumber")}
                style={{ cursor: "pointer" }}
              >
                Contact Number
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, i) => (
              <Tr key={i.toString()}>
                <Td>{item.infectant}</Td>
                <Td>{item.contactNumber}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
