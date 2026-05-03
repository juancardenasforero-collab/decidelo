import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CommentsModal from "./CommentsModal";
import VideoDescription from "./VideoDescription";

const { height } = Dimensions.get("window");

export default function VideoCard({ item, isActive }: any) {
  const navigation = useNavigation();
  const router = useRouter();
  const isFocused = useIsFocused();

  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(120);

  const [commentsVisible, setCommentsVisible] = useState(false);

  const [votes, setVotes] = useState({ a: 60, b: 40 });

  const [showAuthAlert, setShowAuthAlert] = useState(false);

  const requireAuth = async () => {
    const value = await AsyncStorage.getItem("isLogged");

    if (value !== "true") {
      setShowAuthAlert(true);
      return false;
    }

    return true;
  };

  const total = votes.a + votes.b;
  const percentA = total > 0 ? Math.round((votes.a / total) * 100) : 0;
  const percentB = total > 0 ? Math.round((votes.b / total) * 100) : 0;

  const player = useVideoPlayer(item.uri, (player) => {
    player.loop = true;

    player.addListener("playingChange", ({ isPlaying }) => {
      setPlaying(isPlaying);
    });
  });

  // ▶️ control normal de activación del item en feed
  useEffect(() => {
    if (isActive && isFocused) {
      player.muted = false;
      player.play();
    } else {
      player.muted = true;
      player.pause();
    }
  }, [isActive, isFocused]);

  // 🔇 CONTROL AL CAMBIAR DE PANTALLA (SEARCH, PROFILE, ETC)
  useEffect(() => {
    if (!isFocused) {
      player.muted = true;
    }
  }, [isFocused]);

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
    player.playing ? player.pause() : player.play();
  };

  const handleLike = async () => {
    if (!(await requireAuth())) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);
  };

  const handleVote = async (option: "a" | "b") => {
    if (!(await requireAuth())) return;

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

  const handleShare = async () => {
    if (!(await requireAuth())) return;
    await Sharing.shareAsync(item.uri);
  };

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
        nativeControls={false}
      />

      <Pressable style={styles.touchLayer} onPress={togglePlay} />

      {!playing && isActive && (
        <View style={styles.pauseOverlay} pointerEvents="none" />
      )}

      {!playing && isActive && (
        <View style={styles.playOverlay} pointerEvents="none">
          <Ionicons name="play" size={60} color="white" />
        </View>
      )}

      {/* VOTACIÓN */}
      <View style={styles.voteContainer}>
        <Pressable style={styles.option} onPress={() => handleVote("a")}>
          <Text style={styles.optionText}>Sí</Text>
          <Text style={styles.percent}>{percentA}%</Text>
        </Pressable>

        <Pressable style={styles.option} onPress={() => handleVote("b")}>
          <Text style={styles.optionText}>No</Text>
          <Text style={styles.percent}>{percentB}%</Text>
        </Pressable>
      </View>

      {/* ACCIONES */}
      <View style={styles.actions}>
        <Pressable onPress={handleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={32}
            color={liked ? "red" : "white"}
          />
          <Text style={styles.count}>{likes}</Text>
        </Pressable>

        <Pressable
          onPress={async () => {
            if (!(await requireAuth())) return;
            setCommentsVisible(true);
          }}
        >
          <Ionicons name="chatbubble-outline" size={30} color="white" />
        </Pressable>

        <Pressable onPress={handleShare}>
          <Ionicons name="share-social-outline" size={30} color="white" />
        </Pressable>
      </View>

      <View style={styles.descriptionWrapper}>
        <VideoDescription user={item.user} description={item.description} />
      </View>

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

      {showAuthAlert && (
        <Pressable
          style={styles.authOverlay}
          onPress={() => setShowAuthAlert(false)}
        >
          <Pressable style={styles.authBox}>
            <Text style={styles.authText}>
              Regístrate para interactuar
            </Text>

            <Pressable
              onPress={() => {
                setShowAuthAlert(false);
                router.push("/auth");
              }}
              style={styles.authButton}
            >
              <Text style={styles.authButtonText}>
                Registrarme
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      )}

      <CommentsModal
        visible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
        videoId={item.id}
      />
    </View>
  );
}

/* estilos sin cambios */
const styles = StyleSheet.create({
  container: { height, backgroundColor: "black" },
  video: { width: "100%", height: "100%", position: "absolute" },
  touchLayer: { ...StyleSheet.absoluteFillObject },
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
  percent: { color: "white" },
  actions: {
    position: "absolute",
    right: 10,
    bottom: 150,
    gap: 20,
    alignItems: "center",
  },
  descriptionWrapper: {
    position: "absolute",
    bottom: 16,
    left: 15,
    right: 100,
  },
  count: { color: "white", fontSize: 12 },
  sliderContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  authOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  authBox: {
    width: "85%",
    backgroundColor: "#111",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },
  authText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  authButton: {
    backgroundColor: "#ff2d55",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  authButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});