import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const [likes, setLikes] =
    useState(true);

  const [comments, setComments] =
    useState(true);

  const [followers, setFollowers] =
    useState(true);

  const [messages, setMessages] =
    useState(true);

  const [votes, setVotes] =
    useState(true);

  const [reminders, setReminders] =
    useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Notificaciones
        </Text>

        <Text style={styles.subtitle}>
          Elige qué notificaciones
          deseas recibir.
        </Text>

        <View style={styles.card}>
          <Text style={styles.section}>
            Actividad
          </Text>

          <Option
            title="Likes"
            value={likes}
            onValueChange={setLikes}
          />

          <Option
            title="Comentarios"
            value={comments}
            onValueChange={
              setComments
            }
          />

          <Option
            title="Nuevos seguidores"
            value={followers}
            onValueChange={
              setFollowers
            }
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>
            Comunicación
          </Text>

          <Option
            title="Mensajes"
            value={messages}
            onValueChange={
              setMessages
            }
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>
            Decisiones
          </Text>

          <Option
            title="Resultados de votaciones"
            value={votes}
            onValueChange={setVotes}
          />

          <Option
            title="Recordatorios para publicar"
            value={reminders}
            onValueChange={
              setReminders
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Option({
  title,
  value,
  onValueChange,
}: any) {
  return (
    <View style={styles.row}>
      <Text style={styles.optionText}>
        {title}
      </Text>

      <Switch
        value={value}
        onValueChange={
          onValueChange
        }
      />
    </View>
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
    marginBottom: 15,
  },

  section: {
    color: "#ff2d55",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  optionText: {
    color: "#fff",
    fontSize: 15,
  },
});