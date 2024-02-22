import React, { ReactElement, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Alert,
  AlertIcon,
  Box,
} from '@chakra-ui/react';

import api from '../services/api';
import { selectUser } from '../redux/user/selectors';

import UserCard from '../components/UserCard';
import Post from '../components/Post';

const Profile = (): ReactElement => {
  const [user, setUser] = useState<Instalike.User>();
  const [userPosts, setUserPosts] = useState<Instalike.PostFeed>();
  const [error, setError] = useState('');

  const { userId } = useParams() as { userId: string; };

  const { loggedUser, isLoggedIn } = useSelector(selectUser);

  const location = useLocation();

  const isMyProfile = location.pathname.includes('/me') || location.pathname.includes(`/profile/${loggedUser.id}`);

  const getUserPosts = async (cursor?: string | null) => {
    let postsUrl = '/users/me/posts';

    if (userId !== 'me') {
      postsUrl = `/users/${userId}/posts`;
    }

    if (cursor) {
      postsUrl += `?cursor=${cursor}`;
    }

    api
      .get<Instalike.PostFeed>(postsUrl)
      .then((response) => {
        // Concat all posts items
        if (userPosts) {
          const items = response.data.items.concat(userPosts.items);
          const mergedItems = { ...response.data, items };
          mergedItems.items = mergedItems.items.sort((a, b) => b.id - a.id);
          setUserPosts(mergedItems);
        } else {
          setUserPosts(response.data);
        }
      })
      .catch((e) => {
        switch (e.response.status) {
          case 404:
            setError('The requested post does not exist');
            break;

          case 401:
            setError('You must be logged in to view this page');
            break;

          default:
            setError('An error occurred while fetching the post');
            break;
        }
      });
  };

  const getCurrentUser = async () => {
    let userUrl = '/users/me';

    if (userId !== 'me') {
      userUrl = `/users/${userId}`;
    }

    api
      .get<Instalike.User>(userUrl)
      .then((response) => {
        setUser(response.data);
        document.title = `Profile of ${response.data.userName} - Instalike`;
      })
      .catch((e) => {
        switch (e.response.status) {
          case 404:
            setError('The requested user does not exist');
            break;

          case 401:
            setError('You must be logged in to view this page');
            break;

          default:
            setError('An error occurred while fetching the user');
            break;
        }
      });
  };

  useEffect(() => {
    // Prevent useless request if already logged in
    if (isMyProfile && isLoggedIn === true) {
      setUser(loggedUser as Instalike.User);
      document.title = `Profile of ${loggedUser.userName} - Instalike`;
    } else {
      getCurrentUser();
    }
    // On user change, reset the posts
    setUserPosts(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    getUserPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Box w='full'>
      {user && (
        <UserCard user={user} updateUser={getCurrentUser} />
      )}

      {error !== '' && (
        <Alert status='error'>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {userPosts?.items.map((post: Instalike.Post) => (
        <Post key={post.id} post={post} updatePosts={getUserPosts} />
      ))}

      {userPosts?.hasMorePages && (
        <Box
          as='button'
          onClick={() => {
            getUserPosts(userPosts.nextCursor);
          }}
          mt='2'
          mb='2'
          w='full'
          bg='gray.700'
          border='1px'
          borderColor='gray.200'
          borderRadius='md'
          _hover={{ bg: 'gray.300' }}
        >
          Load more posts
        </Box>
      )}
    </Box>
  );
};

export default Profile;
