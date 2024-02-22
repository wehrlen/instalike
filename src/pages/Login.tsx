import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from '@chakra-ui/react';

import api from '../services/api';
import { AppDispatch, setIsLoggedIn, setNotificationCount } from '../redux/store';
import fetchUserAsync from '../redux/user/thunks';

const Login = (): ReactElement => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  const clickToggle = () => setShow(!show);

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmailInput(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPasswordInput(e.target.value);

  const isEmailError = emailInput === '' || !emailInput.includes('@');
  const isPasswordError = passwordInput.length < 6;

  // REPLACED BY A THUNK
  // const getCurrentUser = async () => {
  //   api
  //     .get<Instalike.User>('/users/me')
  //     .then((response) => {
  //       dispatch(setLoggedUser(response.data));
  //       dispatch(setIsLoggedIn(true));
  //     })
  //     .catch((e) => {
  //       throw new Error(e);
  //     });
  // };

  const getCurrentNotifications = async () => {
    api
      .get<Instalike.Notification[]>('/users/me/notifications')
      .then((response) => {
        const count = response.data.filter((notification: Instalike.Notification) => !notification.isRead).length;
        dispatch(setNotificationCount(count));
      })
      .catch((e) => {
        throw new Error(e);
      });
  };

  const handleFormSubmit = async () => {
    if (!isEmailError && !isPasswordError) {
      api
        .post<Instalike.AuthJWT>('/auth/login', {
          email: emailInput,
          password: passwordInput
        })
        .then((response) => {
          localStorage.setItem('token', response.data.accessToken);
          navigate('/');
          // REPLACED BY A THUNK
          // getCurrentUser();
          dispatch(fetchUserAsync());
          dispatch(setIsLoggedIn(true));
          getCurrentNotifications();
        })
        .catch(() => {
          localStorage.removeItem('token');
          setError('Error logging in, make sure you entered a valid email address and password');
        });
    } else {
      setError('The email or password you entered is invalid.');
    }
  };

  useEffect(() => {
    document.title = 'Login - Instalike';

    const keyboardListener = (event: KeyboardEvent) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault();

        const email = document.getElementById('email') as HTMLInputElement;
        if (email !== null) {
          setEmailInput(email.value);
        }

        const password = document.getElementById('password') as HTMLInputElement;
        if (password !== null) {
          setPasswordInput(password.value);
        }

        handleFormSubmit();
      }
    };

    document.addEventListener('keydown', keyboardListener);
    return () => {
      document.removeEventListener('keydown', keyboardListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailInput, passwordInput]);

  return (
    <Box w='full'>
      <Flex align='center' justifyContent='center'>
        <Box p={8} w='2xl' borderWidth={1} borderRadius={8} boxShadow='lg'>
          {error !== '' && (
            <Alert status='error'>
              <AlertIcon />
              {error}
            </Alert>
          )}

          <FormControl isRequired>
            <FormLabel
              htmlFor='email'
            >
              Email
            </FormLabel>
            <Input isInvalid={isEmailError}
              id='email'
              type='email'
              value={emailInput}
              placeholder='student@etu.unistra.fr'
              onChange={handleEmailChange}
            />
            {!isEmailError ? (
              <FormHelperText>
                Email is good to go!
              </FormHelperText>
            ) : (
              <FormHelperText>
                A valid email is required.
              </FormHelperText>
            )}
            <FormLabel
              htmlFor='password'
            >
              Password
            </FormLabel>
            <InputGroup size='md'>
              <Input
                isInvalid={isPasswordError}
                id='password'
                type={show ? 'text' : 'password'}
                value={passwordInput}
                placeholder='******'
                onChange={handlePasswordChange}
              />
              <InputRightElement width='4.5rem'>
                <Button
                  h='1.75rem'
                  size='sm'
                  color={useColorModeValue('orange.800', 'orange.200')}
                  backgroundColor={useColorModeValue('gray.300', 'gray.700')}
                  onClick={clickToggle}>
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            {!isPasswordError ? (
              <FormHelperText>
                Password is good to go!
              </FormHelperText>
            ) : (
              <FormHelperText>
                Password must be at least 6 characters.
              </FormHelperText>
            )}
            <Input
              type='submit'
              value='Login'
              onClick={handleFormSubmit}
              mt={8}
            />
          </FormControl>
        </Box>
      </Flex>
    </Box>
  );
};

export default Login;
