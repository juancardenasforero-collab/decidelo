import React from "react";

import {
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Términos y Condiciones
      </Text>

      <Text style={styles.text}>
        Bienvenido a Decídelo.

        {"\n\n"}

        Al utilizar esta aplicación
        aceptas cumplir nuestras
        normas de uso.

        {"\n\n"}

        Está prohibido publicar
        contenido ilegal, ofensivo,
        violento o que infrinja los
        derechos de terceros.

        {"\n\n"}

        Decídelo podrá suspender
        cuentas que incumplan estas
        normas.

        {"\n\n"}

        Estos términos podrán ser
        modificados en cualquier
        momento.
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