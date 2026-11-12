import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.navy },
          headerTintColor: colors.white,
          contentStyle: { backgroundColor: colors.cream },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ title: 'E-Reuniões', headerBackVisible: false }} />
        <Stack.Screen name="create-meeting" options={{ title: 'Criar Reunião' }} />
        <Stack.Screen name="my-meetings" options={{ title: 'Minhas Reuniões' }} />
        <Stack.Screen name="partner-spaces" options={{ title: 'Espaços Parceiros' }} />
        <Stack.Screen name="events" options={{ title: 'Eventos Públicos' }} />
        <Stack.Screen name="networking" options={{ title: 'Networking' }} />
        <Stack.Screen name="company-profile" options={{ title: 'Perfil Empresarial' }} />
      </Stack>
    </>
  );
}
