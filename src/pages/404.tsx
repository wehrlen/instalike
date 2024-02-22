import React, { ReactElement, useEffect } from 'react';
import { Link as LinkDOM } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Text,
} from '@chakra-ui/react';

const NotFound = (): ReactElement => {
  useEffect(() => {
    document.title = '404 Not Found - Instalike';
  }, []);

  return (
    <Box
      textAlign='center'
      py={10}
      px={6}
      h='full'
    >
      <Heading
        display='inline-block'
        as='h2'
        size='2xl'
        bgGradient='linear(to-r, teal.400, teal.600)'
        bgClip='text'
      >
        404
      </Heading>
      <Text fontSize='18px' mt={3} mb={2}>
        Are you Instalost?
      </Text>
      <Text color='gray.500' mb={6}>
        The page you&apos;re looking for does not seem to exist..
        <br />
        Don&apos;t worry, just go back to the home page :)
      </Text>

      <Button
        as={LinkDOM}
        to='/'
        colorScheme='teal'
        bgGradient='linear(to-r, teal.400, teal.600)'
        color='white'
        variant='solid'>
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
