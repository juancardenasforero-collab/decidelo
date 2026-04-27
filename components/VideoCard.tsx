import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import Slider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import * as Haptics from "expo-haptics";
import VideoDescription from "./VideoDescription";
import CommentsModal from "./CommentsModal";

const { height } = Dimensions.get("window");

export default function VideoCard({ item, isActive }: any) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(120);

  const [commentsVisible, setCommentsVisible] = useState(false);

  const [votes, setVotes] = useState({ a: 60, b: 40 });

  const total = votes.a + votes.b;
  const percentA = total > 0 ? Math.round((votes.a / total) * 100) : 0;
  const percentB = total > 0 ? Math.round((votes.b / total) * 100) : 0;

  // 🎬 VIDEO PLAYER
  const player = useVideoPlayer(item.uri, (player) => {
    player.loop = true;

    player.addListener("playingChange", ({ isPlaying }) => {
      setPlaying(isPlaying);
    });
  });

  // ▶️ autoplay por scroll
  useEffect(() => {
    if (isActive) {
      player.play();
      player.muted = false;
    } else {
      player.pause();
      player.muted = true;
    }
  }, [isActive]);

  // ⏱ progreso
  useEffect(() => {
    const interval = setInterval(() => {
      if (player.duration > 0) {
        setProgress(player.currentTime / player.duration);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // ▶️ play / pause
  const togglePlay = () => {
    if (!isActive) return;
    player.playing ? player.pause() : player.play();
  };

  // ❤️ like
  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);
  };

  // 🗳 votar
  const handleVote = (option: "a" | "b") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setVotes((prev) => {
      if (option === "a") {
        return {
          a: prev.a >= 100 ? 100 : prev.a + 1,
          b: prev.b <= 0 ? 0 : prev.b - 1,
        };
      } else {
        return {
          a: prev.a <= 0 ? 0 : prev.a - 1,
          b: prev.b >= 100 ? 100 : prev.b + 1,
        };
      }
    });
  };

  // 📤 share
  const handleShare = async () => {
    await Sharing.shareAsync(item.uri);
  };

  return (
    <View style={styles.container}>
      
      {/* 🎬 VIDEO */}
      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
        nativeControls={false}
      />

      {/* 👆 TAP SOLO FONDO */}
      <Pressable style={styles.touchLayer} onPress={togglePlay} />

      {/* ⏸ overlay */}
      {!playing && isActive && (
        <View style={styles.pauseOverlay} pointerEvents="none" />
      )}

      {!playing && isActive && (
        <View style={styles.playOverlay} pointerEvents="none">
          <Ionicons name="play" size={60} color="white" />
        </View>
      )}

      {/* 🗳 VOTACIÓN */}
      <View style={styles.voteContainer} pointerEvents="box-none">
        <Pressable
          style={({ pressed }) => [
            styles.option,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={() => handleVote("a")}
        >
          <Text style={styles.optionText}>Sí</Text>
          <Text style={styles.percent}>{percentA}%</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.option,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={() => handleVote("b")}
        >
          <Text style={styles.optionText}>No</Text>
          <Text style={styles.percent}>{percentB}%</Text>
        </Pressable>
      </View>

      {/* ❤️ ACCIONES */}
      <View style={styles.actions} pointerEvents="box-none">
        <Pressable onPress={handleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={32}
            color={liked ? "red" : "white"}
          />
          <Text style={styles.count}>{likes}</Text>
        </Pressable>

        {/* 💬 ABRE COMMENTS MODAL */}
        <Pressable onPress={() => setCommentsVisible(true)}>
          <Ionicons name="chatbubble-outline" size={30} color="white" />
        </Pressable>

        <Pressable onPress={handleShare}>
          <Ionicons name="share-social-outline" size={30} color="white" />
        </Pressable>
      </View>

      {/* 📝 DESCRIPCIÓN */}
      <View style={styles.descriptionWrapper} pointerEvents="box-none">
        <VideoDescription
          user={item.user}
          description={item.description}
        />
      </View>

      {/* ⏱ SLIDER */}
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

      {/* 🔥 AQUÍ ESTÁ LA CLAVE */}
      <CommentsModal
  visible={commentsVisible}
  onClose={() => setCommentsVisible(false)}
  videoId={item.id}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height, backgroundColor: "black" },

  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  touchLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 2,
  },

  playOverlay: {
    position: "absolute",
    top: "40%",
    left: "40%",
    zIndex: 3,
  },

  voteContainer: {
    position: "absolute",
    bottom: 180,
    left: 15,
    right: 15,
    flexDirection: "row",
    gap: 10,
    zIndex: 4,
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
    zIndex: 4,
  },

  descriptionWrapper: {
    position: "absolute",
    bottom: 16,
    left: 15,
    right: 100,
    zIndex: 5,
  },

  count: { color: "white", fontSize: 12 },

  sliderContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    zIndex: 4,
  },
});