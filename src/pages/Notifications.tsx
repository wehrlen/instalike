import React, { ReactElement, useEffect, useState } from 'react';
import { Link as LinkDOM } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  DeleteIcon,
  ViewIcon,
  ViewOffIcon,
} from '@chakra-ui/icons';

import api from '../services/api';
import { setNotificationCount } from '../redux/store';

const NotificationIcon = ({ type }: { type: Instalike.NotificationType; }) => {
  switch (type) {
    case 'user_has_liked_your_post':
      return (
        <Icon
          viewBox='0 0 576 512'
          name='star'
          position='absolute'
          bottom={0}
          right={0}
          p={1.5}
          boxSize={12}
          bg='#D69E2E'
          borderRadius='full'
        >
          <path fill='white' d='M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z' />
        </Icon>
      );

    case 'user_has_followed_you':
      return (
        <Icon
          viewBox='0 0 448 512'
          name='user'
          position='absolute'
          bottom={0}
          right={0}
          p={1.5}
          boxSize={12}
          bg='#3182CE'
          borderRadius='full'
        >
          <path fill='white' d='M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z' />
        </Icon>
      );

    // case 'user_has_commented_your_post':
    //   return (
    //     <Icon
    //       viewBox='0 0 512 512'
    //       name='comment'
    //       position='absolute'
    //       bottom={0}
    //       right={0}
    //       p={1}
    //       boxSize={12}
    //       bg='#3182CE'
    //       borderRadius='full'
    //     >
    //       <path fill='white' d='M256 32C114.6 32 .0272 125.1 .0272 240c0 49.63 21.35 94.98 56.97 130.7c-12.5 50.37-54.27 95.27-54.77 95.77c-2.25 2.25-2.875 5.734-1.5 8.734C1.979 478.2 4.75 480 8 480c66.25 0 115.1-31.76 140.6-51.39C181.2 440.9 217.6 448 256 448c141.4 0 255.1-93.13 255.1-208S397.4 32 256 32z' />
    //     </Icon>
    //   );

    default:
      return null;
  }
};

const Notifications = (): ReactElement => {
  const [notifications, setNotifications] = useState<Instalike.Notification[]>();
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const color = useColorModeValue('gray.500', 'gray.100');
  const bg = useColorModeValue('gray.100', 'gray.900');

  const getNotifications = async () => {
    api
      .get<Instalike.Notification[]>('/users/me/notifications')
      .then((response) => {
        const count = response.data.filter((notification) => !notification.isRead).length;
        setNotifications(response.data);
        dispatch(setNotificationCount(count));
      })
      .catch((e) => {
        switch (e.response.status) {
          case 401:
            setError('You must be logged in to view this page');
            break;

          default:
            setError('An error occurred while fetching the post');
            break;
        }
      });
  };

  const readNotification = async (currentNotification: Instalike.Notification) => {
    if (!currentNotification.isRead) {
      api
        .post<Instalike.Notification>(`/users/me/notifications/${currentNotification.id}/read`)
        .then(() => {
          getNotifications();
        })
        .catch(() => {
          throw new Error('Error while marking the notification as read');
        });
    } else {
      api
        .delete<Instalike.Notification>(`/users/me/notifications/${currentNotification.id}/read`)
        .then(() => {
          getNotifications();
        })
        .catch(() => {
          throw new Error('Error while marking the notification as unread');
        });
    }
  };

  const deleteNotification = async (id: string) => {
    api
      .delete<Instalike.Notification>(`/users/me/notifications/${id}`)
      .then(() => {
        getNotifications();
      })
      .catch(() => {
        throw new Error('An error occurred while deleting the notification');
      });
  };

  useEffect(() => {
    document.title = 'Notifications - Instalike';

    getNotifications();
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

      <Flex
        p={50}
        w='full'
        alignItems='center'
        justifyContent='center'
        flexWrap='wrap'
      >
        {notifications?.map((notification) => (
          <Box
            key={notification.id}
          >
            <Flex
              w='md'
              h='160px'
              m={6}
              bg={notification.isRead ? 'repeating-linear-gradient(45deg, #f2f2f2, #f2f2f2 5px, #fff 5px, #fff 10px)' : bg}
              shadow='lg'
              rounded='lg'
              overflow='hidden'
            >
              {notification.data.user !== null && (
                <Box
                  w={1 / 3}
                  position='relative'
                  style={{
                    backgroundImage: `url(${notification.data.user.avatar !== null ? notification.data.user.avatar : `https://avatars.dicebear.com/api/bottts/${notification.data.user.id}.svg?textureChance=100`})`,
                    backgroundSize: '80%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}
                >
                  <NotificationIcon type={notification.type} />
                </Box>
              ) || (
                  <Box
                    w={1 / 3}
                    position='relative'
                    style={{
                      backgroundImage: 'url(https://quentium.fr/+Files/discord/question.png)',
                      backgroundSize: '80%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center'
                    }}
                  >
                    <NotificationIcon type={notification.type} />
                  </Box>
                )}

              <Box w={2 / 3} p={4}>
                <Heading
                  as={LinkDOM}
                  to={notification.data.user !== null ? `/profile/${notification.data.user.id}` : ''}
                  fontSize='2xl'
                  fontWeight='bold'
                  color={notification.isRead ? '#FC8181' : color}
                  textDecoration='none'
                  _hover={{
                    textDecoration: 'underline'
                  }}
                >
                  {notification.data.user !== null ? notification.data.user.userName : 'Unknown user'}
                </Heading>

                <Box
                  mt={2}
                  fontSize='sm'
                  fontWeight='bold'
                  color='gray.500'
                >
                  {notification.type === 'user_has_liked_your_post' && (
                    <Text fontWeight='normal'>
                      {notification.data.user?.userName ?? 'Someone'} starred your post named &apos;
                      <Link
                        as={LinkDOM}
                        to={`/post/${notification.data.post?.id}`}
                        color='blue.500'
                      >
                        {notification.data.post?.caption}
                      </Link>
                      &apos;!
                    </Text>
                  ) || notification.type === 'user_has_followed_you' && (
                    <Text fontWeight='normal'>
                      {notification.data.user?.userName ?? 'Someone'} followed you!
                    </Text>
                  )}
                </Box>

                <Flex mt={3} alignItems='center' justifyContent='space-between'>
                  <Text color={color} fontWeight='bold'>
                    {new Date(notification.createdAt).toLocaleString()}
                  </Text>

                  <Button
                    px={2}
                    py={1}
                    bg='white'
                    fontSize='xs'
                    color='gray.900'
                    fontWeight='bold'
                    rounded='lg'
                    _hover={{
                      bg: 'gray.200',
                    }}
                    _focus={{
                      bg: 'gray.400',
                    }}
                    onClick={() => readNotification(notification)}
                  >
                    {notification.isRead ? (
                      <ViewOffIcon color='orange.500' />
                    ) : (
                      <ViewIcon color='orange.500' />
                    )}
                  </Button>

                  <Button
                    px={2}
                    py={1}
                    bg='white'
                    fontSize='xs'
                    color='gray.900'
                    fontWeight='bold'
                    rounded='lg'
                    _hover={{
                      bg: 'gray.200',
                    }}
                    _focus={{
                      bg: 'gray.400',
                    }}
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <DeleteIcon color='red.500' />
                  </Button>
                </Flex>
              </Box>
            </Flex>
          </Box>
        ))
        }
      </Flex >
    </Box >
  );
};

export default Notifications;
