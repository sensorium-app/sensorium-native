import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import AuthLoadingScreen from '../components/auth/AuthLoadingScreen';
import Login from '../components/auth/Login';
import PasswordReset from '../components/auth/PasswordReset'
import Feed from '../components/feed/Feed';
import AddPost from '../components/feed/AddPost';
import PostDetail from '../components/feed/PostDetail';
//import ChatList from '../components/chatList/ChatList';
import Chat from '../components/chatList/Chat';
import Profile from '../components/profile/Profile';
import Icon from 'react-native-vector-icons/AntDesign';

const FeedStack = createStackNavigator({
  Feed: Feed,
  PostDetail: PostDetail,
  AddPost: AddPost,
});

const ChatStack = createStackNavigator({
  //NOTE: This component will be in standby mode until multiple chats are implemented.
  //ChatList: ChatList,
  Chat: Chat,
});

const ProfileStack = createStackNavigator({
  Profile: Profile,
});

const MainStack = createBottomTabNavigator(
    {
        Feed: FeedStack,
        Chat: ChatStack,
        Profile: ProfileStack,
    },
    {
      initialRouteName: 'Feed',
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let IconComponent = Icon;
          let iconName;
          if (routeName === 'Feed') {
            iconName = `home`;
          }
          if (routeName === 'Chat') {
            iconName = `message1`;
          }
          if(routeName === 'Profile') {
            iconName = `user`;
          }

          return <IconComponent name={iconName} size={25} color={tintColor} />;
        },
      }),
      tabBarOptions: {
        activeTintColor: 'purple',
        inactiveTintColor: 'gray',
      },
    },
);

const AuthStack = createStackNavigator(
    {
        Login: Login,
        PasswordReset: PasswordReset,
    },
    {
        mode: 'modal',
        headerMode: 'none',
    }
);

const RootStack = createAppContainer(createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: MainStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
));

export default RootStack;