import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

type AccessType = 'user' | 'business';

// Acesso sem backend: valida os campos, cria a sessão e leva ao painel certo.
export default function Login() {
  const { login } = useApp();
  const [type, setType] = useState<AccessType>('user');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const enter = () => {
    const id = identifier.trim();
    if (!id || !password.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o identificador e a senha para entrar.');
      return;
    }
    if (type === 'business') {
      const digits = id.replace(/\D/g, '');
      if (digits.length !== 14 && !id.includes('@')) {
        Alert.alert('CNPJ inválido', 'Informe um CNPJ com 14 dígitos ou um e-mail.');
        return;
      }
      login({ type: 'business', name: id });
      router.replace('/partner-dashboard');
      return;
    }
    login({ type: 'user', name: id.split('@')[0] });
    router.replace('/home');
  };

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
        placeholder={type === 'user' ? 'E-mail' : 'E-mail ou CNPJ'}
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

      <Pressable style={styles.primary} onPress={enter}>
        <Text style={styles.primaryText}>Entrar</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/forgot-password')}>
        <Text style={styles.link}>Esqueceu a senha?</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/signup')}>
        <Text style={styles.link}>Criar conta</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/partner-signup')}>
        <Text style={styles.link}>Quero ser um comércio parceiro</Text>
      </Pressable>
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
