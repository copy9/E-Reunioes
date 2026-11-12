import { useState } from 'react';
import { Alert, Linking, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, EmptyState } from '../components/ui';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

// Modo segurança do encontro: compartilhar local e horário, check-in e emergência.
export default function Safety() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { meetings } = useApp();
  const meeting = meetings.find((m) => m.id === id);
  const [contact, setContact] = useState('');
  const [checkedIn, setCheckedIn] = useState<string | null>(null);

  if (!meeting) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ title: 'Segurança' }} />
        <EmptyState text="Reunião não encontrada." />
      </View>
    );
  }

  const details = `Encontro: ${meeting.title}\nLocal: ${meeting.place}\nData: ${meeting.date} às ${meeting.time}\nParticipantes: ${meeting.participants.join(', ')}`;

  const share = async () => {
    try {
      await Share.share({ message: `Estou em um encontro pelo E-Reuniões.\n${details}` });
    } catch {
      Alert.alert('Não foi possível compartilhar', 'Tente novamente.');
    }
  };

  const checkIn = () => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setCheckedIn(time);
    Alert.alert('Check-in registrado', `Você confirmou que está bem às ${time}.`);
  };

  const sos = () => {
    Alert.alert('Emergência', 'Ligar para a Polícia Militar (190)?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Ligar 190', style: 'destructive', onPress: () => Linking.openURL('tel:190') },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Segurança' }} />
      <Card>
        <Text style={styles.title}>{meeting.title}</Text>
        <Text style={styles.line}>Local: {meeting.place}</Text>
        <Text style={styles.line}>Horário: {meeting.date} às {meeting.time}</Text>
        <Button title="Compartilhar detalhes" variant="outline" style={styles.action} onPress={share} />
      </Card>

      <Card>
        <Text style={styles.section}>Contato de confiança</Text>
        <Text style={styles.hint}>Quem deve acompanhar este encontro. Você pode compartilhar os detalhes com essa pessoa.</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome ou telefone"
          placeholderTextColor={colors.muted}
          value={contact}
          onChangeText={setContact}
        />
      </Card>

      <Card>
        <Text style={styles.section}>Check-in de segurança</Text>
        <Text style={styles.hint}>
          {checkedIn ? `Último check-in: ${checkedIn}` : 'Confirme que está bem durante o encontro.'}
        </Text>
        <Button title="Estou bem" onPress={checkIn} style={styles.action} />
      </Card>

      <Card style={styles.sosCard}>
        <View style={styles.sosRow}>
          <Ionicons name="warning-outline" size={24} color={colors.navy} />
          <Text style={styles.sosText}>Em caso de emergência, ligue para o 190 ou saia do local imediatamente.</Text>
        </View>
        <Button title="Emergência (190)" variant="outline" style={styles.action} onPress={sos} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 32 },
  title: { color: colors.navy, fontSize: 18, fontWeight: '700' },
  line: { color: colors.text, marginTop: 6 },
  section: { color: colors.navy, fontWeight: '700', marginBottom: 6 },
  hint: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  input: {
    backgroundColor: colors.cream,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginTop: 10,
  },
  action: { marginTop: 12 },
  sosCard: { borderColor: colors.gold, borderWidth: 1.5 },
  sosRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  sosText: { flex: 1, color: colors.text, lineHeight: 20 },
});
