import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Estadísticas
      </Text>

      <View style={styles.card}>
        <Text style={styles.number}>
          0
        </Text>

        <Text style={styles.label}>
          Videos publicados
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.number}>
          0
        </Text>

        <Text style={styles.label}>
          Votos recibidos
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.number}>
          0
        </Text>

        <Text style={styles.label}>
          Likes recibidos
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.number}>
          0
        </Text>

        <Text style={styles.label}>
          Seguidores
        </Text>
      </View>
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

  card: {
    backgroundColor: "#121212",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
  },

  number: {
    color: "#ff2d55",
    fontSize: 32,
    fontWeight: "bold",
  },

  label: {
    color: "#fff",
    marginTop: 8,
    fontSize: 16,
  },
});