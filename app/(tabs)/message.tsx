import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function InboxScreen() {
  const router = useRouter();

  const [notifications] = useState([
    { id: "n1", type: "vote", text: "Juan votó tu decisión 🔥", videoId: "1" },
    { id: "n2", type: "comment", text: "Ana comentó tu video 💬", videoId: "2" },
    { id: "n3", type: "friend", text: "Pedro te envió solicitud 👥" },
  ]);

  const [chats] = useState([
    {
      id: "1",
      name: "Juan",
      lastMessage: "Bro mira esto 🔥",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      id: "2",
      name: "María",
      lastMessage: "Jajajajaj",
      avatar: "https://i.pravatar.cc/100?img=2",
    },
  ]);

  return (
    <ScrollView style={styles.container}>

      {/* 🔔 NOTIFICACIONES */}
      <Text style={styles.section}>Notificaciones</Text>

      {notifications.map((n) => (
        <Pressable
          key={n.id}
          style={styles.card}
          onPress={() => {
            // 👉 si es video te manda al video
            if (n.videoId) {
              router.push(`../video/${n.videoId}`);
            }
          }}
        >
          <Ionicons name="notifications" size={20} color="white" />
          <Text style={styles.text}>{n.text}</Text>
        </Pressable>
      ))}

      {/* 💬 CHATS */}
      <Text style={styles.section}>Mensajes</Text>

      {chats.map((c) => (
        <Pressable
          key={c.id}
          style={styles.chat}
          onPress={() => router.push(`../chat/${c.id}`)}
        >
          <Image source={{ uri: c.avatar }} style={styles.avatar} />

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{c.name}</Text>
            <Text style={styles.msg}>{c.lastMessage}</Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="gray" />
        </Pressable>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 50,
    paddingHorizontal: 10,
  },

  section: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },

  card: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    backgroundColor: "#111",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  text: {
    color: "white",
    flex: 1,
  },

  chat: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#111",
    borderRadius: 10,
    marginBottom: 10,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },

  name: { color: "white", fontWeight: "bold" },
  msg: { color: "gray", fontSize: 12 },
});