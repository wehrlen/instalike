import React, { ChangeEvent } from 'react';
import {
  Avatar,
  AvatarBadge,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  SmallCloseIcon,
} from '@chakra-ui/icons';

export default function PictureForm({ user, onAvatarDelete, onAvatarUpdate }: { user: Instalike.User; onAvatarDelete: () => void; onAvatarUpdate: (event: ChangeEvent<HTMLInputElement>) => void; }) {
  return (
    <Flex
      align='center'
      justify='center'
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack
        spacing={4}
        w='full'
        maxW='md'
        bg={useColorModeValue('white', 'gray.700')}
        rounded='xl'
        boxShadow='lg'
        p={6}
        my={12}
      >
        <Heading
          lineHeight={1.1}
          fontSize={{ base: '2xl', sm: '3xl' }}
        >
          Set a profile picture
        </Heading>
        <FormControl>
          <FormLabel>User icon</FormLabel>
          <Stack
            direction={['column', 'row']}
            spacing={6}
          >
            <Center>
              <Avatar
                size='xl'
                src={user?.avatar !== null ? user?.avatar : `https://avatars.dicebear.com/api/bottts/${user?.id}.svg?textureChance=100`}
              >
                <AvatarBadge
                  as={IconButton}
                  size='sm'
                  rounded='full'
                  top='-10px'
                  colorScheme='red'
                  aria-label='remove Image'
                  icon={<SmallCloseIcon />}
                  onClick={() => onAvatarDelete()}
                />
              </Avatar>
            </Center>
            <Center
              w='full'
            >
              <Input
                type='file'
                name='resource'
                id='resource'
                display='none'
                onChange={onAvatarUpdate}
                accept='image/*'
              />
              <Button
                w='full'
                onClick={() => {
                  document.getElementById('resource')?.click();
                }}
              >
                Change Icon
              </Button>
            </Center>
          </Stack>
        </FormControl>
      </Stack>
    </Flex>
  );
}
