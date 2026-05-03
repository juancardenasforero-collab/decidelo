import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";
import { Audio, AVPlaybackStatus } from "expo-av";

type Message = {
  id: string;
  type: "text" | "image" | "audio";
  text?: string;
  uri?: string;
  me: boolean;
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [text, setText] = useState("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", type: "text", text: "Hola 👋", me: false },
    { id: "2", type: "text", text: "Qué más 🔥", me: true },
  ]);

  /* ================= BACK ================= */
  const goBack = () => {
    router.back(); // 👈 vuelve SOLO al inbox, no al inicio
  };

  /* ================= SEND TEXT ================= */
  const sendText = () => {
    if (!text.trim()) return;

    setMessages((p) => [
      ...p,
      { id: Date.now().toString(), type: "text", text, me: true },
    ]);

    setText("");
  };

  /* ================= EMOJI ================= */
  const addEmoji = () => {
    setText((p) => p + "😂");
  };

  /* ================= IMAGE (CAMARA + GALERIA) ================= */
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!res.canceled) {
      setMessages((p) => [
        ...p,
        {
          id: Date.now().toString(),
          type: "image",
          uri: res.assets[0].uri,
          me: true,
        },
      ]);
    }
  };

  const takePhoto = async () => {
    const res = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!res.canceled) {
      setMessages((p) => [
        ...p,
        {
          id: Date.now().toString(),
          type: "image",
          uri: res.assets[0].uri,
          me: true,
        },
      ]);
    }
  };

  /* ================= AUDIO ================= */
  const startRecording = async () => {
    const perm = await Audio.requestPermissionsAsync();
    if (!perm.granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    setRecording(recording);
  };

  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    setRecording(null);

    setMessages((p) => [
      ...p,
      { id: Date.now().toString(), type: "audio", uri: uri || "", me: true },
    ]);
  };

  /* ================= PLAY AUDIO ================= */
  const playAudio = async (uri?: string) => {
    if (!uri) return;

    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  };

  /* ================= RENDER ================= */
  const renderItem = ({ item }: any) => {
    return (
      <View style={[styles.msg, item.me ? styles.my : styles.other]}>

        {item.type === "text" && (
          <Text style={{ color: "white" }}>{item.text}</Text>
        )}

        {item.type === "image" && (
          <Image source={{ uri: item.uri }} style={styles.img} />
        )}

        {item.type === "audio" && (
          <Pressable onPress={() => playAudio(item.uri)}>
            <Text style={{ color: "white" }}>🎤 Reproducir audio</Text>
          </Pressable>
        )}

      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>

        <Text style={{ color: "white", fontWeight: "bold" }}>
          Chat {id}
        </Text>
      </View>

      {/* CHAT */}
      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />

      {/* INPUT BAR */}
      <View style={styles.bar}>

        {/* emoji */}
        <Pressable onPress={addEmoji}>
          <Ionicons name="happy-outline" size={24} color="white" />
        </Pressable>

        {/* galeria */}
        <Pressable onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="white" />
        </Pressable>

        {/* camara */}
        <Pressable onPress={takePhoto}>
          <Ionicons name="camera-outline" size={24} color="white" />
        </Pressable>

        {/* audio */}
        <Pressable onPress={recording ? stopRecording : startRecording}>
          <Ionicons
            name={recording ? "stop-circle" : "mic-outline"}
            size={24}
            color={recording ? "red" : "white"}
          />
        </Pressable>

        {/* input */}
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Mensaje..."
          placeholderTextColor="#777"
          style={styles.input}
        />

        {/* send */}
        <Pressable onPress={sendText}>
          <Ionicons name="send" size={24} color="#ff2d55" />
        </Pressable>
      </View>

    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },

  header: {
    flexDirection: "row",
    gap: 10,
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: "#222",
  },

  msg: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "75%",
  },

  my: {
    alignSelf: "flex-end",
    backgroundColor: "#ff2d55",
  },

  other: {
    alignSelf: "flex-start",
    backgroundColor: "#222",
  },

  img: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },

  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderTopWidth: 0.5,
    borderColor: "#222",
  },

  input: {
    flex: 1,
    backgroundColor: "#111",
    color: "white",
    padding: 10,
    borderRadius: 20,
  },
});