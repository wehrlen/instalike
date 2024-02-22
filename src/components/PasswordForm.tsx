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
  useColorModeValue,
} from '@chakra-ui/react';

import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export interface IPasswordForm {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(6, 'Old password must be at least 6 characters')
    .required('Old password is required'),
  newPassword: Yup.string()
    .min(6, 'New password must be at least 6 characters')
    .required('New password is required'),
  newPasswordConfirmation: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Confirm password must match with your new password')
    .required('Confirm password is required')
});

export default function PasswordForm({ onPasswordSubmit }: { onPasswordSubmit: (values: IPasswordForm) => void; }) {
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, watch, errors } = useForm(formOptions);

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
          Change password
        </Heading>

        <Box
          as='form'
          onSubmit={handleSubmit(onPasswordSubmit)}
        >
          <FormControl>
            <FormLabel>Old password</FormLabel>
            <Input
              name='oldPassword'
              placeholder='Old password'
              _placeholder={{ color: 'gray.500' }}
              type='password'
              autoComplete='none'
              ref={register({ required: true })}
            />
            <Text
              color='orange.500'
            >
              {errors.oldPassword?.message}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel>New password</FormLabel>
            <Input
              name='newPassword'
              placeholder='New password'
              _placeholder={{ color: 'gray.500' }}
              type='password'
              autoComplete='none'
              ref={register({ required: true })}
            />
            <Text
              color='orange.500'
            >
              {errors.newPassword?.message}
            </Text>
          </FormControl>
          <FormControl>
            <FormLabel>Confirm password</FormLabel>
            <Input
              name='newPasswordConfirmation'
              placeholder='Confirm password'
              _placeholder={{ color: 'gray.500' }}
              type='password'
              autoComplete='none'
              ref={register({ required: true, validate: (value) => value === watch('newPassword') })}
            />
            <Text
              color='orange.500'
            >
              {errors.newPasswordConfirmation?.message}
            </Text>
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
