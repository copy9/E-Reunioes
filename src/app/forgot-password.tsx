import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { Button } from '../components/ui';
import { colors } from '../theme/colors';

// Recuperação de senha (sem backend): valida o e-mail e confirma o envio.
export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const send = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert('E-mail inválido', 'Informe um e-mail válido.');
      return;
    }
    Alert.alert('Verifique seu e-mail', `Enviamos as instruções para ${email.trim()}.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: 'Recuperar senha' }} />
      <Text style={styles.text}>Informe o e-mail da sua conta e enviaremos as instruções para criar uma nova senha.</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="voce@email.com"
        placeholderTextColor={colors.muted}
      />
      <Button title="Enviar instruções" onPress={send} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream, padding: 16 },
  text: { color: colors.text, fontSize: 15, lineHeight: 21, marginBottom: 16 },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
});
