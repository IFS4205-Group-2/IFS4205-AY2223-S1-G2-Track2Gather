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

export default function CloseContactInformation() {
  const { data: contacts, isSuccess } = useQuery(["contacts"], async () => {
    const res = await fetch("http://172.25.76.159:4000/tracing/contacts");
    const data = await res.json();
    return data;
  });
 
  const [data, setData] = useState([]);

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isSuccess) {
      setData(contacts);
    }
    return () => {};
  }, [isSuccess, contacts]);

  // codes for sort direction
  const [name, setInf1] = useState(0);
  const [email, setInf2] = useState(0);
  const [contact_no, setInf3] = useState(0);
  const [gender, setInf4] = useState(0);
  const [zipcode, setInf5] = useState(0);
  const [tid, setInf6] = useState(0);
 

  const getSortedData = (sortBy, val) => {
    if (!isSuccess) return [];
    const dataToSort = contacts.slice().sort((a, b) => {
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
  const filterData = (target) => {
    const filteredData = data.filter(row => row.name.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.email.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.contact_no.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.gender.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.tid.toLocaleLowerCase().includes(target.toLocaleLowerCase())
      || row.zipcode.toLocaleLowerCase().includes(target.toLocaleLowerCase()));
    if (filteredData.length === 0 || target === '') {
      setData(data);
      return;
    }
    setData(filteredData);
  };
  const filterTable = (e) => {
    if (!isSuccess) return [];
    let filterFunc = (item) => {
      if (
        item.name.indexOf(e) >=0 ||
        item.email.indexOf(e) >=0 ||
        item.contact_no.toString().indexOf(e) >=0 ||
        item.gender.indexOf(e) >=0 ||
        item?.tid?.toString().indexOf(e) >=0  ||
        item.zipcode.toString().indexOf(e) >=0 
        )
        return true;
    };

    let dataForState = data.filter((item) => filterFunc(item));
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
              <Th
                onClick={() => {
                  getSortedData("name", name);
                  setInf1(!name);
                }}
                style={{ cursor: "pointer" }}
              >
                Name
              </Th>
              <Th
                onClick={() => {
                  getSortedData("email", email);
                  setInf2(!email);
                }}
                style={{ cursor: "pointer" }}
              >
                Email
              </Th>
              <Th
                onClick={() => {
                  getSortedData("contact_no", contact_no);
                  setInf3(!contact_no);
                }}
                style={{ cursor: "pointer" }}
              >
                Contact Number
              </Th>
              <Th
                onClick={() => {
                  getSortedData("gender", gender);
                  setInf4(!gender);
                }}
                style={{ cursor: "pointer" }}
              >
                Gender
              </Th>
              <Th
                onClick={() => {
                  getSortedData("zipcode", zipcode);
                  setInf5(!zipcode);
                }}
                style={{ cursor: "pointer" }}
              >
                Zip Code
              </Th>
              <Th
                onClick={() => {
                  getSortedData("tid", tid);
                  setInf6(!tid);
                }}
                style={{ cursor: "pointer" }}
              >
                Token ID
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, i) => (
              <Tr key={i.toString()}>
                <Td>{item.name}</Td>
                <Td>{item.email}</Td>
                <Td>{item.contact_no}</Td>
                <Td>{item.gender}</Td>
                <Td>{item.zipcode}</Td>
                <Td>{item.tid}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
