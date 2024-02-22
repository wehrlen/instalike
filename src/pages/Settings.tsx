import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  AlertIcon,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';

import api from '../services/api';
import { setLoggedUser } from '../redux/store';
import { selectUser } from '../redux/user/selectors';

import PictureForm from '../components/PictureForm';
import DetailsForm, { IDetailsForm } from '../components/DetailsForm';
import PasswordForm, { IPasswordForm } from '../components/PasswordForm';

const Settings = (): ReactElement => {
  const [user, setUser] = useState<Instalike.User>();
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState([]);

  const dispatch = useDispatch();

  const { loggedUser } = useSelector(selectUser);

  useEffect(() => {
    setUser(loggedUser as Instalike.User);
  }, [loggedUser]);

  const updateAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {

      const formData = new FormData();

      formData.append('resource', e.target.files[0]);

      api
        .post<Instalike.User>('/users/me/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          setStatus('Successfully uploaded new avatar!');
          setError('');
          dispatch(setLoggedUser(response.data));
        })
        .catch(() => {
          setError('Error uploading image');
          setStatus('');
        });
    } else {
      setError('No image selected');
      setStatus('');
    }
  };

  const deleteAvatar = async () => {
    if (user?.avatar !== null) {
      api
        .delete<Instalike.User>('/users/me/avatar')
        .then((response) => {
          setStatus('Avatar deleted');
          setError('');
          dispatch(setLoggedUser(response.data));
        })
        .catch(() => {
          setError('Error while deleting avatar');
          setStatus('');
        });
    } else {
      setError('Cannot delete your avatar, you don\'t have one');
      setStatus('');
    }
  };

  const submitDetails = async (details: IDetailsForm) => {
    api
      .put<Instalike.User>('/users/me', details)
      .then((response) => {
        setStatus('Successfully updated details');
        setError('');
        dispatch(setLoggedUser(response.data));
      })
      .catch((e) => {
        switch (e.response.status) {
          case 422:
            setError(e.response.data.message);
            setErrorDetails(Object.values(e.response.data.errors));
            break;

          default:
            setError('An error occurred while updating the details');
            break;
        }
        setStatus('');
      });
  };

  const submitPassword = async (passwords: IPasswordForm) => {
    api
      .put('/users/me/password', passwords)
      .then(() => {
        setStatus('Password updated');
        setError('');
      })
      .catch((e) => {
        switch (e.response.status) {
          case 422:
            setError('The old password is invalid');
            break;

          default:
            setError('An error occurred while updating the password');
            break;
        }
        setStatus('');
      });
  };

  const handleTabsChange = () => {
    setError('');
    setErrorDetails([]);
    setStatus('');
  };

  return (
    <Box
      w='full'
    >
      <Tabs onChange={handleTabsChange} isFitted>
        <TabList
          display='flex'
          justifyContent='space-evenly'
          alignItems='center'
          mb={4}
        >
          <Tab>Edit Profile picture</Tab>
          <Tab>Edit User details</Tab>
          <Tab>Edit Password</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <PictureForm
              user={loggedUser as Instalike.User}
              onAvatarDelete={() => deleteAvatar()}
              onAvatarUpdate={(event) => updateAvatar(event)}
            />
          </TabPanel>

          <TabPanel>
            <DetailsForm
              user={loggedUser as Instalike.User}
              onDetailsSubmit={(details) => submitDetails(details)}
            />
          </TabPanel>

          <TabPanel>
            <PasswordForm
              onPasswordSubmit={(passwords) => submitPassword(passwords)}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      {status !== '' && (
        <Alert status='success'>
          <AlertIcon />
          {status}
        </Alert>
      )}
      {error !== '' && (
        <Alert status='error'>
          <AlertIcon />
          {error}
        </Alert>
      )}
      {Object.keys(errorDetails).length > 0 && (
        <Alert status='warning'>
          <AlertIcon />
          <VStack alignItems='left'>
            {Object.values(errorDetails).map((errorMsg: string) => (
              <Text key={errorMsg}>{errorMsg}</Text>
            ))}
          </VStack>
        </Alert>
      )}
    </Box>
  );
};

export default Settings;
