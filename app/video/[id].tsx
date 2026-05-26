import { useLocalSearchParams } from "expo-router";

import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import {
  VideoView,
  useVideoPlayer,
} from "expo-video";

const { height, width } =
  Dimensions.get("window");

export default function VideoScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();

  const videoUri =
    typeof params.uri === "string"
      ? params.uri
      : "";

  const username =
    typeof params.username === "string"
      ? params.username
      : "@juan";

  const description =
    typeof params.description === "string"
      ? params.description
      : "Video";

  const player = useVideoPlayer(
    videoUri,
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  return (
    <View style={styles.container}>
      {/* VIDEO */}

      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      {/* CLOSE */}

      <Pressable
        style={styles.closeBtn}
        onPress={() => router.back()}
      >
        <Ionicons
          name="close"
          size={34}
          color="white"
        />
      </Pressable>

      {/* RIGHT ACTIONS */}

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn}>
          <Ionicons
            name="heart-outline"
            size={32}
            color="white"
          />
          <Text style={styles.actionText}>
            1.2K
          </Text>
        </Pressable>

        <Pressable style={styles.actionBtn}>
          <Ionicons
            name="chatbubble-outline"
            size={30}
            color="white"
          />
          <Text style={styles.actionText}>
            120
          </Text>
        </Pressable>

        <Pressable style={styles.actionBtn}>
          <Ionicons
            name="share-social-outline"
            size={30}
            color="white"
          />
          <Text style={styles.actionText}>
            Compartir
          </Text>
        </Pressable>
      </View>

      {/* DESCRIPTION */}

      <View style={styles.bottomInfo}>
        <Text style={styles.username}>
          {username}
        </Text>

        <Text style={styles.description}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  video: {
    width,
    height,
    position: "absolute",
  },

  closeBtn: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },

  actions: {
    position: "absolute",
    right: 12,
    bottom: 140,
    alignItems: "center",
    gap: 24,
  },

  actionBtn: {
    alignItems: "center",
  },

  actionText: {
    color: "white",
    marginTop: 4,
    fontSize: 12,
  },

  bottomInfo: {
    position: "absolute",
    bottom: 40,
    left: 15,
    right: 80,
  },

  username: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },

  description: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },
});