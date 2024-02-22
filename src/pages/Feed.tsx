import React, { ReactElement, useEffect, useState } from 'react';
import { Link as LinkDOM } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Heading,
  Spinner,
} from '@chakra-ui/react';

import InfiniteScroll from 'react-infinite-scroll-component';

import api from '../services/api';
import { selectUser } from '../redux/user/selectors';

import Post from '../components/Post';

const Feed = (): ReactElement => {
  const [posts, setPosts] = useState<Instalike.PostFeed>();
  const [error, setError] = useState('');

  const getPosts = async () => {
    api
      .get<Instalike.PostFeed>('/users/me/feed')
      .then((response) => {
        setPosts(response.data);
      })
      .catch((e) => {
        switch (e.response.status) {
          case 401:
            setError('You must be logged in to view this page');
            break;
          case 429:
            setError('Error while fetching feed posts, too many requests');
            break;

          default:
            setError('An error occurred while fetching the feed posts');
            break;
        }
      });
  };

  const getNextPosts = async (cursor: string | null) => {
    api
      .get<Instalike.PostFeed>(`/users/me/feed?cursor=${cursor}`)
      .then((response) => {
        // Concat all posts items
        if (posts) {
          const items = response.data.items.concat(posts.items);
          const mergedItems = { ...response.data, items };
          mergedItems.items = mergedItems.items.sort((a, b) => b.id - a.id);
          setPosts(mergedItems);
        } else {
          setPosts(response.data);
        }
      })
      .catch((e) => {
        switch (e.response.status) {
          case 401:
            setError('You must be logged in to view this page');
            break;
          case 429:
            setError('Error while fetching feed posts, too many requests');
            break;

          default:
            setError('An error occurred while fetching the feed posts');
            break;
        }
      });
  };

  const refreshPosts = async () => getPosts();

  const user = useSelector(selectUser);

  useEffect(() => {
    document.title = 'Instalike - Feed';

    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.isLoggedIn]);

  useEffect(() => {
    document.title = 'Instalike';
  }, []);

  return (
    <Box w='full'>
      {error !== '' && (
        <Box>
          <Alert status='error'>
            <AlertIcon />
            {error}
          </Alert>

          {user.isLoggedIn === false && (
            <Center>
              <Button
                as={LinkDOM}
                to='/login'
                colorScheme='blue'
                size='lg'
                mt={4}
                textDecoration='none'
                // Hover as well
                style={{ textDecoration: 'none' }}
              >
                Login
              </Button>
            </Center>
          )}
        </Box>
      )}



      {posts?.items.length === 0 && (
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
            There isn&apos;t anything here yet
          </Heading>
        </Box>
      )}

      {posts && (
        <InfiniteScroll
          dataLength={posts?.items.length ?? 0}
          next={() => getNextPosts(posts?.nextCursor)}
          hasMore={posts?.hasMorePages ?? false}
          loader={
            <Spinner display='block' m='auto' size='xl' />
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen all the posts :)</b>
            </p>
          }
          // Useful only when pulldown
          refreshFunction={refreshPosts}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
          }
          releaseToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
          }
          style={{ overflow: 'hidden' }}
        >
          {posts?.items.map((post: Instalike.Post) => (
            <Post key={post.id} post={post} updatePosts={getPosts} />
          ))}
        </InfiniteScroll>
      )}
    </Box>
  );
};

export default Feed;
