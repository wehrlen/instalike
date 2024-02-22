import React, { ChangeEvent, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Input,
  useDisclosure,
} from '@chakra-ui/react';

export default function InputDialog({ children, title, content, customClick }: { children: JSX.Element; title: string; content: string; customClick: (text: string) => void; }) {
  const [contentInput, setContentInput] = useState(content);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => setContentInput(e.target.value);

  const isContentError = contentInput === '';

  const placeholder = `Edit your ${title}...`;

  return (
    <Box>
      <Button onClick={onOpen}>{children}</Button>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Edit {title}?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            You can modify your {title} here.
            <FormControl
              mt={2}
              isRequired
            >
              <Input
                placeholder={placeholder}
                size='lg'
                borderColor='gray.500'
                value={contentInput}
                onChange={handleTextChange}
              />
              {isContentError && (
                <FormHelperText>
                  {title[0].toUpperCase() + title.slice(1).toLowerCase()} cannot be empty
                </FormHelperText>
              )}
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Back
            </Button>
            <Button
              colorScheme='orange'
              ml={3}
              onClick={() => {
                onClose();
                customClick(contentInput);
                setContentInput('');
              }}
            >
              Accept
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
