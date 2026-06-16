import React from "react";

import {
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";

export default function PolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Política de Privacidad
      </Text>

      <Text style={styles.text}>
        En Decídelo respetamos tu
        privacidad.

        {"\n\n"}

        La información que compartes
        se utiliza únicamente para
        mejorar la experiencia dentro
        de la plataforma.

        {"\n\n"}

        No compartimos información
        personal con terceros sin tu
        consentimiento.

        {"\n\n"}

        Puedes solicitar la
        eliminación de tu cuenta y
        tus datos en cualquier
        momento.

        {"\n\n"}

        Nos comprometemos a proteger
        la seguridad de tu
        información.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 25,
  },

  text: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 28,
  },
});