import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import CommentItem from "./CommentItem";
import * as ImagePicker from "expo-image-picker";

export default function CommentsModal({
  visible,
  onClose,
  videoId,
}: any) {

  const [text, setText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  // 🔥 BASE DE DATOS SIMULADA POR VIDEO
  const [allComments, setAllComments] = useState<any>({
    video1: [
      {
        id: "c1",
        user: "juan",
        text: "🔥 Este video está brutal",
        likes: 3,
        dislikes: 0,
        replies: [],
      },
      {
        id: "c2",
        user: "maria",
        text: "Yo habría elegido la otra opción 😂",
        likes: 1,
        dislikes: 0,
        replies: [],
      },
    ],

    video2: [
      {
        id: "c3",
        user: "ana",
        text: "Este video me representa 💀",
        likes: 5,
        dislikes: 1,
        replies: [],
      },
      {
        id: "c4",
        user: "carlos",
        text: "No sé qué haría aquí 😭",
        likes: 2,
        dislikes: 0,
        replies: [],
      },
    ],
  });

  // 🔥 comentarios del video actual
  const comments = allComments[videoId] || [];

  // ➕ agregar comentario
  const addComment = () => {
    if (!text.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      user: "tú",
      text,
      likes: 0,
      dislikes: 0,
      replies: [],
    };

    setAllComments((prev: any) => ({
      ...prev,
      [videoId]: [newComment, ...(prev[videoId] || [])],
    }));

    setText("");
    setShowEmojis(false);
  };

  // 🖼 galería
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Necesitamos permiso para acceder a tu galería");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0].uri;

      const newComment = {
        id: Date.now().toString(),
        user: "tú",
        text: "",
        image,
        likes: 0,
        dislikes: 0,
        replies: [],
      };

      setAllComments((prev: any) => ({
        ...prev,
        [videoId]: [newComment, ...(prev[videoId] || [])],
      }));
    }
  };

  // 😊 emojis
  const addEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
  };

  const emojis = [
    "😂","🤣","😭","😍","🥰","😘","😎","🔥","💀","😡",
    "😱","🤯","👏","👍","👎","💔","❤️","💯","✨","🎉",
    "🤡","🥲","👀","💸","🫶","😈","👑","🚀","😴","🤝",
    "😏","🙌","💥","⚡","🌈","🧠"
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.sheet}
        >
          <View style={styles.handle} />

          <Text style={styles.title}>Comentarios</Text>

          {/* LISTA */}
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CommentItem comment={item} />
            )}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />

          {/* INPUT */}
          <View style={styles.inputContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={16} color="white" />
            </View>

            <TextInput
              placeholder="Añade un comentario..."
              placeholderTextColor="gray"
              value={text}
              onChangeText={setText}
              style={styles.input}
            />

            {/* EMOJI */}
            <Pressable onPress={() => setShowEmojis(!showEmojis)}>
              <Ionicons name="happy-outline" size={22} color="white" />
            </Pressable>

            {/* GALERÍA */}
            <Pressable onPress={pickImage}>
              <Ionicons name="image-outline" size={22} color="white" />
            </Pressable>

            {/* ENVIAR */}
            <Pressable onPress={addComment}>
              <Ionicons name="send" size={22} color="#ff2d55" />
            </Pressable>
          </View>

          {/* EMOJIS */}
          {showEmojis && (
            <View style={styles.emojiPanel}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {emojis.map((emoji, i) => (
                  <Pressable
                    key={i}
                    onPress={() => addEmoji(emoji)}
                    style={styles.emojiBtn}
                  >
                    <Text style={styles.emoji}>{emoji}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    height: "55%",
    backgroundColor: "#111",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
  },

  handle: {
    width: 40,
    height: 5,
    backgroundColor: "gray",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },

  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  inputContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 8,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    flex: 1,
    color: "white",
    paddingVertical: 8,
  },

  emojiPanel: {
    position: "absolute",
    bottom: 70,
    left: 10,
    right: 10,
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 10,
  },

  emojiBtn: {
    paddingHorizontal: 6,
  },

  emoji: {
    fontSize: 26,
  },
});