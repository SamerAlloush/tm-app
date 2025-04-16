// import React, { useState } from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { Tabs } from 'expo-router';
// import TabBar from '../components/TabBar';
// import { TasksProvider } from '../context/TasksContext';
// import { MessagingProvider } from '../context/MessagingContext';
// import { AuthProvider } from '../context/AuthContext';

// const _layout = () => {
//   const [isTabBarVisible, setIsTabBarVisible] = useState(true);

//   return (
//     <SafeAreaProvider>
//       <AuthProvider>
//         <TasksProvider>
//           <MessagingProvider>
//             <Tabs
//               screenOptions={{
//                 headerShown: false,
//               }}
//               tabBar={(props) => <TabBar {...props} isVisible={isTabBarVisible} />}
//             >
//               <Tabs.Screen
//                 name="index"
//                 options={{
//                   title: 'Dashboard',
//                 }}
//                 listeners={({ navigation }) => ({
//                   focus: () => {
//                     setIsTabBarVisible(true);
//                   },
//                 })}
//               />
//               <Tabs.Screen
//                 name="chantier"
//                 options={{
//                   title: 'Chantier',
//                 }}
//                 listeners={({ navigation }) => ({
//                   focus: () => {
//                     setIsTabBarVisible(true);
//                   },
//                 })}
//               />
//               <Tabs.Screen
//                 name="profile/index"
//                 options={{
//                   title: 'Profile',
//                 }}
//                 listeners={({ navigation }) => ({
//                   focus: () => {
//                     setIsTabBarVisible(false);
//                   },
//                 })}
//               />
//             </Tabs>
//           </MessagingProvider>
//         </TasksProvider>
//       </AuthProvider>
//     </SafeAreaProvider>
//   );
// };

// export default _layout;
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import TabBar from '../components/TabBar';
import { TasksProvider } from '../context/TasksContext';
//import { MessagingProvider } from '../context/MessagingContext';
import { AuthProvider } from '../context/AuthContext';

const _layout = () => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TasksProvider>
          
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
            </Tabs>
        
        </TasksProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default _layout;


