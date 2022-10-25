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
  const { data: records, isSuccess } = useQuery(["records"], async () => {
    const res = await fetch("http://localhost:4000/tracing/records");
    const data = await res.json();
    return data;
  });
  const [data, setData] = useState([]);

  // const [data, setData] = useState(FetchedData);

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
        item.infectant1.indexOf(e) >= 0 ||
        item.infectant2.indexOf(e) >= 0 ||
        item.time.indexOf(e) >= 0
      )
        return true;
    };

    let dataForState = FetchedData.filter((item) => filterFunc(item));
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
                  getSortedData("infectant1", inf1);
                  setInf1(!inf1);
                }}
                style={{ cursor: "pointer" }}
              >
                Infectant 1
              </Th>
              <Th
                onClick={() => {
                  getSortedData("infectant2", inf2);
                  setInf2(!inf2);
                }}
                style={{ cursor: "pointer" }}
              >
                Infectant 2
              </Th>
              <Th
                onClick={() => {
                  getSortedData("time", inf3);
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
                <Td>{item.closecontactuid}</Td>
                <Td>{item.uid}</Td>
                <Td>{item.time}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
