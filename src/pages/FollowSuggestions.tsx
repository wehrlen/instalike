import React, { ReactElement, useEffect, useState } from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Heading,
} from '@chakra-ui/react';

import api from '../services/api';
import UserCard from '../components/UserCard';

const FollowSuggestions = (): ReactElement => {
  const [users, setUsers] = useState<Instalike.User[]>();
  const [error, setError] = useState('');

  const getFollowSuggestions = async () => {
    api
      .get<Instalike.User[]>('/users/me/follow-suggestions')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((e) => {
        switch (e.response.status) {
          case 401:
            setError('You must be logged in to view this page');
            break;

          default:
            setError('An error occurred while fetching the follow suggestions');
            break;
        }
      });
  };

  useEffect(() => {
    document.title = 'Follow Suggestions - Instalike';

    getFollowSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box w='full'>
      {error !== '' && (
        <Alert status='error'>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {users?.map((user) => (
        <UserCard key={user.id} user={user} updateUser={getFollowSuggestions} />
      ))}

      {users?.length === 0 && (
        <Box
          w='full'
          h='full'
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <Heading
            fontSize='4xl'
            fontWeight='semibold'
            color='gray.500'
          >
            No more users to show
          </Heading>
        </Box>
      )}
    </Box>
  );
};

export default FollowSuggestions;
