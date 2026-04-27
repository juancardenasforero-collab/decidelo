import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function VideoDescription({ user, description }: any) {
  const [expanded, setExpanded] = useState(false);
  const [following, setFollowing] = useState(false);

  return (
    <>
      {/* TEXTO ABAJO */}
      <View style={styles.container} pointerEvents="box-none">
        
        {/* 👤 usuario + seguir */}
        <View style={styles.userRow}>
          <Text style={styles.user}>{user}</Text>

          <TouchableOpacity
            style={styles.followBtn}
            onPress={() => setFollowing(!following)}
          >
            <Ionicons
              name={following ? "checkmark" : "add"}
              size={16}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.desc} numberOfLines={2}>
          {description}
        </Text>

        <TouchableOpacity onPress={() => setExpanded(true)}>
          <Text style={styles.more}>more</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 MODAL */}
      <Modal visible={expanded} animationType="slide" transparent>
        <View style={styles.overlay}>
          
          {/* fondo oscuro */}
          <TouchableOpacity
            style={styles.backdrop}
            onPress={() => setExpanded(false)}
          />

          {/* contenido */}
          <View style={styles.sheet}>
            
            {/* 👤 usuario + seguir (también aquí) */}
            <View style={styles.userRow}>
              <Text style={styles.user}>{user}</Text>

              <TouchableOpacity
                style={styles.followBtn}
                onPress={() => setFollowing(!following)}
              >
                <Ionicons
                  name={following ? "checkmark" : "add"}
                  size={16}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.fullText}>
              {description}
            </Text>

            {/* 💬 comentarios fake */}
            

          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 100,
    zIndex: 5,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  user: {
    color: "white",
    fontWeight: "bold",
    textShadowColor: "black",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  followBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ff2d55", // estilo TikTok
    justifyContent: "center",
    alignItems: "center",
  },

  desc: {
    color: "white",
    marginTop: 5,
    textShadowColor: "black",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  more: {
    color: "gray",
    marginTop: 5,
  },

  // 🔥 MODAL
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  sheet: {
    backgroundColor: "#111",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },

  fullText: {
    color: "white",
    marginTop: 10,
  },

  commentsTitle: {
    color: "white",
    marginTop: 20,
    fontWeight: "bold",
  },

  comment: {
    color: "gray",
    marginTop: 10,
  },
});