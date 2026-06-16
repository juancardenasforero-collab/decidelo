import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <Text style={styles.title}>
          Estadísticas
        </Text>

        <View style={styles.card}>
          <Ionicons
            name="videocam"
            size={30}
            color="#ff2d55"
          />

          <Text style={styles.number}>
            0
          </Text>

          <Text style={styles.label}>
            Videos publicados
          </Text>
        </View>

        <View style={styles.card}>
          <Ionicons
            name="heart"
            size={30}
            color="#ff2d55"
          />

          <Text style={styles.number}>
            0
          </Text>

          <Text style={styles.label}>
            Likes recibidos
          </Text>
        </View>

        <View style={styles.card}>
          <Ionicons
            name="bar-chart"
            size={30}
            color="#ff2d55"
          />

          <Text style={styles.number}>
            0
          </Text>

          <Text style={styles.label}>
            Votos recibidos
          </Text>
        </View>

        <View style={styles.card}>
          <Ionicons
            name="people"
            size={30}
            color="#ff2d55"
          />

          <Text style={styles.number}>
            0
          </Text>

          <Text style={styles.label}>
            Seguidores
          </Text>
        </View>

        <View style={styles.card}>
          <Ionicons
            name="trophy"
            size={30}
            color="#ff2d55"
          />

          <Text style={styles.number}>
            Sin datos
          </Text>

          <Text style={styles.label}>
            Video más popular
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
  },

  number: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 10,
  },

  label: {
    color: "#999",
    marginTop: 5,
    fontSize: 15,
    textAlign: "center",
  },
});