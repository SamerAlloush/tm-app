import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import TabBar from '../components/TabBar';
import { TasksProvider } from '../context/TasksContext';
import { MessagingProvider } from '../context/MessagingContext';
import { AuthProvider } from '../context/AuthContext';

const AppLayout = ({ children }) => {
  return (
    <TasksProvider>
      {children}
    </TasksProvider>
  );
};

const _layout = () => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MessagingProvider>
          <Tabs
            screenOptions={{
              headerShown: false,
            }}
            tabBar={(props) => <TabBar {...props} isVisible={isTabBarVisible} />}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: 'Dashboard',
              }}
              listeners={({ navigation }) => ({
                focus: () => {
                  setIsTabBarVisible(true);
                },
              })}
            />
            <Tabs.Screen
              name="chantier"
              options={{
                title: 'Chantier',
              }}
              listeners={({ navigation }) => ({
                focus: () => {
                  setIsTabBarVisible(true);
                },
              })}
            />
            <Tabs.Screen
              name="profile/index"
              options={{
                title: 'Profile',
              }}
              listeners={({ navigation }) => ({
                focus: () => {
                  setIsTabBarVisible(false);
                },
              })}
            />
            <Tabs.Screen
              name="messagerie"
              options={{
                title: 'Messagerie',
              }}
              listeners={({ navigation }) => ({
                focus: () => {
                  setIsTabBarVisible(false);
                },
              })}
            />
          </Tabs>
        </MessagingProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default _layout;

