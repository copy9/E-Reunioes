import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { router, Stack } from 'expo-router';
import { Button, Card } from '../components/ui';
import { colors } from '../theme/colors';

// Cadastro de comércio parceiro: o estabelecimento entra na rede para receber encontros.
// Sem backend, o pedido é registrado só no protótipo e segue para análise.
export default function PartnerSignup() {
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [segment, setSegment] = useState('');
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);

  const submit = () => {
    if (!name.trim() || !address.trim() || !segment.trim()) {
      Alert.alert('Campos obrigatórios', 'Informe nome, endereço e segmento do estabelecimento.');
      return;
    }
    if (cnpj.replace(/\D/g, '').length !== 14) {
      Alert.alert('CNPJ inválido', 'Informe um CNPJ com 14 dígitos.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert('E-mail inválido', 'Informe um e-mail válido para contato.');
      return;
    }
    if (!accepted) {
      Alert.alert('Termos', 'Aceite as regras da rede para enviar o cadastro.');
      return;
    }
    Alert.alert(
      'Cadastro enviado',
      'Vamos analisar o estabelecimento e entrar em contato pelo e-mail informado.',
      [{ text: 'OK', onPress: () => router.replace('/login') }],
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: 'Seja um parceiro' }} />
      <Card>
        <Text style={styles.text}>
          Receba encontros no seu espaço, atraia clientes que chegam para reuniões e apareça para pessoas que buscam locais seguros.
        </Text>
      </Card>

      <Text style={styles.label}>Nome do estabelecimento</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor={colors.muted} placeholder="Ex.: Café Central" />
      <Text style={styles.label}>CNPJ</Text>
      <TextInput style={styles.input} value={cnpj} onChangeText={setCnpj} keyboardType="number-pad" placeholder="00.000.000/0000-00" placeholderTextColor={colors.muted} />
      <Text style={styles.label}>Endereço</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Rua, número, bairro" placeholderTextColor={colors.muted} />
      <Text style={styles.label}>Segmento</Text>
      <TextInput style={styles.input} value={segment} onChangeText={setSegment} placeholder="Café, coworking, restaurante..." placeholderTextColor={colors.muted} />
      <Text style={styles.label}>E-mail de contato</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="contato@empresa.com" placeholderTextColor={colors.muted} />

      <Button
        title={accepted ? 'Regras da rede aceitas' : 'Aceitar regras da rede'}
        variant={accepted ? 'success' : 'outline'}
        onPress={() => setAccepted((v) => !v)}
        style={styles.action}
      />
      <Button title="Enviar cadastro" onPress={submit} style={styles.action} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 32 },
  text: { color: colors.text, lineHeight: 21 },
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
  action: { marginTop: 12 },
});
