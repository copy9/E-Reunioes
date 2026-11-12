import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { router, Stack } from 'expo-router';
import { Button } from '../components/ui';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

// Cadastro local (sem backend): cria a sessão do usuário e segue para o início.
export default function Signup() {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const submit = () => {
    if (!name.trim()) return Alert.alert('Nome obrigatório', 'Informe seu nome.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return Alert.alert('E-mail inválido', 'Informe um e-mail válido.');
    if (password.length < 6) return Alert.alert('Senha curta', 'A senha precisa ter pelo menos 6 caracteres.');
    if (password !== confirm) return Alert.alert('Senhas diferentes', 'A confirmação não bate com a senha.');
    login({ type: 'user', name: name.trim() });
    router.replace('/home');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: 'Criar conta' }} />
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Seu nome" placeholderTextColor={colors.muted} />
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="voce@email.com"
        placeholderTextColor={colors.muted}
      />
      <Text style={styles.label}>Senha</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Mínimo de 6 caracteres" placeholderTextColor={colors.muted} />
      <Text style={styles.label}>Confirmar senha</Text>
      <TextInput style={styles.input} value={confirm} onChangeText={setConfirm} secureTextEntry placeholderTextColor={colors.muted} />
      <Button title="Criar conta" onPress={submit} style={styles.submit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 32 },
  label: { color: colors.navy, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  submit: { marginTop: 24 },
});
