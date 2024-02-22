import React from 'react';
import { Link as LinkDOM } from 'react-router-dom';
import {
  Box,
  Button,
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

export default function CommentsModal({ children, comments, commentsCount, postId }: { children: JSX.Element[]; comments: Instalike.Comment[], commentsCount: number, postId: number; }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button onClick={onOpen}>
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Comments preview for post n°{postId}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {commentsCount !== 0 && comments.map((comment) => (
              <Box key={comment.id}>
                <Text>
                  {comment.owner.userName}: {comment.text}
                </Text>
              </Box>
            )) || <Text>No comments yet, be the first to post a comment!</Text>}
          </ModalBody>

          <ModalFooter>
            <Button
              as={LinkDOM}
              to={`/post/${postId}`}
              colorScheme='blue'
            >
              Post a comment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
