import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  AlertIcon,
  Box,
} from '@chakra-ui/react';

import api from '../services/api';
import FullPost from '../components/FullPost';

const Post = (): ReactElement => {
  const [post, setPost] = useState<Instalike.Post>();
  const [error, setError] = useState('');

  const { postId } = useParams();

  const getPost = async () => {
    api
      .get<Instalike.Post>(`/posts/${postId}`)
      .then((response) => {
        setPost(response.data);
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

  useEffect(() => {
    document.title = `Post n°${postId} - Instalike`;

    getPost();
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

      {post !== undefined && (
        <FullPost post={post} updatePost={getPost} />
      )}
    </Box>
  );
};

export default Post;
