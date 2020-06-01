import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import AuthLoadingScreen from '../components/auth/AuthLoadingScreen';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import PasswordReset from '../components/auth/PasswordReset';
import EmailVerification from '../components/auth/EmailVerification';
import RegisterSensie from '../components/auth/RegisterSensie'
import Feed from '../components/feed/Feed';
import AddPost from '../components/feed/AddPost';
import Report from '../components/feed/Report';
import PostDetail from '../components/feed/PostDetail';
//import ChatList from '../components/chatList/ChatList';
import Chat from '../components/chatList/Chat';
import SensieApproval from '../components/chatList/SensieApproval';
import SensieApprovalList from '../components/chatList/SensieApprovalList';
import Profile from '../components/profile/Profile';
import EditProfile from '../components/profile/EditProfile';
import Icon from 'react-native-vector-icons/AntDesign';

const FeedStack = createStackNavigator({
  Archipelago: Feed,
  PostDetail: PostDetail,
  AddPost: AddPost,
  Report: Report,
});

const ChatStack = createStackNavigator({
  //NOTE: This component will be in standby mode until multiple chats are implemented.
  //ChatList: ChatList,
  Chat: Chat,
  SensieApproval: SensieApproval,
  SensieApprovalList: SensieApprovalList,
});

const ProfileStack = createStackNavigator({
  Profile: Profile,
  EditProfile: EditProfile,
});

const MainStack = createBottomTabNavigator(
    {
      Cluster: ChatStack,  
      Archipelago: FeedStack,
      Profile: ProfileStack,
    },
    {
      initialRouteName: 'Archipelago',
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let IconComponent = Icon;
          let iconName;
          if (routeName === 'Cluster') {
            iconName = `message1`;
          }
          if (routeName === 'Archipelago') {
            iconName = `earth`;
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
        Register: Register,
        RegisterSensie: RegisterSensie,
        EmailVerification: EmailVerification,
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