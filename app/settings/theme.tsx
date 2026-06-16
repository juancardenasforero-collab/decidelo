import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

export default function ThemeScreen() {
  const router = useRouter();

  const [selected, setSelected] =
    useState("Oscuro");

  const themes = [
    {
      name: "Claro",
      icon: "sunny-outline",
    },
    {
      name: "Oscuro",
      icon: "moon-outline",
    },
    {
      name: "Automático",
      icon: "phone-portrait-outline",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color="white"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Apariencia
        </Text>
      </View>

      <Text style={styles.subtitle}>
        Elige cómo quieres ver Decídelo.
      </Text>

      {themes.map((theme) => (
        <TouchableOpacity
          key={theme.name}
          style={styles.item}
          onPress={() =>
            setSelected(theme.name)
          }
        >
          <View style={styles.left}>
            <Ionicons
              name={theme.icon as any}
              size={24}
              color="white"
            />

            <Text style={styles.text}>
              {theme.name}
            </Text>
          </View>

          {selected === theme.name && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color="#ff2d55"
            />
          )}
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },

  subtitle: {
    color: "#999",
    fontSize: 15,
    marginBottom: 25,
  },

  item: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,

    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  text: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
});