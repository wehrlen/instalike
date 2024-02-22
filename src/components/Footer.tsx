import React, { ReactNode } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import {
  InfoIcon,
  LinkIcon,
} from '@chakra-ui/icons';

const ThemeChanger = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button
      onClick={toggleColorMode}
      bg={useColorModeValue('gray.300', 'gray.700')}
    >
      Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
    </Button>
  );
};

const LinkButton = ({ children, label, href }: { children: ReactNode; label: string; href: string; }) => (
  <Button
    as='a'
    href={href}
    target='_blank'
    title={label}
    bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
    rounded='full'
    w={8}
    h={10}
    cursor='pointer'
    display='inline-flex'
    alignItems='center'
    justifyContent='center'
    transition='background 0.3s ease'
    _hover={{
      bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
    }}
  >
    <VisuallyHidden>{label}</VisuallyHidden>
    {children}
  </Button>
);

export default function Footer() {
  return (
    <Box
      color={useColorModeValue('gray.700', 'gray.200')}
      bg={useColorModeValue('gray.100', 'gray.900')}
    >

        <Text>
          Made with Thomas Wehrlen, 2022
        </Text>

        <ThemeChanger />

        <Stack
          direction='row'
          spacing={6}
        >
          <LinkButton label='Go to the API' href='https://api.instalike.fr/docs/'>
            <InfoIcon />
          </LinkButton>
          <LinkButton label='See this project on GitHub' href='https://github.com/QuentiumYT/Instalike'>
            <LinkIcon />
          </LinkButton>
        </Stack>
      </Container>
    </Box>
  );
}
