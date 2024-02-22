import React, { useState } from 'react';
import { useParams, Link as LinkDOM } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import api from '../services/api';

export default function InfoModal({ children, currentUser, title }: { children: JSX.Element; currentUser: Instalike.User; title: string; }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState<Instalike.User[]>();

  const { userId } = useParams() as { userId: string; };

  function openSelectedModal() {
    let userUrl = '/users/me';

    if (userId !== 'me') {
      userUrl = `/users/${currentUser.id}`;
    }

    if (title === 'Following') {
      api
        .get<Instalike.User[]>(`${userUrl}/following`)
        .then((response) => {
          onOpen();
          setData(response.data);
        })
        .catch(() => {
          throw new Error('Error while fetching following people');
        });
    } else if (title === 'Followers') {
      api
        .get<Instalike.User[]>(`${userUrl}/followers`)
        .then((response) => {
          onOpen();
          setData(response.data);
        })
        .catch(() => {
          throw new Error('Error while fetching followers');
        });
    }
  }

  return (
    <Box>
      <Box
        onClick={() => openSelectedModal()}
      >
        {children}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data && data.length > 0 && data.map((user) => (
              <Box
                key={user.id}
                py={2}
                px={4}
                mb={2}
                bg='gray.900'
                borderRadius='md'
                boxShadow='md'
              >
                <Flex
                  align='center'
                  justify='space-between'
                >
                  <Box>
                    <Text
                      fontSize='lg'
                      fontWeight='bold'
                    >
                      {user.fullName}
                    </Text>
                  </Box>
                  <Box>
                    <Link
                      as={LinkDOM}
                      to={`/profile/${user.id}`}
                      isExternal
                      boxShadow='none !important'
                    >
                      <Text
                        fontSize='sm'
                        color='blue.500'
                      >
                        @{user.userName}
                      </Text>
                    </Link>
                  </Box>
                </Flex>
              </Box>
            )) || (
                <Text>
                  {/* if title is followers and userId is not me */}
                  {title === 'Followers' && userId !== 'me' && 'This user does not have any followers'}
                  {/* if title is following and userId is not me */}
                  {title === 'Following' && userId !== 'me' && 'This user is not following anyone'}
                  {/* if title is followers and userId is me */}
                  {title === 'Followers' && userId === 'me' && 'You do not have any followers'}
                  {/* if title is following and userId is me */}
                  {title === 'Following' && userId === 'me' && 'You are not following anyone'}
                </Text>
              )}
          </ModalBody>

          <ModalFooter>
            <Button
              as={Link}
              colorScheme='red'
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
