import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

export default function SecurityScreen() {
  const [twoFactor, setTwoFactor] =
    useState(false);

  const [loginAlerts, setLoginAlerts] =
    useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Seguridad
        </Text>

        <Text style={styles.subtitle}>
          Protege tu cuenta y controla
          el acceso a Decídelo.
        </Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.option}
          >
            <View
              style={styles.optionLeft}
            >
              <Ionicons
                name="key-outline"
                size={22}
                color="white"
              />

              <Text
                style={styles.optionText}
              >
                Cambiar contraseña
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text
                style={styles.optionTitle}
              >
                Verificación en dos pasos
              </Text>

              <Text
                style={styles.optionDesc}
              >
                Mayor protección para tu
                cuenta.
              </Text>
            </View>

            <Switch
              value={twoFactor}
              onValueChange={
                setTwoFactor
              }
            />
          </View>
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.option}
          >
            <View
              style={styles.optionLeft}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={22}
                color="white"
              />

              <Text
                style={styles.optionText}
              >
                Dispositivos conectados
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.option}
          >
            <View
              style={styles.optionLeft}
            >
              <Ionicons
                name="time-outline"
                size={22}
                color="white"
              />

              <Text
                style={styles.optionText}
              >
                Historial de acceso
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text
                style={styles.optionTitle}
              >
                Alertas de inicio de sesión
              </Text>

              <Text
                style={styles.optionDesc}
              >
                Recibe avisos cuando alguien
                acceda a tu cuenta.
              </Text>
            </View>

            <Switch
              value={loginAlerts}
              onValueChange={
                setLoginAlerts
              }
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutAll}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="white"
          />

          <Text
            style={styles.logoutText}
          >
            Cerrar todas las sesiones
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
  },

  subtitle: {
    color: "#999",
    fontSize: 15,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  option: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  optionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    maxWidth: "85%",
  },

  optionDesc: {
    color: "#888",
    fontSize: 13,
    maxWidth: "85%",
  },

  logoutAll: {
    backgroundColor: "#ff2d55",
    borderRadius: 14,
    padding: 18,
    marginTop: 15,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
});