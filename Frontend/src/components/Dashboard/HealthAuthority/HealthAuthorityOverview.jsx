import { Box, Center, Flex, Text } from "@chakra-ui/react";
import CytoscapeComponent from 'react-cytoscapejs';

export default function HealthAuthorityOverview() {
  
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
          w={'49.5%'}
          minHeight={'225px'}
          borderWidth='1px'
          borderRadius='lg'
          overflow='hidden'
        >
          <Center h='100%' color='red.400'>
            <Text fontSize='32px' fontWeight={'700'} marginLeft={'20px'} textAlign={'center'}>
              12432
            </Text>
            <Text fontSize='md' fontWeight={'500'} marginLeft={'20px'} textAlign={'center'}>
              Positive Cases Today
            </Text>
          </Center>
        </Box>
        <Box 
          w={'49.5%'}
          minHeight={'225px'}
          borderWidth='1px'
          borderRadius='lg'
          overflow='hidden'
        >
          <Center h='100%' color='green.400'>
            <Text fontSize='32px' fontWeight={'700'} marginLeft={'20px'} textAlign={'center'}>
              9835
            </Text>
            <Text fontSize='md' fontWeight={'500'} marginLeft={'20px'} textAlign={'center'}>
              Recovered Today
            </Text>
          </Center>
          
        </Box>
      </Flex>
      <Flex justifyContent={'space-between'} marginTop={'15px'}>
        <Box 
          w={'49.5%'}
          minHeight={'225px'}
          borderWidth='1px'
          borderRadius='lg'
          overflow='hidden'
        >
          <Center h='100%' color='yellow.400'>
            <Text fontSize='32px' fontWeight={'700'} marginLeft={'20px'} textAlign={'center'}>
              26453
            </Text>
            <Text fontSize='md' fontWeight={'500'} marginLeft={'20px'} textAlign={'center'}>
              In Quatantine
            </Text>
          </Center>
        </Box>
        <Box 
          w={'49.5%'}
          minHeight={'225px'}
          borderWidth='1px'
          borderRadius='lg'
          overflow='hidden'
        >
          <Center h='100%' color='blue.400'>
            <Text fontSize='32px' fontWeight={'700'} marginLeft={'20px'} textAlign={'center'}>
              2917291
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