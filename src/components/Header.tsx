import React, { ReactNode, useEffect } from 'react';
import { Link as LinkDOM, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import {
  AtSignIcon,
  BellIcon,
  MoonIcon,
  PlusSquareIcon,
  SunIcon,
} from '@chakra-ui/icons';
import { FeedIcon, HomeIcon } from './CustomIcons';

import api from '../services/api';
import { AppDispatch, setIsLoggedIn, setLoggedUser, setNotificationCount } from '../redux/store';
import fetchUserAsync from '../redux/user/thunks';
import { selectUser } from '../redux/user/selectors';
import getNotificationCount from '../redux/notification/selectors';

const ActionButton = ({ children, label, to }: { children: ReactNode; label: string; to: string; }) => (
  <Button
    as={LinkDOM}
    to={to}
    title={label}
    bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
    rounded='full'
    w={8}
    h={10}
    cursor='pointer'
    display='inline-flex'
    alignItems='center'
    justifyContent='center'
    transition='background 0.3s ease'
    _hover={{
      bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
    }}
  >
    <VisuallyHidden>{label}</VisuallyHidden>
    {children}
  </Button>
);

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  const dispatch = useDispatch<AppDispatch>();

  const notificationCount = useSelector(getNotificationCount);

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

  const { loggedUser, isLoggedIn } = useSelector(selectUser);

  const navigate = useNavigate();

  const color = useColorModeValue('gray.700', 'gray.300');

  useEffect(() => {
    // If user force refresh the page, redux needs to know the logged user again
    if (Object.keys(loggedUser).length === 0) {
      // User is logged in
      if (localStorage.getItem('token')) {
        // REPLACED BY A THUNK
        // getCurrentUser();
        dispatch(fetchUserAsync());
        dispatch(setIsLoggedIn(true));
      } else {
        // Redirect to get user information (not logged in)
        navigate('/login');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLogout = async () => {
    api
      .post('/auth/logout')
      .then(() => {
        dispatch(setIsLoggedIn(false));
        dispatch(setLoggedUser({}));
        dispatch(setNotificationCount(0));
        localStorage.removeItem('token');
        navigate('/');
      })
      .catch((e) => {
        throw new Error(e);
      });
  };

  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.900')}
      px={4}
    >
      <Flex
        as={Stack}
        py={4}
        alignItems='center'
        justifyContent='space-between'
        direction={{ base: 'column', md: 'row' }}
      >
        <Link
          as={LinkDOM}
          to='/'
          color='white'
          h='80%'
        >
          <HStack
            h='100%'
          >
            <Image
              src={`${process.env.PUBLIC_URL}/img/logo.png`}
              alt='Logo'
              h='100%'
              maxH={14}
              borderRadius='20px'
            />
            <Text
              fontSize='xl'
              fontWeight='bold'
              color={color}
            >
              Instalike
            </Text>
          </HStack>
        </Link>

        <Stack
          direction='row'
          spacing={6}
        >
          <ActionButton label='Home' to='/'>
            <HomeIcon />
          </ActionButton>
          <ActionButton label='Feed' to='/feed'>
            <FeedIcon />
          </ActionButton>
          <ActionButton label='Create new post' to='/post/create'>
            <PlusSquareIcon />
          </ActionButton>
          <ActionButton label='Notifications' to='/notifications'>
            <BellIcon />
            {notificationCount > 0 && (
              <Badge
                pos='absolute'
                top={1}
                right={1}
                px={2}
                py={1}
                fontSize='xs'
                fontWeight='bold'
                color='red.100'
                transform='translate(50%,-50%)'
                bg='red.700'
                rounded='full'
              >
                {notificationCount}{notificationCount > 8 ? '+' : ''}
              </Badge>
            )}
          </ActionButton>
          <ActionButton label='Follow suggestions' to='/follow-suggestions'>
            <AtSignIcon />
          </ActionButton>
        </Stack>

        <Flex alignItems='center'>
          <Button
            onClick={toggleColorMode}
            bg={useColorModeValue('gray.300', 'gray.700')}
          >
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>

          {isLoggedIn === true && (
            <Menu>
              <MenuButton
                as={Button}
                rounded='full'
                variant='link'
                cursor='pointer'
                minW={0}
                ml={8}
              >
                <Avatar
                  size='sm'
                  src={loggedUser.avatar !== null ? loggedUser.avatar : `https://avatars.dicebear.com/api/bottts/${loggedUser.id}.svg?textureChance=100`}
                />
              </MenuButton>
              <MenuList
                alignItems='center'
                zIndex={10}
              >
                <br />
                <Center>
                  <Avatar
                    size='2xl'
                    src={loggedUser.avatar !== null ? loggedUser.avatar : `https://avatars.dicebear.com/api/bottts/${loggedUser.id}.svg?textureChance=100`}
                  />
                </Center>
                <br />
                <Center
                  fontWeight='bold'
                >
                  <p>{loggedUser.fullName}</p>
                </Center>
                <br />
                <MenuDivider />
                <MenuItem
                  as={LinkDOM}
                  to='/profile/me'
                  justifyContent='center'
                  borderRadius='md'
                  textDecoration='none'
                  // Hover as well
                  style={{ textDecoration: 'none' }}
                >
                  My profile
                </MenuItem>
                <MenuItem
                  as={LinkDOM}
                  to='/profile/settings'
                  justifyContent='center'
                  borderRadius='md'
                  textDecoration='none'
                  // Hover as well
                  style={{ textDecoration: 'none' }}
                >
                  Settings
                </MenuItem>
                <MenuItem
                  as={Button}
                  onClick={onLogout}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) || (
              <Button
                as={LinkDOM}
                to='/login'
                variant='link'
                color={color}
                ml={4}
              >
                Login
              </Button>
            )}
        </Flex>
      </Flex>
    </Box>
  );
};
