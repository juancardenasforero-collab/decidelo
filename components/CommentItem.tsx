import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function CommentItem({ comment, isReply = false }: any) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(comment.likes || 0);

  const [showReplies, setShowReplies] = useState(false);

  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(comment.replies || []);

  // ❤️ LIKE
  const handleLike = () => {
    setLikes((prev: number) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);

    if (disliked) setDisliked(false);
  };

  // 👎 DISLIKE
  const handleDislike = () => {
    setDisliked(!disliked);

    if (liked) {
      setLiked(false);
      setLikes((prev: number) => prev - 1);
    }
  };

  // 💬 RESPONDER
  const handleAddReply = () => {
    if (!replyText.trim()) return;

    const newReply = {
      id: Date.now().toString(),
      user: "Tú",
      text: replyText,
      likes: 0,
      replies: [],
    };

    setReplies((prev: any[]) => [newReply, ...prev]);
    setReplyText("");
    setReplying(false);
    setShowReplies(true);
  };

  return (
    <View style={[styles.container, isReply && styles.reply]}>
      
      {/* 👤 USER */}
      <Text style={styles.user}>{comment.user}</Text>

      {/* 📝 TEXTO */}
      {comment.text ? (
        <Text style={styles.text}>{comment.text}</Text>
      ) : null}

      {/* 🖼 IMAGEN */}
      {comment.image && (
        <Image
          source={{ uri: comment.image }}
          style={styles.image}
        />
      )}

      {/* ⚙️ ACCIONES */}
      <View style={styles.actions}>
        
        {/* ❤️ LIKE */}
        <Pressable onPress={handleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={18}
            color={liked ? "red" : "gray"}
          />
        </Pressable>

        <Text style={styles.likes}>{likes}</Text>

        {/* 👎 DISLIKE */}
        <Pressable onPress={handleDislike}>
          <Ionicons
            name="thumbs-down-outline"
            size={18}
            color={disliked ? "white" : "gray"}
          />
        </Pressable>

        {/* 💬 RESPONDER */}
        <Pressable onPress={() => setReplying(!replying)}>
          <Text style={styles.replyBtn}>Responder</Text>
        </Pressable>
      </View>

      {/* ✍️ INPUT RESPUESTA */}
      {replying && (
        <View style={styles.replyInputContainer}>
          <TextInput
            placeholder="Responder..."
            placeholderTextColor="gray"
            value={replyText}
            onChangeText={setReplyText}
            style={styles.input}
          />

          <Pressable onPress={handleAddReply}>
            <Text style={styles.send}>Enviar</Text>
          </Pressable>
        </View>
      )}

      {/* 👇 VER RESPUESTAS */}
      {replies.length > 0 && (
        <Pressable onPress={() => setShowReplies(!showReplies)}>
          <Text style={styles.viewReplies}>
            {showReplies
              ? "Ocultar respuestas"
              : `Ver ${replies.length} respuestas`}
          </Text>
        </Pressable>
      )}

      {/* 💬 RESPUESTAS */}
      {showReplies &&
        replies.map((reply: any) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            isReply
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },

  reply: {
    marginLeft: 20,
  },

  user: {
    color: "white",
    fontWeight: "bold",
  },

  text: {
    color: "white",
    marginTop: 3,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginTop: 8,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },

  likes: {
    color: "gray",
    fontSize: 12,
  },

  replyBtn: {
    color: "gray",
    fontSize: 12,
  },

  viewReplies: {
    color: "gray",
    marginTop: 5,
    fontSize: 12,
  },

  replyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },

  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "gray",
    color: "white",
    paddingVertical: 5,
  },

  send: {
    color: "#ff2d55",
    fontWeight: "bold",
  },
});