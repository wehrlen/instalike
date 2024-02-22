import React, { useState } from 'react';
import { useLocation, Link as LinkDOM } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  SettingsIcon,
} from '@chakra-ui/icons';

import api from '../services/api';
import { selectUser } from '../redux/user/selectors';

import Info from './InfoModal';

export default function UserCard({ user, updateUser }: { user: Instalike.User, updateUser: () => Promise<void>; }) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowedByViewer);

  const { loggedUser } = useSelector(selectUser);

  const location = useLocation();

  const isMyProfile = location.pathname.includes('/me') || location.pathname.includes(`/profile/${loggedUser.id}`);
  const isUserProfile = location.pathname.includes('/profile/');

  const bg = useColorModeValue('gray.500', 'gray.700');

  const followUser = async () => {
    if (user.isFollowedByViewer) {
      api
        .delete<Instalike.User>(`/users/me/followers/${user.id}/follow`)
        .then(() => {
          setIsFollowing(false);
          updateUser();
        })
        .catch(() => {
          throw new Error('Error while unfollowing user');
        });
    } else {
      api
        .post<Instalike.User>(`/users/me/followers/${user.id}/follow`)
        .then(() => {
          setIsFollowing(true);
          updateUser();
        })
        .catch(() => {
          throw new Error('Error while following user');
        });
    }
  };

  return (
    <Center
      py={6}
    >
      <Box
        w='80%'
        maxW='full'
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow='2xl'
        rounded='md'
        overflow='hidden'
        position='relative'
      >
        <Image
          h='140px'
          w='full'
          src={`https://picsum.photos/seed/${user.id}/1200/140`}
          objectFit='cover'
        />

        <Flex
          justify='center'
          mt={-12}
        >
          <Avatar
            size='2xl'
            src={user.avatar !== null ? user.avatar : `https://avatars.dicebear.com/api/bottts/${user.id}.svg?textureChance=100`}
            css={{
              border: '2px solid white'
            }}
          />
        </Flex>

        <Flex
          as={Stack}
          direction={{ base: 'column', md: 'row' }}
        >
          <Box
            fontSize='sm'
            color='gray.500'
            fontWeight='bold'
            ml={8}
            position={{ base: 'unset', md: 'absolute' }}
            top='160px'
          >
            <Text>
              ID: {user.id}
            </Text>
            <Link
              href={`mailto:${user.email}`}
              color='blue.500'
              target='_BLANK'
            >
              {user.email}
            </Link>
            <Text>
              Join date: {new Date(user.createdAt).toLocaleString('en-GB')}
            </Text>
          </Box>

          {user.id === loggedUser.id && (
            <Box
              fontSize='sm'
              color='gray.500'
              fontWeight='bold'
              ml={8}
              alignSelf='center'
              position={{ base: 'unset', md: 'absolute' }}
              top='160px'
              right={4}
            >
              <Button
                as={LinkDOM}
                to='/profile/settings'
                variant='outline'
                textDecoration='none'
                // Hover as well
                style={{ textDecoration: 'none' }}
              >
                <SettingsIcon color='blue.300' mr={2} />
                <Text
                  color='gray.500'
                >
                  Settings
                </Text>
              </Button>
            </Box>
          )}
        </Flex>

        <Box p={6}>
          <Stack spacing={0} align='center' mb={5}>
            {isUserProfile && (
              <Heading
                fontSize='2xl'
                fontWeight={500}
                fontFamily='body'
              >
                {user.fullName}
              </Heading>
            ) || (
                <Heading
                  as={LinkDOM}
                  to={`/profile/${user.id}`}
                  fontSize='2xl'
                  fontWeight={500}
                  fontFamily='body'
                  _hover={{
                    textDecoration: 'underline'
                  }}
                >
                  {user.fullName}
                </Heading>
              )}
            <Text color='gray.500'>{user.biography ? user.biography : 'Web developper'}</Text>
          </Stack>

          <Stack direction='row' justify='center' spacing={6}>
            <Info title='Followers' currentUser={user}>
              <Stack spacing={0} align='center'>
                <Text fontWeight={600}>{user.followersCount}</Text>
                <Text fontSize='sm' color='gray.500'>
                  Followers
                </Text>
              </Stack>
            </Info>
            <Info title='Following' currentUser={user}>
              <Stack spacing={0} align='center'>
                <Text fontWeight={600}>{user.followingCount}</Text>
                <Text fontSize='sm' color='gray.500'>
                  Following
                </Text>
              </Stack>
            </Info>
          </Stack>

          {!isMyProfile && (
            <Button
              w='full'
              mt={8}
              bg={bg}
              color='white'
              rounded='md'
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              onClick={followUser}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </Box>
      </Box>
    </Center >
  );
}
