import { CheckCircleIcon } from "@chakra-ui/icons";
import { Box, Center, CircularProgress, CircularProgressLabel, Flex, Text } from "@chakra-ui/react";
import CytoscapeComponent from 'react-cytoscapejs';

export default function PersonalStats() {
  const elements = [
    { data: { id: 'one', label: 'Ke Wen 1' } },
    { data: { id: 'two', label: 'Ke Wen 2' } },
    { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
  ];

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
          <Center h='100%' color='green.400'>
            <CheckCircleIcon boxSize={'30px'}/>
            <Text fontSize='md' fontWeight={'700'} marginLeft={'20px'} textAlign={'center'}>
              You are not in contact with any
              <br />
              COVID-19 patient in the past 7 days!
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
            <CircularProgress value={67} color='green.400'>
              <CircularProgressLabel>67%</CircularProgressLabel>
            </CircularProgress>
            <Text fontSize='md' fontWeight={'700'} marginLeft={'20px'}>
              You have taken 2 vaccination shot(s)!
              <br />
              1 more shot(s) before fully vaccinated.
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