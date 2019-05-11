import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import AuthLoadingScreen from '../components/auth/AuthLoadingScreen';
import Login from '../components/auth/Login';
import Feed from '../components/feed/Feed';
import FeedDetail from '../components/feed/FeedDetail';
import ChatList from '../components/chatList/ChatList';
import Chat from '../components/chatList/Chat';
import Profile from '../components/profile/Profile';
import Icon from 'react-native-vector-icons/AntDesign';

const FeedStack = createStackNavigator({
  Feed: Feed,
  FeedDetail: FeedDetail,
});

const ChatStack = createStackNavigator({
  ChatList: ChatList,
  Chat: Chat,
});

const ProfileStack = createStackNavigator({
  Profile: Profile,
});

const MainStack = createBottomTabNavigator(
    {
        Feed: FeedStack,
        ChatList: ChatStack,
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
          if (routeName === 'ChatList') {
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