import { Stack } from 'expo-router';

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
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="compose" 
        options={{ 
          title: 'New Message',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="[id]" 
        options={({ route }) => ({ 
          title: route.params?.title || 'Message',
        })}
      />
    </Stack>
  );
}