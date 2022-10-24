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
import { useQuery } from "@tanstack/react-query";

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
  const { data: records, isSuccess } = useQuery(["records"], async () => {
    const res = await fetch("http://localhost:4000/tracing/records");
    const data = await res.json();
    return data;
  });

  useEffect(() => {
    if (isSuccess) {
      setData(records);
    }

    return () => {};
  }, [isSuccess, records]);

  const [data, setData] = useState([]);
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


  return (
    <>
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
