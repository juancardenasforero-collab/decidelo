import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function VideoDescription({ user, description }: any) {
  const [expanded, setExpanded] = useState(false);
  const [following, setFollowing] = useState(false);

  const shortText = description.slice(0, 80);

  return (
    <View style={styles.container}>
      
      {/* 👤 usuario + follow */}
      <View style={styles.userRow}>
        <View style={styles.avatar}>
          <Text style={{ color: "white" }}>U</Text>
        </View>

        <TouchableOpacity
          style={styles.followBtn}
          onPress={() => setFollowing(!following)}
        >
          <Ionicons
            name={following ? "checkmark" : "add"}
            size={14}
            color="white"
          />
        </TouchableOpacity>

        <Text style={styles.username}>{user}</Text>
      </View>

      {/* 📝 descripción */}
      <Text style={styles.text}>
        {expanded ? description : shortText}

        {description.length > 80 && (
          <Text style={styles.more} onPress={() => setExpanded(!expanded)}>
            {expanded ? "  menos" : "  more"}
          </Text>
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    left: 15,
    right: 80,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },

  followBtn: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -10,
    marginRight: 8,
  },

  username: {
    color: "white",
    fontWeight: "bold",
  },

  text: {
    color: "white",
  },

  more: {
    color: "gray",
  },
});