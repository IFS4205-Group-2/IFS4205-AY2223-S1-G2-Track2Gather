import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Box, Center, CircularProgress, CircularProgressLabel, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

export default function PersonalStats() {
  const [data, setData] = useState({});
  const token = localStorage.getItem("token");

  useState(() => {
    async function fetchData() {
      try {
        const res = await fetch('http://172.25.76.159:4000/stats/user', {
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
          { data?.hasQuarantineStatus
            ? (
              <Center h='100%' color='red.400'>
                <WarningIcon boxSize={'30px'}/>
                <Text fontSize='md' fontWeight={'700'} marginLeft={'20px'} textAlign={'center'}>
                  You are required to isolate yourself until you
                  <br />
                  are fully recovered to prevent spread of virus!
                </Text>
              </Center>
            ) : (
              <Center h='100%' color='green.400'>
                <CheckCircleIcon boxSize={'30px'}/>
                <Text fontSize='md' fontWeight={'700'} marginLeft={'20px'} textAlign={'center'}>
                  You do not have any quarantine status!
                </Text>
              </Center>
            )
          }
        </Box>
        <Box 
          w={'49%'}
          minHeight={'225px'}
          borderWidth='1px'
          borderRadius='lg'
          overflow='hidden'
        >
          <Center h='100%' color='green.400'>
            <CircularProgress value={(data?.vaccinationHistory?.match(/\d+/g)[0] / 3) * 100} color='green.400'>
              <CircularProgressLabel>{(data?.vaccinationHistory?.match(/\d+/g)[0] / 3) * 100}%</CircularProgressLabel>
            </CircularProgress>
            <Text fontSize='md' fontWeight={'700'} marginLeft={'20px'}>
              You have taken {data?.vaccinationHistory?.match(/\d+/g)[0]} vaccination shot(s)!
              <br />
              {3 - data?.vaccinationHistory?.match(/\d+/g)[0]} more shot(s) before fully vaccinated.
            </Text>
          </Center>
        </Box>
      </Flex>
    </>
  );
}