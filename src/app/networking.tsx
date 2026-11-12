import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Button, Card, Stars } from '../components/ui';
import { companies, type Company, type IconName } from '../data/seed';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

// Ícone de cada empresa, conforme o mockup.
const companyIcons: Record<string, IconName> = {
  c1: 'settings-outline',
  c2: 'leaf-outline',
  c3: 'chatbubbles-outline',
  c4: 'business-outline',
};

export default function Networking() {
  const { connections, toggleConnect } = useApp();
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) => c.name.toLowerCase().includes(q) || c.segment.toLowerCase().includes(q),
    );
  }, [query]);

  const openProfile = (company: Company) =>
    router.push({ pathname: '/company-profile', params: { id: company.id } });

  return (
    <View style={styles.screen}>
      <TextInput
        style={styles.search}
        placeholder="Buscar empresa ou segmento"
        placeholderTextColor={colors.muted}
        value={query}
        onChangeText={setQuery}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {visible.map((company) => {
          const connected = connections.includes(company.id);
          return (
            <Card key={company.id}>
              <View style={styles.row}>
                <View style={styles.iconCircle}>
                  <Ionicons name={companyIcons[company.id]} size={26} color={colors.navy} />
                </View>
                <View style={styles.info}>
                  <View style={styles.titleRow}>
                    <Text style={styles.name}>{company.name}</Text>
                    {company.match !== undefined ? (
                      <Badge label={`${company.match}% compatível`} />
                    ) : (
                      <Stars value={company.rating} />
                    )}
                  </View>
                  <Text style={styles.segment}>{company.segment}</Text>
                  <Text style={styles.tags}>{company.tags}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <Button
                  title={connected ? 'Conectado' : 'Conectar'}
                  variant={connected ? 'success' : 'primary'}
                  onPress={() => toggleConnect(company.id)}
                  style={styles.action}
                />
                <Button
                  title="Ver Perfil"
                  variant="outline"
                  onPress={() => openProfile(company)}
                  style={styles.action}
                />
              </View>
            </Card>
          );
        })}
        {visible.length === 0 && <Text style={styles.empty}>Nenhuma empresa encontrada.</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  search: {
    backgroundColor: colors.white,
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  content: { padding: 16, paddingBottom: 32 },
  row: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  name: { color: colors.navy, fontSize: 16, fontWeight: '700' },
  segment: { color: colors.text, marginTop: 2 },
  tags: { color: colors.muted, marginTop: 2, fontSize: 13 },
  actions: { flexDirection: 'row', gap: 10 },
  action: { flex: 1 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 24 },
});
