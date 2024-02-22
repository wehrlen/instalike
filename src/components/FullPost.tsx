import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, Link as LinkDOM } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  Image,
  Input,
  Link,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import {
  DeleteIcon,
  EditIcon,
  StarIcon,
} from '@chakra-ui/icons';

import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import api from '../services/api';
import { selectUser } from '../redux/user/selectors';

import InputDialog from './InputDialog';
import ConfirmDialog from './ConfirmDialog';

export default function FullPost({ post, updatePost }: { post: Instalike.Post, updatePost: () => void; }) {
  const [isLiked, setIsLiked] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [comments, setComments] = useState<Instalike.Comment[]>([]);

  const navigate = useNavigate();

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => setTextInput(e.target.value);

  const isTextError = textInput === '';

  const { loggedUser } = useSelector(selectUser);

  const color = useColorModeValue('gray.700', 'white');
  const bg = useColorModeValue('gray.100', 'gray.700');

  const playAnimation = (playLike: boolean) => {
    const star = document.getElementById('star');

    if (star && playLike) {
      star.style.display = 'block';

      setTimeout(() => {
        star.style.display = 'none';
      }, 1000);
    }
  };

  const likePost = async (likedPost: Instalike.Post) => {
    playAnimation(!likedPost.viewerHasLiked);
    if (!likedPost.viewerHasLiked) {
      api
        .post<Instalike.Post>(`/posts/${likedPost.id}/like`)
        .then(() => {
          setIsLiked(true);
          updatePost();
        })
        .catch(() => {
          throw new Error('Error while adding the star to the post');
        });
    } else {
      api
        .delete<Instalike.Post>(`/posts/${likedPost.id}/like`)
        .then(() => {
          setIsLiked(false);
          updatePost();
        })
        .catch(() => {
          throw new Error('Error while deleting the star from the post');
        });
    }
  };

  const deletePost = async (deletedPost: Instalike.Post) => {
    api
      .delete<Instalike.Post>(`/posts/${deletedPost.id}`)
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch(() => {
        throw new Error('Error while deleting post');
      });
  };

  const editPost = async (editedPost: Instalike.Post, caption: string) => {
    api
      .put<Instalike.Post>(`/posts/${editedPost.id}`, {
        caption,
        hasCommentsDisabled: editedPost.hasCommentsDisabled
      })
      .then(() => {
        updatePost();
      })
      .catch(() => {
        throw new Error('Error while editing post');
      });
  };

  const getComments = async (postId: Instalike.Post['id']) => {
    api
      .get<Instalike.Comment[]>(`/posts/${postId}/comments`)
      .then((response) => {
        interface CommentList {
          items: Instalike.Comment[];
        }
        const commentList: CommentList = response.data as unknown as CommentList;

        setComments(commentList.items);
      })
      .catch(() => {
        throw new Error('Error while getting comments');
      });
  };

  const addComment = async (postId: Instalike.Post['id'], comment: string) => {
    api
      .post<Instalike.Comment>(`/posts/${postId}/comments`, {
        text: comment
      })
      .then(() => {
        getComments(post.id);
        updatePost();
      })
      .catch(() => {
        throw new Error('Error while adding comment');
      });
  };

  const deleteComment = async (postId: Instalike.Post['id'], commentId: Instalike.Comment['id']) => {
    api
      .delete<Instalike.Comment>(`/posts/${postId}/comments/${commentId}`)
      .then(() => {
        getComments(post.id);
        updatePost();
      })
      .catch(() => {
        throw new Error('Error while deleting comment');
      });
  };

  const editComment = async (postId: Instalike.Post['id'], commentId: Instalike.Comment['id'], comment: string) => {
    api
      .put<Instalike.Comment>(`/posts/${postId}/comments/${commentId}`, {
        text: comment
      })
      .then(() => {
        getComments(post.id);
        updatePost();
      })
      .catch(() => {
        throw new Error('Error while editing comment');
      });
  };

  const handleAddComment = async () => {
    if (!isTextError) {
      addComment(post.id, textInput);
    }
    setTextInput('');
  };

  useEffect(() => {
    if (!post.hasCommentsDisabled) {
      getComments(post.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VStack
      py={6}
    >
      <Box
        w='100%'
        minW='60%'
        maxW={post.dimensions?.width}
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
        </Stack>

        <Box
          as={Swiper}
          w='100%'
          maxW={post.dimensions?.width}
          h='100%'
          maxH={post.dimensions?.height}
          bg='gray.100'
          color='red'
          mt={-6}
          mx={-6}
          pos='relative'
          margin='auto'
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onDoubleClick={() => likePost(post)}
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

          <StarIcon
            id='star'
            className='like-flip-animation'
            display='none'
            position='absolute'
            h={300}
            w={300}
            top='50%'
            right='50%'
            transform='translate(50%, -50%)'
            color='yellow.500'
            zIndex={1}
          />
        </Box>

        <Stack
          mt={6}
          mb={2}
        >
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize='2xl'
            fontFamily='body'
            mb={4}
          >
            {post.caption}
          </Heading>

          <Box>
            <Button
              onClick={() => likePost(post)}
              mb={2}
            >
              {isLiked || post.viewerHasLiked ? (
                <StarIcon color='yellow.500' mr={2} />
              ) : (
                <StarIcon color='gray.500' mr={2} />
              )}
              <Text
                color='gray.500'
              >
                {post.likesCount} stars
              </Text>
            </Button>

            {post.previewLikes.length > 0 && (
              <Box>
                Starred by:&nbsp;
                {post.previewLikes.map((like) => (
                  <Box
                    display='inline'
                    key={like.id}
                  >
                    <Link
                      as={LinkDOM}
                      to={`/profile/${like.owner.id}`}
                    >
                      {like.owner.userName}
                    </Link>
                    {post.previewLikes.indexOf(like) === post.previewLikes.length - 1 ? '' : ', '}
                  </Box>
                ))}
                {post.previewLikes.length === post.likesCount ? '' : ' and more...'}
              </Box>
            )}
          </Box>

          <HStack>
            <Box>
              <Text
                color='gray.500'
              >
                Location: {post.location !== '' ? post.location : 'No location provided'}
              </Text>
              <Text
                color='gray.500'
              >
                Dimensions: {post.dimensions?.width}x{post.dimensions?.height}px
              </Text>
              <Text
                color='gray.500'
              >
                Posted on {new Date(post.createdAt).toLocaleDateString('en-GB')} at {new Date(post.createdAt).toLocaleTimeString('en-GB')}
              </Text>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <Text
                  color='gray.500'
                >
                  *Modified on {new Date(post.updatedAt).toLocaleDateString('en-GB')} at {new Date(post.updatedAt).toLocaleTimeString('en-GB')}
                </Text>
              )}
            </Box>

            <Spacer />

            {post.owner.id === loggedUser.id && (
              <HStack>
                <InputDialog
                  title='caption'
                  content={post.caption}
                  customClick={(text) => editPost(post, text)}
                >
                  <EditIcon color='orange.500' />
                </InputDialog>
                <ConfirmDialog
                  title='post'
                  customClick={() => deletePost(post)}
                >
                  <DeleteIcon color='red.500' />
                </ConfirmDialog>
              </HStack>
            )}
          </HStack>
        </Stack>
      </Box>

      <Spacer py={6} />

      <Box
        w='100%'
        minW='60%'
        maxW={post.dimensions?.width}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow='xl'
        rounded='md'
        p={6}
        overflow='hidden'
      >
        {post.hasCommentsDisabled ? (
          <Heading
            color={color}
            fontSize='2xl'
            fontFamily='body'
          >
            Comments are disabled on this post
          </Heading>
        ) : (
          <Box>
            <Heading
              color={color}
              fontSize='2xl'
              fontFamily='body'
            >
              Comments ({comments.length})
            </Heading>
            <Box
              as='ul'
              overflow='auto'
              maxHeight='50vh'
              my={6}
            >
              {comments.map((comment) => (
                <Box
                  as='li'
                  key={comment.id}
                  p={4}
                  m={2}
                  bg={bg}
                  rounded='md'
                  overflow='hidden'
                >
                  <Stack
                    isInline
                    spacing={4}
                    align='center'
                  >
                    <Avatar
                      size='md'
                      src={comment.owner.avatar !== null ? comment.owner.avatar : `https://avatars.dicebear.com/api/bottts/${comment.owner.id}.svg?textureChance=100`}
                    />
                    <Stack
                      direction='column'
                      spacing={0}
                      fontSize='sm'
                    >
                      <Text
                        color='gray.500'
                        fontSize='sm'
                      >
                        {new Date(comment.createdAt).toLocaleString('en-GB')}
                      </Text>
                      <Text
                        as={LinkDOM}
                        to={`/profile/${comment.owner.id}`}
                        color='gray.500'
                        fontSize='sm'
                      >
                        {comment.owner.userName}
                      </Text>
                      <Text
                        color='gray.500'
                      >
                        {comment.text} {comment.createdAt === comment.updatedAt ? '' : `(Edited at ${comment.updatedAt !== null ? new Date(comment.updatedAt).toLocaleString('en-GB') : ''})`}
                      </Text>
                    </Stack>

                    <Spacer />

                    {comment.owner.id === loggedUser.id && (
                      <HStack>
                        <InputDialog
                          title='comment'
                          content={comment.text}
                          customClick={(text) => editComment(post.id, comment.id, text)}
                        >
                          <EditIcon color='orange.500' />
                        </InputDialog>
                        <ConfirmDialog
                          title='comment'
                          customClick={() => deleteComment(post.id, comment.id)}
                        >
                          <DeleteIcon color='red.500' />
                        </ConfirmDialog>
                      </HStack>
                    )}
                  </Stack>
                </Box>
              ))}
            </Box>

            <FormControl
              mt={20}
              isRequired
            >
              <Input
                placeholder='Write a comment...'
                size='lg'
                borderColor='gray.500'
                value={textInput}
                onChange={handleTextChange}
              />
              {isTextError && (
                <FormHelperText>
                  Comment cannot be empty
                </FormHelperText>
              )}
              <Input
                type='submit'
                value='Comment'
                mt={8}
                borderColor='gray.500'
                onClick={handleAddComment}
                isDisabled={isTextError}
              />
            </FormControl>
          </Box>
        )}
      </Box>
    </VStack>
  );
}
