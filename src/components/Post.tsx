import React, { useState } from 'react';
import { Link as LinkDOM } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  Image,
  Link,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  ChatIcon,
  StarIcon,
  ViewIcon,
} from '@chakra-ui/icons';

import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import api from '../services/api';
import Comments from './CommentsModal';

export default function Post({ post, updatePosts }: { post: Instalike.Post, updatePosts: () => Promise<void>; }) {
  const [isLiked, setIsLiked] = useState(false);

  const likePost = async (currentPost: Instalike.Post) => {
    if (!currentPost.viewerHasLiked) {
      api
        .post<Instalike.Post[]>(`/posts/${currentPost.id}/like`)
        .then(() => {
          setIsLiked(true);
          updatePosts();
        })
        .catch(() => {
          throw new Error('Error while adding the star to the post');
        });
    } else {
      api
        .delete<Instalike.Post>(`/posts/${currentPost.id}/like`)
        .then(() => {
          setIsLiked(false);
          updatePosts();
        })
        .catch(() => {
          throw new Error('Error while deleting the star from the post');
        });
    }
  };

  return (
    <Center
      py={6}
    >
      <Box
        maxW='445px'
        w='full'
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow='2xl'
        rounded='md'
        p={6}
        overflow='hidden'
      >
        <Stack
          mb={10}
          direction='row'
          spacing={4}
          align='center'
        >
          <Link
            as={LinkDOM}
            to={`/profile/${post.owner.id}`}
          >
            <Avatar
              size='md'
              src={post.owner.avatar !== null ? post.owner.avatar : `https://avatars.dicebear.com/api/bottts/${post.owner.id}.svg?textureChance=100`}
            />
          </Link>
          <Stack
            direction='column'
            spacing={0}
            fontSize='sm'
          >
            <Link
              as={LinkDOM}
              to={`/profile/${post.owner.id}`}
            >
              <Text
                fontWeight={600}
              >
                {post.owner.fullName}
              </Text>
            </Link>
            <Text
              color='gray.500'
            >
              {post.location}
            </Text>
          </Stack>
        </Stack>

        <Box
          as={Swiper}
          h='210px'
          bg='gray.100'
          color='red'
          mt={-6}
          mx={-6}
          mb={6}
          pos='relative'
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onDoubleClick={() => likePost(post)}
        >
          <Box
            as={Button}
            variant='ghost'
          >
            {post.resources.map((image: Instalike.Media) => (
              <SwiperSlide key={image.id}>
                <Image
                  src={image.src}
                  alt={`Image n°${image.id}`}
                  h='100%'
                  w='100%'
                  objectFit='cover'
                />
              </SwiperSlide>
            ))}
          </Box>
        </Box>
        <Stack>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize='2xl'
            fontFamily='body'
          >
            <Link
              as={LinkDOM}
              to={`/post/${post.id}`}
            >
              {post.caption}
            </Link>
          </Heading>
          <Stack
            isInline
            spacing={4}
            align='center'
          >
            <Button
              onClick={() => likePost(post)}
            >
              {isLiked || post.viewerHasLiked ? (
                <StarIcon color='yellow.500' mr={2} />
              ) : (
                <StarIcon color='gray.500' mr={2} />
              )}
              <Text
                color='gray.500'
              >
                {post.likesCount}
              </Text>
            </Button>
            {post.hasCommentsDisabled ? (
              <Button>
                <ChatIcon color='red.300' mr={2} />
                <Text
                  color='gray.500'
                >
                  Disabled
                </Text>
              </Button>
            ) : (
              <Comments
                postId={post.id}
                commentsCount={post.commentsCount}
                comments={post.previewComments}
              >
                <ChatIcon mr={2} />
                <Text
                  color='gray.500'
                >
                  {post.commentsCount}
                </Text>
              </Comments>
            )}

            <Spacer />

            <Button
              as={LinkDOM}
              to={`/post/${post.id}`}
            >
              <ViewIcon />
            </Button>
          </Stack>
          <Text
            color='gray.500'
          >
            {new Date(post.createdAt).toLocaleString('en-GB')}
          </Text>
        </Stack>
      </Box>
    </Center>
  );
}
