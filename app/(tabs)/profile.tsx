import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av"; // reproductor de video

const { width } = Dimensions.get("window");

export default function Profile() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [avatar, setAvatar] = useState("https://via.placeholder.com/150");

  const user = {
    name: "Juan Pérez",
    username: "@juanp",
    followers: 1200,
    following: 300,
    likes: 4500,
    videos: [
      { id: "1", source:require("../../assets/video/decidelo.mp4")},
    ],
  };

  // Abrir galería para cambiar foto
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra superior con engranaje */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="settings-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Imagen de perfil con botón + */}
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <TouchableOpacity style={styles.addButton} onPress={pickImage}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Nombre y usuario */}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.username}>{user.username}</Text>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{user.followers}</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{user.following}</Text>
          <Text style={styles.statLabel}>Siguiendo</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{user.likes}</Text>
          <Text style={styles.statLabel}>Me gusta</Text>
        </View>
      </View>

      {/* Mosaico de videos */}
      <FlatList
        data={user.videos}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <Video
            source={item.source}
            style={styles.videoThumbnail}
            resizeMode="cover"
            isLooping
            shouldPlay={false} // no se reproducen automáticamente
          />
        )}
        contentContainerStyle={styles.videoGrid}
      />

      {/* Modal de ajustes */}
      <Modal visible={menuVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajustes</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cuenta</Text>
              <Text style={styles.option}>Privacidad</Text>
              <Text style={styles.option}>Seguridad</Text>
              <Text style={styles.option}>Permisos</Text>
              <Text style={styles.option}>Compartir perfil</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contenido de pantalla</Text>
              <Text style={styles.option}>Idioma</Text>
              <Text style={styles.option}>Estilo de pantalla</Text>
              <Text style={styles.option}>Notificaciones</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setMenuVisible(false)}>
              <Text style={{ color: "white" }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  avatarWrapper: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    borderWidth: 2,
    borderColor: "white",
  },
  addButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: (width * 0.1) / 2,
    width: width * 0.1,
    height: width * 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: { color: "white", fontSize: width * 0.06 },
  name: { fontSize: width * 0.05, fontWeight: "bold", marginTop: 10, color: "white", textAlign: "center" },
  username: { fontSize: width * 0.04, color: "gray", textAlign: "center" },
  statsContainer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  stat: { alignItems: "center", marginHorizontal: 15 },
  statNumber: { fontSize: width * 0.045, fontWeight: "bold", color: "white" },
  statLabel: { fontSize: width * 0.035, color: "gray" },
  videoGrid: { paddingVertical: 20 },
  videoThumbnail: {
    width: width / 3 - 10,
    height: width / 3 - 10,
    margin: 5,
    borderRadius: 8,
    backgroundColor: "#222",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1c1c1c",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: { color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  section: { marginBottom: 15 },
  sectionTitle: { color: "#007AFF", fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  option: { color: "white", fontSize: 14, marginVertical: 2 },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});
