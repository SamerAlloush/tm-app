// // // // import { Stack } from 'expo-router';

// // // // export default function MessagesLayout() {
// // // //   return (
// // // //     <Stack
// // // //       screenOptions={{
// // // //         headerStyle: { backgroundColor: '#fff' },
// // // //         headerTintColor: '#333',
// // // //         headerShadowVisible: false,
// // // //       }}
// // // //     >
// // // //       <Stack.Screen
// // // //         name="index"
// // // //         options={{
// // // //           headerShown: false,
// // // //         }}
// // // //       />
// // // //       <Stack.Screen
// // // //         name="compose"
// // // //         options={{
// // // //           title: 'New Message',
// // // //           presentation: 'modal',
// // // //         }}
// // // //       />
// // // //       <Stack.Screen
// // // //         name="[id]"
// // // //         options={({ route }) => ({
// // // //           title: route.params?.title || 'Message',
// // // //         })}
// // // //       />
// // // //     </Stack>
// // // //   );
// // // // }
// // // import { Stack } from 'expo-router';
// // // import { Ionicons } from '@expo/vector-icons';

// // // export default function MessagesLayout() {
// // //   return (
// // //     <Stack
// // //       screenOptions={{
// // //         headerStyle: { backgroundColor: '#fff' },
// // //         headerTintColor: '#333',
// // //         headerShadowVisible: false,
// // //       }}
// // //     >
// // //       <Stack.Screen
// // //         name="index"
// // //         options={{
// // //           title: 'Messages',
// // //           headerShown: false
// // //         }}
// // //       />
// // //       <Stack.Screen
// // //         name="[id]"
// // //         options={({ route }) => ({
// // //           title: route.params?.title || 'Chat',
// // //           headerBackTitle: 'Back'
// // //         })}
// // //       />
// // //       <Stack.Screen
// // //         name="compose"
// // //         options={{
// // //           title: 'New Message',
// // //           presentation: 'modal',
// // //           headerBackTitle: 'Cancel'
// // //         }}
// // //       />
// // //     </Stack>
// // //   );
// // // }
// // import { Stack } from 'expo-router';
// // import { Ionicons } from '@expo/vector-icons';
// // import { ActivityIndicator, View } from 'react-native';

// // export default function MessagesLayout() {
// //   return (
// //     <Stack
// //       screenOptions={{
// //         headerStyle: { backgroundColor: '#fff' },
// //         headerTintColor: '#333',
// //         headerShadowVisible: false,
// //       }}
// //     >
// //       <Stack.Screen
// //         name="index"
// //         options={{
// //           title: 'Messages',
// //           headerShown: false
// //         }}
// //       />
// //       <Stack.Screen
// //         name="[id]"
// //         options={({ route }) => ({
// //           title: route.params?.title || 'Chat',
// //           headerBackTitle: 'Back'
// //         })}
// //       />
// //       <Stack.Screen
// //         name="compose"
// //         options={{
// //           title: 'New Message',
// //           presentation: 'modal',
// //           headerBackTitle: 'Cancel'
// //         }}
// //       />
// //     </Stack>
// //   );
// // }
// import { Stack } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { ActivityIndicator, View } from 'react-native';

// export default function MessagesLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerStyle: { backgroundColor: '#fff' },
//         headerTintColor: '#333',
//         headerShadowVisible: false,
//       }}
//     >
//       <Stack.Screen
//         name="index"
//         options={{
//           title: 'Messages',
//           headerShown: false
//         }}
//       />
//       <Stack.Screen
//         name="[id]"
//         options={({ route }) => ({
//           title: route.params?.title || 'Chat',
//           headerBackTitle: 'Back'
//         })}
//       />
//       <Stack.Screen
//         name="compose"
//         options={{
//           title: 'New Message',
//           presentation: 'modal',
//           headerBackTitle: 'Cancel'
//         }}
//       />
//     </Stack>
//   );
// }
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MessagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#333',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="index"
        options={{ 
          title: 'Messages',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={({ route }) => ({ 
          title: route.params?.title || 'Chat',
          headerBackTitle: 'Back'
        })} 
      />
      <Stack.Screen 
        name="compose" 
        options={{ 
          title: 'New Message',
          presentation: 'modal',
          headerBackTitle: 'Cancel'
        }}
      />
    </Stack>
  );
}