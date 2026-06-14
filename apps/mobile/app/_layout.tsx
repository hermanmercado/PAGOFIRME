import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#06a574' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'PagoFirme' }} />
      </Stack>
    </>
  );
}
