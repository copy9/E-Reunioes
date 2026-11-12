import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Chip } from '../components/ui';
import { companies, spaces, type MeetingType } from '../data/seed';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

const contacts = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa'];
const meetingTypes: MeetingType[] = ['Café', 'Almoço', 'Online'];

export default function CreateMeeting() {
  const params = useLocalSearchParams<{ companyId?: string }>();
  const { createMeeting } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<MeetingType>('Café');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [participants, setParticipants] = useState<string[]>(() => {
    const company = companies.find((c) => c.id === params.companyId);
    return company ? [company.name] : [];
  });
  const [query, setQuery] = useState('');
  const [spaceId, setSpaceId] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    const pool = [...contacts, ...companies.map((c) => c.name)];
    const q = query.trim().toLowerCase();
    return pool
      .filter((p) => !participants.includes(p))
      .filter((p) => (q ? p.toLowerCase().includes(q) : true))
      .slice(0, 6);
  }, [query, participants]);

  const selectedSpace = spaces.find((s) => s.id === spaceId);

  const addParticipant = (person: string) => {
    setParticipants((prev) => [...prev, person]);
    setQuery('');
  };

  const removeParticipant = (person: string) => {
    setParticipants((prev) => prev.filter((p) => p !== person));
  };

  const submit = () => {
    if (!name.trim()) {
      Alert.alert('Nome obrigatório', 'Informe o nome da reunião.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(date)) {
      Alert.alert('Data inválida', 'Use o formato dd/mm.');
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
      Alert.alert('Horário inválido', 'Use o formato HH:mm.');
      return;
    }
    if (participants.length === 0) {
      Alert.alert('Convidados', 'Adicione pelo menos um participante.');
      return;
    }
    if (type !== 'Online' && !selectedSpace) {
      Alert.alert('Local', 'Escolha um local para a reunião presencial.');
      return;
    }

    createMeeting({
      id: `m${Date.now()}`,
      title: name.trim(),
      place: type === 'Online' ? 'Online' : selectedSpace?.name ?? '',
      date,
      time,
      group: 'proximas',
      type,
      participants,
      confirmed: true,
    });

    Alert.alert('Convite enviado', `${participants.length} convidado(s) receberam o convite.`, [
      { text: 'OK', onPress: () => router.replace('/my-meetings') },
    ]);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Nome da reunião</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: Reunião de estratégia"
        placeholderTextColor={colors.muted}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.row}>
        {meetingTypes.map((t) => (
          <Chip key={t} label={t} selected={type === t} onPress={() => setType(t)} />
        ))}
      </View>

      <Text style={styles.label}>Data e hora</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.half]}
          placeholder="dd/mm"
          placeholderTextColor={colors.muted}
          keyboardType="numbers-and-punctuation"
          maxLength={5}
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={[styles.input, styles.half]}
          placeholder="HH:mm"
          placeholderTextColor={colors.muted}
          keyboardType="numbers-and-punctuation"
          maxLength={5}
          value={time}
          onChangeText={setTime}
        />
      </View>

      <Text style={styles.label}>Participantes</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar pessoa ou empresa"
        placeholderTextColor={colors.muted}
        value={query}
        onChangeText={setQuery}
      />
      {suggestions.length > 0 && (
        <View style={styles.row}>
          {suggestions.map((p) => (
            <Chip key={p} label={`+ ${p}`} onPress={() => addParticipant(p)} />
          ))}
        </View>
      )}
      {participants.length > 0 && (
        <View style={styles.row}>
          {participants.map((p) => (
            <Chip key={p} label={`${p} ✕`} selected onPress={() => removeParticipant(p)} />
          ))}
        </View>
      )}

      {type !== 'Online' && (
        <>
          <Text style={styles.label}>Local sugerido</Text>
          <Card style={styles.mapCard}>
            <Ionicons name="location-outline" size={28} color={colors.gold} />
            <Text style={styles.mapText}>
              {selectedSpace
                ? `${selectedSpace.name} · ${selectedSpace.address}`
                : 'Escolha um espaço parceiro abaixo'}
            </Text>
          </Card>
          <View style={styles.row}>
            {spaces.map((s) => (
              <Chip
                key={s.id}
                label={s.name}
                selected={spaceId === s.id}
                onPress={() => setSpaceId(s.id)}
              />
            ))}
          </View>
        </>
      )}

      {type === 'Online' && (
        <Card>
          <Text style={styles.mapText}>Reunião online: não é preciso escolher um local.</Text>
        </Card>
      )}

      <Button title="Enviar Convite" onPress={submit} style={styles.submit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 40 },
  label: { color: colors.navy, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  half: { flex: 1 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 0, marginBottom: 4 },
  mapCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mapText: { color: colors.text, flex: 1, fontSize: 15 },
  submit: { marginTop: 24 },
});
