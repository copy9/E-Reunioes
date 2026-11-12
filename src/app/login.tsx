import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../theme/colors';

type AccessType = 'user' | 'business';

// Tela de acesso: login de usuário ou login comercial (CNPJ).
// A autenticação ainda não está implementada: o botão apenas segue para o início.
export default function Login() {
  const [type, setType] = useState<AccessType>('user');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const placeholder = type === 'user' ? 'E-mail' : 'E-mail ou CNPJ';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acesso</Text>

      <View style={styles.switchRow}>
        <Pressable
          style={[styles.switchButton, type === 'user' && styles.switchActive]}
          onPress={() => setType('user')}
        >
          <Text style={styles.switchText}>Login de Usuário</Text>
        </Pressable>
        <Pressable
          style={[styles.switchButton, type === 'business' && styles.switchActive]}
          onPress={() => setType('business')}
        >
          <Text style={styles.switchText}>Login Comercial</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        keyboardType={type === 'user' ? 'email-address' : 'default'}
        value={identifier}
        onChangeText={setIdentifier}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor={colors.muted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.primary} onPress={() => router.replace('/home')}>
        <Text style={styles.primaryText}>Entrar</Text>
      </Pressable>

      <Text style={styles.link}>Esqueceu a senha?</Text>
      <Text style={styles.link}>Criar conta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.night, padding: 24, justifyContent: 'center' },
  title: { color: colors.cream, fontSize: 32, fontWeight: '700', textAlign: 'center', marginBottom: 24 },
  switchRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  switchButton: {
    flex: 1,
    backgroundColor: colors.cream,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    opacity: 0.6,
  },
  switchActive: { opacity: 1 },
  switchText: { color: colors.navy, fontWeight: '600' },
  input: {
    backgroundColor: colors.cream,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
    color: colors.text,
  },
  primary: {
    backgroundColor: colors.navy,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  link: { color: colors.muted, textAlign: 'center', marginTop: 16 },
});
