import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from "react-native";

/* ================= TYPES ================= */
type Video = {
  id: string;
  title: string;
  thumbnail: string;
};

/* ================= COMPONENT ================= */
export default function Home() {
  const [search, setSearch] = useState<string>("");

  const [history, setHistory] = useState<string[]>([
    "perros graciosos",
    "gym motivación",
    "comida callejera",
  ]);

  const [results, setResults] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const [feedPaused, setFeedPaused] = useState<boolean>(false);

  /* 🔎 SEARCH */
  const executeSearch = () => {
    if (!search.trim()) return;

    setHistory((prev) => {
      const updated = [search, ...prev.filter((h) => h !== search)];
      return updated.slice(0, 10);
    });

    const fakeResults: Video[] = Array.from({ length: 12 }).map((_, i) => ({
      id: i.toString(),
      title: `${search} video ${i + 1}`,
      thumbnail: `https://picsum.photos/400/400?random=${i}`,
    }));

    setResults(fakeResults);
  };

  /* 🎬 OPEN VIDEO */
  const openVideo = (video: Video) => {
    setSelectedVideo(video);
    setFeedPaused(true); // 🔥 pausa todo el feed (evita audio)
  };

  /* ❌ CLOSE VIDEO */
  const closeVideo = () => {
    setSelectedVideo(null);
    setFeedPaused(false);
  };

  return (
    <View style={styles.container}>
      {/* 🔎 SEARCH BAR */}
      <View style={styles.searchBox}>
        <Text style={styles.icon}>⌕</Text>

        <TextInput
          placeholder="Buscar"
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={executeSearch}
          style={styles.input}
        />

        <Text style={styles.icon}>🎙</Text>
      </View>

      {/* 🟡 SEARCH VIEW (HISTORIAL + GRID) */}
      {!selectedVideo && (
        <>
          {/* HISTORIAL */}
          <View style={styles.historyContainer}>
            {history.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSearch(item)}
                style={styles.historyItem}
              >
                <Text style={styles.historyText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* GRID */}
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.videoBox}
                onPress={() => openVideo(item)}
              >
                <Image source={{ uri: item.thumbnail }} style={styles.image} />
                <Text numberOfLines={1} style={styles.videoTitle}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* 🎬 FULLSCREEN PLAYER */}
      <Modal visible={!!selectedVideo} animationType="fade">
        <View style={styles.player}>
          <View style={styles.videoArea}>
            <Text style={styles.videoText}>🎬 REPRODUCIENDO</Text>
            <Text style={styles.videoSub}>{selectedVideo?.title}</Text>
          </View>

          <TouchableOpacity style={styles.backBtn} onPress={closeVideo}>
            <Text style={{ color: "#fff" }}>← Volver</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLES (TIKTOK DARK) ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 50,
    paddingHorizontal: 10,
  },

  /* SEARCH */
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121212",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },

  input: {
    flex: 1,
    color: "#fff",
    marginHorizontal: 10,
  },

  icon: {
    color: "#bbb",
    fontSize: 18,
  },

  /* HISTORY */
  historyContainer: {
    marginBottom: 10,
  },

  historyItem: {
    paddingVertical: 6,
    borderBottomColor: "#222",
    borderBottomWidth: 1,
  },

  historyText: {
    color: "#aaa",
  },

  /* GRID */
  videoBox: {
    flex: 1,
    margin: 3,
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },

  videoTitle: {
    fontSize: 10,
    color: "#aaa",
  },

  /* PLAYER */
  player: {
    flex: 1,
    backgroundColor: "#000",
  },

  videoArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },

  videoText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  videoSub: {
    color: "#888",
    marginTop: 10,
  },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
  },
});