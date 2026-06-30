import { View, StyleSheet } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";


export default function Splash() {
  const router = useRouter();

  const player = useVideoPlayer(
    require("../assets/video/decidelo.mp4"),
    (player) => {
      player.loop = false;
      player.muted = true;
      player.play();
    }
  );

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(
    auth,
    (user) => {
      setTimeout(() => {
        if (user) {
          router.replace("/(tabs)");
        } else {
          router.replace("/auth");
        }
      }, 3000);
    }
  );

  return unsubscribe;
}, []);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls={false} // 🔥 CLAVE: quita controles
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    aspectRatio: 1,
  },
});