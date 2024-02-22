import React from 'react';
import { Link as LinkDOM } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';

import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export interface IDetailsForm {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  biography: string;
}

// Using yup to validate the form to match API requirements
const validationSchema = Yup.object().shape({
  userName: Yup.string()
    .min(3, 'User name must be at least 3 characters')
    .max(50, 'Username must be 50 characters or less')
    .matches(/^[a-zA-Z0-9.\-_]+$/, 'Username must contain only letters, numbers, dashes and underscores')
    .required('Username is required'),
  firstName: Yup.string()
    .min(3, 'First name must be at least 3 characters')
    .max(50, 'First name must be 50 characters or less')
    .required('First name is required'),
  lastName: Yup.string()
    .min(3, 'Last name must be at least 3 characters')
    .max(50, 'Last name must be 50 characters or less')
    .required('Last name is required'),
  email: Yup.string()
    .email('Email must be a valid email address')
    .min(15, 'Email must be at least 15 characters long')
    .max(180, 'Email must be 180 characters or less')
    .required('Email is required'),
  biography: Yup.string()
    .max(500, 'Biography must be 500 characters or less')
    .nullable()
});

export default function DetailsForm({ user, onDetailsSubmit }: { user: Instalike.User; onDetailsSubmit: (values: IDetailsForm) => void; }) {
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, watch, errors } = useForm(formOptions);

  // Not used, call here because dunno what to do :p
  watch();

  return (
    <Flex
      align='center'
      justify='center'
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack
        spacing={4}
        w='full'
        maxW='md'
        bg={useColorModeValue('white', 'gray.700')}
        rounded='xl'
        boxShadow='lg'
        p={6}
        my={12}
      >
        <Heading
          lineHeight={1.1}
          fontSize={{ base: '2xl', sm: '3xl' }}
        >
          Manage user details
        </Heading>

        <Box
          as='form'
          onSubmit={handleSubmit(onDetailsSubmit)}
        >
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              name='userName'
              placeholder='Username'
              _placeholder={{ color: 'gray.500' }}
              type='text'
              autoComplete='none'
              defaultValue={user.userName}
              ref={register({ required: true })}
            />
            <Text
              color='orange.500'
            >
              {errors.userName?.message}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel>First name</FormLabel>
            <Input
              name='firstName'
              placeholder='First name'
              _placeholder={{ color: 'gray.500' }}
              type='text'
              autoComplete='none'
              defaultValue={user.firstName}
              ref={register({ required: true })}
            />
            <Text
              color='orange.500'
            >
              {errors.firstName?.message}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel>Last name</FormLabel>
            <Input
              name='lastName'
              placeholder='Last name'
              _placeholder={{ color: 'gray.500' }}
              type='text'
              autoComplete='none'
              defaultValue={user.lastName}
              ref={register({ required: true })}
            />
            <Text
              color='orange.500'
            >
              {errors.lastName?.message}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name='email'
              placeholder='student@etu.unistra.fr'
              _placeholder={{ color: 'gray.500' }}
              type='email'
              autoComplete='none'
              defaultValue={user.email}
              ref={register({ required: true })}
            />
            <Text
              color='orange.500'
            >
              {errors.email?.message}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel>Biography</FormLabel>
            <Textarea
              name='biography'
              placeholder='Biography'
              _placeholder={{ color: 'gray.500' }}
              autoComplete='none'
              defaultValue={user.biography}
              ref={register}
            />
          </FormControl>

          <Stack mt={6} direction='row'>
            <Button
              as={LinkDOM}
              to='/profile/me'
              bg='red.500'
              color='white'
              w='full'
              _hover={{
                bg: 'red.500'
              }}>
              Cancel
            </Button>
            <Input
              as='input'
              type='submit'
              value='Submit'
              bg='blue.500'
              color='white'
              w='full'
              _hover={{
                bg: 'blue.500'
              }}
            />
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
