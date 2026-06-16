import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyScreen() {
  const [privateAccount, setPrivateAccount] =
    useState(false);

  const [onlineStatus, setOnlineStatus] =
    useState(true);

  const [allowMessages, setAllowMessages] =
    useState(true);

  const [allowMentions, setAllowMentions] =
    useState(true);

  const [showActivity, setShowActivity] =
    useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Privacidad
        </Text>

        <Text style={styles.subtitle}>
          Controla quién puede ver e
          interactuar con tu cuenta.
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.optionTitle}>
                Cuenta privada
              </Text>

              <Text style={styles.optionDesc}>
                Solo los seguidores
                aprobados podrán ver tu
                contenido.
              </Text>
            </View>

            <Switch
              value={privateAccount}
              onValueChange={
                setPrivateAccount
              }
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.optionTitle}>
                Estado en línea
              </Text>

              <Text style={styles.optionDesc}>
                Permite que otros vean
                cuándo estás conectado.
              </Text>
            </View>

            <Switch
              value={onlineStatus}
              onValueChange={
                setOnlineStatus
              }
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.optionTitle}>
                Permitir mensajes
              </Text>

              <Text style={styles.optionDesc}>
                Otros usuarios podrán
                enviarte mensajes.
              </Text>
            </View>

            <Switch
              value={allowMessages}
              onValueChange={
                setAllowMessages
              }
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.optionTitle}>
                Permitir menciones
              </Text>

              <Text style={styles.optionDesc}>
                Otros usuarios podrán
                mencionarte.
              </Text>
            </View>

            <Switch
              value={allowMentions}
              onValueChange={
                setAllowMentions
              }
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.optionTitle}>
                Mostrar actividad
              </Text>

              <Text style={styles.optionDesc}>
                Mostrar likes y actividad
                reciente en tu perfil.
              </Text>
            </View>

            <Switch
              value={showActivity}
              onValueChange={
                setShowActivity
              }
            />
          </View>
        </View>
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

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
});