import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import Slider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import * as Haptics from "expo-haptics";

const { height } = Dimensions.get("window");

export default function VideoCard({ item, isActive }: any) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);

  // ❤️ like
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(120);

  // 💬 comentarios
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [commentText, setCommentText] = useState("");

  // 🗳 votos
  const [votes, setVotes] = useState({ a: 60, b: 40 });

  const player = useVideoPlayer(item.uri, (player) => {
    player.loop = true;

    player.addListener("playingChange", ({ isPlaying }) => {
      setPlaying(isPlaying);
    });
  });

  useEffect(() => {
    if (isActive) {
      player.play();
      player.muted = false;
    } else {
      player.pause();
      player.muted = true;
    }
  }, [isActive]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player.duration > 0) {
        setProgress(player.currentTime / player.duration);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (!isActive) return;

    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  // ❤️ LIKE
  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }

    setLiked(!liked);
  };

  // 🗳 VOTAR
  const handleVote = (option: "a" | "b") => {
    const total = votes.a + votes.b;

    let newVotes = { ...votes };

    if (option === "a") newVotes.a += 1;
    else newVotes.b += 1;

    const newTotal = newVotes.a + newVotes.b;

    setVotes({
      a: Math.round((newVotes.a / newTotal) * 100),
      b: Math.round((newVotes.b / newTotal) * 100),
    });
  };

  // 📤 SHARE
  const handleShare = async () => {
    await Sharing.shareAsync(item.uri);
  };

  return (
    <View style={styles.container}>
      
      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
        nativeControls={false}
        onTouchEnd={togglePlay}
      />

      {/* overlay pausa */}
      {!playing && isActive && (
        <View style={styles.pauseOverlay} pointerEvents="none" />
      )}

      {/* play icon */}
      {!playing && isActive && (
        <View style={styles.playOverlay} pointerEvents="none">
          <Ionicons name="play" size={60} color="white" />
        </View>
      )}

      {/* 🗳 VOTACIÓN */}
      <View style={styles.voteContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleVote("a")}
        >
          <Text style={styles.optionText}>Sí</Text>
          <Text style={styles.percent}>{votes.a}%</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => handleVote("b")}
        >
          <Text style={styles.optionText}>No</Text>
          <Text style={styles.percent}>{votes.b}%</Text>
        </TouchableOpacity>
      </View>

      {/* ❤️ ACCIONES */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={32}
            color={liked ? "red" : "white"}
          />
          <Text style={styles.count}>{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCommentsVisible(true)}>
          <Ionicons name="chatbubble-outline" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-social-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* INFO */}
      <View style={styles.info}>
        <Text style={styles.user}>{item.user}</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </View>

      {/* SLIDER */}
      {!playing && isActive && (
        <View style={styles.sliderContainer}>
          <Slider
            value={progress}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="gray"
            thumbTintColor="white"
            onSlidingComplete={(value) => {
              player.currentTime = value * player.duration;
            }}
          />
        </View>
      )}

      {/* 💬 MODAL COMENTARIOS */}
      <Modal visible={commentsVisible} animationType="slide">
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Comentarios
          </Text>

          <TextInput
            placeholder="Escribe un comentario..."
            value={commentText}
            onChangeText={setCommentText}
            style={{
              borderWidth: 1,
              marginTop: 20,
              padding: 10,
              borderRadius: 10,
            }}
          />

          <TouchableOpacity
            onPress={() => setCommentsVisible(false)}
            style={{
              marginTop: 20,
              backgroundColor: "black",
              padding: 15,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              Cerrar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height, backgroundColor: "black" },
  video: { width: "100%", height: "100%", position: "absolute" },

  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  playOverlay: {
    position: "absolute",
    top: "40%",
    left: "40%",
  },

  voteContainer: {
    position: "absolute",
    bottom: 180,
    left: 15,
    right: 15,
    flexDirection: "row",
    gap: 10,
  },

  option: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  optionText: { color: "white", fontWeight: "bold" },
  percent: { color: "white", marginTop: 5 },

  actions: {
    position: "absolute",
    right: 10,
    bottom: 150,
    gap: 20,
    alignItems: "center",
  },

  count: { color: "white", fontSize: 12 },

  info: { position: "absolute", bottom: 80, left: 15 },
  user: { color: "white", fontWeight: "bold" },
  desc: { color: "white", marginTop: 5 },

  sliderContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
});