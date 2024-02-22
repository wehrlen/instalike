import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Flex,
  Spacer,
} from '@chakra-ui/react';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Post from './pages/Post';
import CreatePost from './pages/CreatePost';
import Notifications from './pages/Notifications';
import FollowSuggestions from './pages/FollowSuggestions';
import Settings from './pages/Settings';
import NotFound from './pages/404';

import './App.css';

export default function App() {
  return (
    <Flex
      direction='column'
      h='100vh'
    >
      <Header />

      <Flex
        p={8}
        w='100%'
        align='center'
        justifyContent='center'
      >
        <Routes>
          <Route
            path='/'
            element={<Home />}
          />
          <Route
            path='/feed'
            element={<Feed />}
          />
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path='/profile/:userId'
            element={<Profile />}
          />
          <Route
            path='/post/:postId'
            element={<Post />}
          />
          <Route
            path='/post/create'
            element={<CreatePost />}
          />
          <Route
            path='/notifications'
            element={<Notifications />}
          />
          <Route
            path='/follow-suggestions'
            element={<FollowSuggestions />}
          />
          <Route
            path='/profile/settings'
            element={<Settings />}
          />
          <Route
            path='*'
            element={<NotFound />}
          />
        </Routes>
      </Flex>

      <Spacer />

      <Footer />
    </Flex>
  );
}
