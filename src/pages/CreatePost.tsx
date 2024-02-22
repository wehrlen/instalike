import React, { ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';

import { FilePondFile } from 'filepond';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import api from '../services/api';

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImageCrop,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageTransform
);

type PostCreate = Pick<Instalike.Post, 'caption' | 'location' | 'hasCommentsDisabled'>;
// Add resources to PostCreate type
type PostCreateWithResources = PostCreate & {
  resources: FilePondFile[];
};

const CreatePost = (): ReactElement => {
  const { register, handleSubmit, control } = useForm();

  const navigate = useNavigate();

  const submitPost = async (data: PostCreateWithResources) => {
    const commentsDisabled = data.hasCommentsDisabled ? '1' : '0';

    const formData = new FormData();

    data.resources.forEach((file: FilePondFile) => {
      formData.append('resources[]', file.file);
    });

    formData.append('caption', data.caption);
    formData.append('location', data.location);
    formData.append('hasCommentsDisabled', commentsDisabled);

    api
      .post<Instalike.Post>('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        navigate(`/post/${response.data.id}`);
      })
      .catch(() => {
        throw new Error('Error creating post');
      });
  };

  useEffect(() => {
    document.title = 'Create a post - Instalike';
  }, []);

  return (
    <Stack direction='column' w='100%'>
      <Flex p={8} flex={1} align='center' justify='center'>
        <Stack spacing={4} w='full' maxW='md'>
          <Heading fontSize='2xl'>Create a post</Heading>

          <Box
            as='form'
            onSubmit={handleSubmit(submitPost)}
          >
            <Controller
              name='resources'
              control={control}
              defaultValue={[]}
              render={({ onChange, value }) => (
                <FilePond
                  files={value}
                  ref={register}
                  allowPaste
                  allowMultiple
                  allowProcess
                  allowImageCrop
                  allowImageTransform
                  // imageCropAspectRatio='1:1'
                  maxFiles={6}
                  allowSyncAcceptAttribute
                  acceptedFileTypes={[
                    'image/png',
                    'image/jpeg',
                    'image/gif'
                  ]}
                  onupdatefiles={onChange}
                  labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                // credits={false}
                />
              )}
            />

            <FormControl isRequired>
              <FormLabel>Caption</FormLabel>
              <Input ref={register} name='caption' type='text' />
            </FormControl>

            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input ref={register} name='location' type='text' />
            </FormControl>

            <Stack spacing={6}>
              <Stack
                direction='column'
                align='start'
                justify='space-between'
              >
                <Checkbox ref={register} name='hasCommentsDisabled' mt={2}>Disable comments</Checkbox>
              </Stack>
              <Button colorScheme='blue' variant='solid' type='submit'>
                Post
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Stack>
  );
};

export default CreatePost;
