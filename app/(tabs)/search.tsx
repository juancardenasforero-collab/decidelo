import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";

import CommentsModal from "../../components/CommentsModal";

/* ================= TYPES ================= */
type VideoItem = {
  id: string;
  title: string;
  uri: any;
  user: string;
};

/* ================= SCREEN ================= */
export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<VideoItem | null>(null);

  const [history, setHistory] = useState<string[]>([
    "perros",
    "gym",
    "comida",
  ]);

  const [results, setResults] = useState<VideoItem[]>([]);
  const [commentsVisible, setCommentsVisible] = useState(false);

  const handleSearch = () => {
    if (!search.trim()) return;

    setHistory((p) => [search, ...p.filter((h) => h !== search)]);

    const fake = Array.from({ length: 8 }).map((_, i) => ({
      id: String(i),
      title: `${search} video ${i}`,
      uri: require("../../assets/video/decidelo.mp4"),
      user: "usuario_" + i,
    }));

    setResults(fake);
  };

  return (
    <View style={styles.container}>

      {/* 🔎 SEARCH SIEMPRE ARRIBA */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Buscar videos..."
          placeholderTextColor="#777"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          style={styles.input}
        />
      </View>

      {/* 📌 HISTORIAL */}
      <View style={styles.history}>
        {history.map((h, i) => (
          <Text key={i} style={{ color: "#888" }}>{h}</Text>
        ))}
      </View>

      {/* GRID VIDEOS */}
      <FlatList
        data={results}
        numColumns={2}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelected(item)}
          >
            <Text style={{ color: "white" }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 🎬 FULLSCREEN VIDEO */}
      {selected && (
        <VideoPlayer
          item={selected}
          onClose={() => setSelected(null)}
          openComments={() => setCommentsVisible(true)}
        />
      )}

      {/* 💬 COMMENTS MODAL */}
      <CommentsModal
        visible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
        videoId={selected?.id}
      />

    </View>
  );
}

/* ================= VIDEO PLAYER (TIKTOK STYLE REAL) ================= */
function VideoPlayer({ item, onClose, openComments }: any) {

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(120);
  const [paused, setPaused] = useState(false);

  const [votes, setVotes] = useState({ a: 60, b: 40 });

  const player = useVideoPlayer(item.uri, (p) => {
    p.loop = true;
    p.play();
  });

  const togglePlay = () => {
    if (paused) {
      player.play();
      setPaused(false);
    } else {
      player.pause();
      setPaused(true);
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikes((p) => p + (liked ? -1 : 1));
  };

  const vote = (type: "a" | "b") => {
    setVotes((prev) => {
      if (type === "a") {
        return {
          a: prev.a + 1,
          b: Math.max(0, prev.b - 1),
        };
      }
      return {
        a: Math.max(0, prev.a - 1),
        b: prev.b + 1,
      };
    });
  };

  const total = votes.a + votes.b;
  const pA = Math.round((votes.a / total) * 100);
  const pB = Math.round((votes.b / total) * 100);

  return (
    <View style={styles.full}>

      {/* VIDEO */}
      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
      />

      {/* TAP PLAY/PAUSE */}
      <Pressable style={styles.touch} onPress={togglePlay} />

      {/* BACK */}
      <Pressable style={styles.back} onPress={onClose}>
        <Ionicons name="close" size={32} color="white" />
      </Pressable>

      {/* 👤 USER */}
      <View style={styles.user}>
        <View style={styles.avatar} />
        <Text style={{ color: "white" }}>{item.user}</Text>
        <Pressable style={styles.follow}>
          <Text style={{ color: "white" }}>Seguir</Text>
        </Pressable>
      </View>

      {/* ❤️ RIGHT ACTIONS */}
      <View style={styles.actions}>

        <Pressable onPress={toggleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={34}
            color={liked ? "red" : "white"}
          />
          <Text style={{ color: "white" }}>{likes}</Text>
        </Pressable>

        <Pressable onPress={openComments}>
          <Ionicons name="chatbubble-outline" size={34} color="white" />
        </Pressable>

        <Ionicons name="share-social-outline" size={34} color="white" />

        {/* 🗳 VOTOS */}
        <View style={{ marginTop: 10 }}>
          <Pressable onPress={() => vote("a")}>
            <Text style={{ color: "white" }}>Sí {pA}%</Text>
          </Pressable>

          <Pressable onPress={() => vote("b")}>
            <Text style={{ color: "white" }}>No {pB}%</Text>
          </Pressable>
        </View>

      </View>

      {/* 📝 DESCRIPTION */}
      <View style={styles.desc}>
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {item.title}
        </Text>
        <Text style={{ color: "#aaa" }}>
          descripción estilo TikTok con usuario real
        </Text>
      </View>

    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 50,
  },

  searchBox: {
    padding: 10,
  },

  input: {
    backgroundColor: "#111",
    color: "white",
    padding: 10,
    borderRadius: 10,
  },

  history: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  card: {
    flex: 1,
    margin: 5,
    height: 120,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  full: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },

  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  touch: {
    ...StyleSheet.absoluteFillObject,
  },

  back: {
    position: "absolute",
    top: 50,
    left: 15,
  },

  user: {
    position: "absolute",
    bottom: 180,
    left: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "gray",
  },

  follow: {
    marginLeft: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
  },

  actions: {
    position: "absolute",
    right: 15,
    bottom: 120,
    alignItems: "center",
    gap: 20,
  },

  desc: {
    position: "absolute",
    bottom: 30,
    left: 15,
    right: 80,
  },
});