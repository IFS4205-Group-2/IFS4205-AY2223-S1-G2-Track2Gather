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
  
  export default function ResearcherData() {
  
    let originalDataRef = useRef([]);
    const [data, setData] = useState([]);
    const token = localStorage.getItem("token");
  
    useState(() => {
      async function fetchData() {
        try {
          const res = await fetch('https://ifs4205-gp02-1.comp.nus.edu.sg/researcher/research', {
            credentials: "include",
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
          const { status_code, records } = await res.json();
          if (status_code === 0) {
            originalDataRef.current = research;
            setData(research);
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
      const filteredData = originalDataRef.current.filter(row => row.gender.toLocaleLowerCase().includes(target.toLocaleLowerCase())
        || row.birthday.toLocaleLowerCase().includes(target.toLocaleLowerCase())
        || row.postal.toLocaleLowerCase().includes(target.toLocaleLowerCase()) 
        || row.vaccination.toLocaleLowerCase().includes(target.toLocaleLowerCase())
        || row.testresult.toLocaleLowerCase().includes(target.toLocaleLowerCase()));
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
                  Gender
                </Th>
                <Th>
                   Birthday 
                </Th>
                <Th>
                  Postal Code
                </Th>
                <Th>
                  Vaccination
                </Th>
                <Th>
                  Test Result
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                data.map((item, index) => {
                  return (
                    <Tr key={`${item.tokenID}-${index}`}>
                      <Td>{item.gender}</Td>
                      <Td>{item.birthday}</Td>
                      <Td>{item.postal}</Td>
                      <Td>{item.vaccination}</Td>
                      <Td>{item.testresult}</Td>
    
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
  