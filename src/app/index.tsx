import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../theme/colors';

// Splash: mostra a marca e segue para o login.
export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/login'), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>E-Reuniões</Text>
      <Text style={styles.tagline}>
        Reuniões Inteligentes.{'\n'}Conexões Reais.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.night,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: { color: colors.cream, fontSize: 36, fontWeight: '700' },
  tagline: {
    color: colors.cream,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 26,
  },
});
