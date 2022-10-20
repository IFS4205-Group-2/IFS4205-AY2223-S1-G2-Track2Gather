import { Box, Center, CircularProgress, CircularProgressLabel, Flex, Text } from "@chakra-ui/react";
import CytoscapeComponent from 'react-cytoscapejs';

export default function ContactTracerOverview() {
  
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
          w={'49%'}
          minHeight={'225px'}
          borderWidth='1px'
          borderRadius='lg'
          overflow='hidden'
        >
          <Center h='100%' color='green.400'>
            <CircularProgress value={67} color='green.400'>
              <CircularProgressLabel>95%</CircularProgressLabel>
            </CircularProgress>
            <Text fontSize='md' fontWeight={'700'} marginLeft={'20px'} textAlign={'center'}>
              5 Infectants to inform
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
            <Text fontSize='md' fontWeight={'700'} marginLeft={'20px'}>
              1111 cases reported 
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