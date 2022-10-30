import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";


export default function ContactTracerOverview() {
  const [data, setData] = useState({});
  const token = localStorage.getItem("token");

  useState(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://ifs4205-gp02-1.comp.nus.edu.sg/stats/contacttracer', {
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

  return (
    <>
      <Flex justifyContent={'space-between'}>
        <Box 
          w={'49%'}
          minHeight={'225px'}
          borderWidth='1px'
          borderRadius='lg'
          overflow='hidden'
        >
          <Center h='100%' color='red.400'>
            <Text fontSize='32px' fontWeight={'700'} marginLeft={'20px'} textAlign={'center'}>
              {data.totalCases || '0'}
            </Text>
            <Text fontSize='md' fontWeight={'500'} marginLeft={'20px'} textAlign={'center'}>
              Total Active Cases
            </Text>
          </Center>
        </Box>
        <Box 
          w={'49%'}
          minHeight={'225px'}
          borderWidth='1px'
          borderRadius='lg'
          overflow='hidden'
        >
          <Center h='100%' color='green.400'>
            <Text fontSize='32px' fontWeight={'700'} marginLeft={'20px'} textAlign={'center'}>
              {data.closeCases || '0'}
            </Text>
            <Text fontSize='md' fontWeight={'500'} marginLeft={'20px'} textAlign={'center'}>
              Close Contacts 
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
      
      </Box>
    </>
  );
}