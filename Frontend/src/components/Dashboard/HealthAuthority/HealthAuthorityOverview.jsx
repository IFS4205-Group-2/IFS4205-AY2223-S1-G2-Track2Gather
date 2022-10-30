import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import CytoscapeComponent from 'react-cytoscapejs';

export default function HealthAuthorityOverview() {
  const [data, setData] = useState({});
  const token = localStorage.getItem("token");

  useState(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://ifs4205-gp02-1.comp.nus.edu.sg/stats/healthauthority', {
          credentials: "include",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const { status_code, statistics } = await res.json();
        if (status_code === 0) {
          setData(statistics);
          return;
        }
      } catch(e) {
        console.log(e);
        return;
      }
    }
    fetchData();
  }, [token]);
  
  const elements = [
    { data: { id: 'one', label: 'Alice' } },
    { data: { id: 'two', label: 'Bernard' } },
    { data: { id: 'three', label: 'Claira' } },
    { data: { id: 'four', label: 'David' } },
    { data: { id: 'five', label: 'Emily' } },
    { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } },
    { data: { source: 'one', target: 'three', label: 'Edge from Node1 to Node3' } },
    { data: { source: 'two', target: 'three', label: 'Edge from Node2 to Node3' } },
    { data: { source: 'three', target: 'four', label: 'Edge from Node3 to Node4' } },
    { data: { source: 'three', target: 'five', label: 'Edge from Node3 to Node5' } }
  ];

  return (
    <>
      <Flex justifyContent={'space-between'}>
        <Box 
          w={'32%'}
          minHeight={'225px'}
          borderWidth='1px'
          borderRadius='lg'
          overflow='hidden'
        >
          <Center h='100%' color='red.400'>
            <Text fontSize='32px' fontWeight={'700'} marginLeft={'20px'} textAlign={'center'}>
              {data.activeCases || '0'}
            </Text>
            <Text fontSize='md' fontWeight={'500'} marginLeft={'20px'} textAlign={'center'}>
              Current Active Cases
            </Text>
          </Center>
        </Box>
        <Box 
          w={'32%'}
          minHeight={'225px'}
          borderWidth='1px'
          borderRadius='lg'
          overflow='hidden'
        >
          <Center h='100%' color='green.400'>
            <Text fontSize='32px' fontWeight={'700'} marginLeft={'20px'} textAlign={'center'}>
              {data.recoveredCount || '0'}
            </Text>
            <Text fontSize='md' fontWeight={'500'} marginLeft={'20px'} textAlign={'center'}>
              Total Recovery
            </Text>
          </Center>
        </Box>
        <Box 
          w={'32%'}
          minHeight={'225px'}
          borderWidth='1px'
          borderRadius='lg'
          overflow='hidden'
        >
          <Center h='100%' color='blue.400'>
            <Text fontSize='32px' fontWeight={'700'} marginLeft={'20px'} textAlign={'center'}>
              {data.tokensIssued || '0'}
            </Text>
            <Text fontSize='md' fontWeight={'500'} marginLeft={'20px'} textAlign={'center'}>
              Tokens Issued
            </Text>
          </Center>
        </Box>
      </Flex>
      <Box
        w={'100%'}
        minHeight='400px'
        marginTop='10px'
        borderWidth='1px'
        borderRadius='lg'
      >
        <CytoscapeComponent
          elements={elements}
          style={{ width: '100%', height: '400px' }}
          layout={{ name: 'grid', fit: true }}
        />
      </Box>
    </>
  );
}