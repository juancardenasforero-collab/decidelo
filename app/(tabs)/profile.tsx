import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal,
  Pressable,
  ActivityIndicator,
  ScrollView
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";

import { Video, ResizeMode } from "expo-av";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Profile() {
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const [menuVisible, setMenuVisible] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [refresh, setRefresh] =
    useState(false);

  /* ================= USER ================= */

  const [user, setUser] = useState({
    id: "1",

    name: "Juan Pérez",

    username: "@juanp",

    bio: "Tomando decisiones malas profesionalmente 😂",

    avatar:
      "https://i.pravatar.cc/300",

    followers: 1200,

    following: 300,

    likes: 4500,

    videos: [],
  });

  /* ================= LOAD ================= */

  useEffect(() => {
    loadProfile();

    loadVideos();
  }, [refresh]);

  /* ================= LOAD PROFILE ================= */

  const loadProfile = async () => {
    try {
      const savedAvatar =
        await AsyncStorage.getItem(
          "profile_avatar"
        );

      if (savedAvatar) {
        setUser((prev) => ({
          ...prev,
          avatar: savedAvatar,
        }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  /* ================= LOAD VIDEOS ================= */

  const loadVideos = async () => {
    try {
      const savedVideos =
        await AsyncStorage.getItem(
          "user_videos"
        );

      if (savedVideos) {
        setUser((prev) => ({
          ...prev,
          videos: JSON.parse(savedVideos),
        }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  /* ================= CHANGE PHOTO ================= */

  const pickImage = async () => {
    try {
      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes:
            ImagePicker.MediaTypeOptions.Images,

          allowsEditing: true,

          aspect: [1, 1],

          quality: 1,
        });

      if (!result.canceled) {
        const uri = result.assets[0].uri;

        setLoading(true);

        await AsyncStorage.setItem(
          "profile_avatar",
          uri
        );

        setUser((prev) => ({
          ...prev,
          avatar: uri,
        }));

        setLoading(false);
      }
    } catch (e) {
      console.log(e);

      setLoading(false);
    }
  };

  /* ================= DELETE VIDEO ================= */

  const deleteVideo = async (
    id: string
  ) => {
    try {
      const updatedVideos =
        user.videos.filter(
          (video: any) =>
            video.id !== id
        );

      await AsyncStorage.setItem(
        "user_videos",
        JSON.stringify(updatedVideos)
      );

      setUser((prev) => ({
        ...prev,
        videos: updatedVideos,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  /* ================= CHECK VOTING ================= */

  const getVotingStatus = (
    item: any
  ) => {
    const createdAt =
      item.createdAt || Date.now();

    const duration =
      item.duration || "24h";

    let durationMs = 24 * 60 * 60 * 1000;

    if (duration === "1h") {
      durationMs =
        1 * 60 * 60 * 1000;
    }

    if (duration === "12h") {
      durationMs =
        12 * 60 * 60 * 1000;
    }

    if (duration === "24h") {
      durationMs =
        24 * 60 * 60 * 1000;
    }

    if (duration === "3d") {
      durationMs =
        3 * 24 * 60 * 60 * 1000;
    }

    const finished =
      Date.now() >
      createdAt + durationMs;

    let winner = "Empate";

    if (
      (item.votesA || 0) >
      (item.votesB || 0)
    ) {
      winner =
        item.optionA || "Opción A";
    }

    if (
      (item.votesB || 0) >
      (item.votesA || 0)
    ) {
      winner =
        item.optionB || "Opción B";
    }

    return {
      finished,
      winner,
    };
  };

  /* ================= VIDEO ITEM ================= */

  const renderVideo = ({ item }: any) => {
    const voting =
      getVotingStatus(item);

    return (
      <Pressable
        style={styles.videoCard}
        onPress={() =>
          router.push({
            pathname: "/video/[id]",

            params: {
              id: item.id,

              uri: item.uri,

              username:
                item.username ||
                user.username,

              description:
                item.description ||
                "Sin descripción",

              likes:
                String(item.likes || 0),

              comments:
                String(
                  item.comments || 0
                ),

              shares:
                String(
                  item.shares || 0
                ),

              optionA:
                item.optionA || "",

              optionB:
                item.optionB || "",

              votesA: String(
                item.votesA || 0
              ),

              votesB: String(
                item.votesB || 0
              ),

              duration:
                item.duration || "24h",

              createdAt: String(
                item.createdAt ||
                  Date.now()
              ),
            },
          })
        }
      >
        {/* VIDEO */}

        <Video
          source={{ uri: item.uri }}
          style={styles.videoThumbnail}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false}
          isLooping
          isMuted
        />

        {/* PLAY ICON */}

        <View style={styles.videoOverlay}>
          <Ionicons
            name="play"
            size={20}
            color="white"
          />
        </View>

        {/* LIKES */}

        <View style={styles.likesOverlay}>
          <Ionicons
            name="heart"
            size={12}
            color="white"
          />

          <Text style={styles.likesText}>
            {item.likes || 0}
          </Text>
        </View>

        {/* VOTES */}

        <View style={styles.voteOverlay}>
          <Text style={styles.voteText}>
            🅰 {item.votesA || 0}
          </Text>

          <Text style={styles.voteText}>
            🅱 {item.votesB || 0}
          </Text>
        </View>

        {/* RESULT */}

        <View
          style={[
            styles.resultOverlay,

            {
              backgroundColor:
                voting.finished
                  ? "#16a34a"
                  : "#ff2d55",
            },
          ]}
        >
          <Text
            style={styles.resultText}
          >
            {voting.finished
              ? `Ganó: ${voting.winner}`
              : "Votación activa"}
          </Text>
        </View>

        {/* DELETE */}

        <Pressable
          style={styles.deleteBtn}
          onPress={() =>
            deleteVideo(item.id)
          }
        >
          <Ionicons
            name="trash"
            size={16}
            color="white"
          />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}

      <View
        style={[
          styles.header,

          {
            paddingTop:
              insets.top + 10,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            setMenuVisible(true)
          }
        >
          <Ionicons
            name="menu"
            size={28}
            color="white"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {user.username}
        </Text>

        <TouchableOpacity
          onPress={() =>
            setRefresh(!refresh)
          }
        >
          <Ionicons
            name="refresh"
            size={26}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* ================= PROFILE ================= */}

      <FlatList
        data={user.videos}
        keyExtractor={(item: any) =>
          item.id
        }
        numColumns={3}
        renderItem={renderVideo}
        showsVerticalScrollIndicator={
          false
        }
        ListEmptyComponent={
          <View
            style={styles.emptyContainer}
          >
            <Ionicons
              name="videocam-outline"
              size={70}
              color="#444"
            />

            <Text style={styles.emptyText}>
              Aún no has publicado
              videos
            </Text>

            <Text
              style={
                styles.emptySubText
              }
            >
              Ve al botón + y crea
              tu primer video 🔥
            </Text>
          </View>
        }
        ListHeaderComponent={
          <>
            {/* PHOTO */}

            <View
              style={
                styles.avatarWrapper
              }
            >
              <Image
                source={{
                  uri: user.avatar,
                }}
                style={styles.avatar}
              />

              <TouchableOpacity
                style={
                  styles.editAvatar
                }
                onPress={pickImage}
              >
                {loading ? (
                  <ActivityIndicator
                    color="white"
                  />
                ) : (
                  <Ionicons
                    name="camera"
                    size={18}
                    color="white"
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* NAME */}

            <Text style={styles.name}>
              {user.name}
            </Text>

            <Text
              style={styles.username}
            >
              {user.username}
            </Text>

            <Text style={styles.bio}>
              {user.bio}
            </Text>

            {/* STATS */}

            <View
              style={
                styles.statsContainer
              }
            >
              <View style={styles.stat}>
                <Text
                  style={
                    styles.statNumber
                  }
                >
                  {user.followers}
                </Text>

                <Text
                  style={
                    styles.statLabel
                  }
                >
                  Seguidores
                </Text>
              </View>

              <View style={styles.stat}>
                <Text
                  style={
                    styles.statNumber
                  }
                >
                  {user.following}
                </Text>

                <Text
                  style={
                    styles.statLabel
                  }
                >
                  Siguiendo
                </Text>
              </View>

              <View style={styles.stat}>
                <Text
                  style={
                    styles.statNumber
                  }
                >
                  {user.likes}
                </Text>

                <Text
                  style={
                    styles.statLabel
                  }
                >
                  Likes
                </Text>
              </View>
            </View>

            {/* BUTTONS */}

            <View
              style={
                styles.buttonsRow
              }
            >
              <TouchableOpacity
                style={
                  styles.editButton
                }
              >
                <Text
                  style={
                    styles.editButtonText
                  }
                >
                  Editar perfil
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.shareButton
                }
              >
                <Ionicons
                  name="share-social-outline"
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            {/* TAB */}

            <View
              style={
                styles.tabContainer
              }
            >
              <Ionicons
                name="grid-outline"
                size={26}
                color="white"
              />
            </View>
          </>
        }
      />

      <Modal
  visible={menuVisible}
  animationType="slide"
  transparent
>
  <Pressable
    style={styles.modalOverlay}
    onPress={() => setMenuVisible(false)}
  >
    <Pressable
      style={[
        styles.modalContent,
        {
          paddingBottom: insets.bottom + 25,
        },
      ]}
    >
      <View style={styles.modalBar} />

      <Text style={styles.modalTitle}>
        Ajustes
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {[
          {
            icon: "person-outline",
            label: "Cuenta",
          },
          {
            icon: "create-outline",
            label: "Editar perfil",
          },
          {
            icon: "language-outline",
            label: "Idioma",
          },
          {
            icon: "moon-outline",
            label: "Apariencia",
          },
          {
            icon: "lock-closed-outline",
            label: "Privacidad",
          },
          {
            icon: "notifications-outline",
            label: "Notificaciones",
          },
          {
            icon: "shield-outline",
            label: "Seguridad",
          },
          {
            icon: "analytics-outline",
            label: "Estadísticas",
          },
          {
            icon: "help-circle-outline",
            label: "Centro de ayuda",
          },
          {
            icon: "document-text-outline",
            label: "Términos y condiciones",
          },
          {
            icon: "document-lock-outline",
            label: "Política de privacidad",
          },
          {
            icon: "log-out-outline",
            label: "Cerrar sesión",
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);

              switch (item.label) {
                case "Cuenta":
                  router.push("/settings/account");
                  break;

                case "Editar perfil":
                  router.push(
                    "/settings/edit-profile"
                  );
                  break;

                case "Idioma":
                  router.push(
                    "/settings/language"
                  );
                  break;

                case "Apariencia":
                  router.push("/settings/theme");
                  break;

                case "Privacidad":
                  router.push(
                    "/settings/privacy"
                  );
                  break;

                case "Notificaciones":
                  router.push(
                    "/settings/notifications"
                  );
                  break;

                case "Seguridad":
                  router.push(
                    "/settings/security"
                  );
                  break;

                case "Estadísticas":
                  router.push("/settings/stats");
                  break;

                case "Centro de ayuda":
                  router.push(
                    "/settings/support"
                  );
                  break;

                case "Términos y condiciones":
                  router.push("/settings/terms");
                  break;

                case "Política de privacidad":
                  router.push("/settings/policy");
                  break;
              }
            }}
          >
            <Ionicons
              name={item.icon as any}
              size={22}
              color="white"
            />

            <Text style={styles.menuText}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Pressable>
  </Pressable>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  avatarWrapper: {
    marginTop: 20,
    alignItems: "center",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 100,
  },

  editAvatar: {
    position: "absolute",
    bottom: 0,
    right: width * 0.34,

    width: 34,
    height: 34,

    borderRadius: 20,

    backgroundColor:
      "#ff2d55",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: "black",
  },

  name: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 14,
  },

  username: {
    color: "#aaa",
    fontSize: 15,
    textAlign: "center",
    marginTop: 3,
  },

  bio: {
    color: "white",
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 30,
    lineHeight: 20,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  stat: {
    alignItems: "center",
    marginHorizontal: 24,
  },

  statNumber: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },

  statLabel: {
    color: "#999",
    marginTop: 4,
    fontSize: 13,
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent:
      "center",
    marginTop: 24,
    gap: 10,
  },

  editButton: {
    backgroundColor: "#1f1f1f",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
  },

  editButtonText: {
    color: "white",
    fontWeight: "600",
  },

  shareButton: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
  },

  tabContainer: {
    marginTop: 28,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#1a1a1a",
    alignItems: "center",
  },

  videoCard: {
    width: width / 3,
    height: width / 3 + 30,
    padding: 1,
  },

  videoThumbnail: {
    width: "100%",
    height: "100%",
    backgroundColor: "#111",
  },

  videoOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },

  likesOverlay: {
    position: "absolute",
    left: 8,
    bottom: 8,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      "rgba(0,0,0,0.5)",

    paddingHorizontal: 6,
    paddingVertical: 3,

    borderRadius: 20,
  },

  likesText: {
    color: "white",
    fontSize: 11,
    marginLeft: 4,
    fontWeight: "600",
  },

  voteOverlay: {
    position: "absolute",
    top: 8,
    left: 8,

    backgroundColor:
      "rgba(0,0,0,0.7)",

    borderRadius: 10,

    paddingHorizontal: 6,
    paddingVertical: 4,
  },

  voteText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

  resultOverlay: {
    position: "absolute",
    bottom: 32,
    left: 8,

    borderRadius: 10,

    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  resultText: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
  },

  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,

    width: 24,
    height: 24,

    borderRadius: 20,

    backgroundColor:
      "rgba(0,0,0,0.7)",

    alignItems: "center",
    justifyContent: "center",
  },

  emptyContainer: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },

  emptySubText: {
    color: "#777",
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 40,
  },

  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.55)",
  justifyContent: "flex-end",
},

  modalContent: {
  backgroundColor: "#121212",

  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,

  paddingTop: 20,
  paddingHorizontal: 20,

  maxHeight: "85%",
},

  modalBar: {
  width: 45,
  height: 5,
  borderRadius: 10,
  backgroundColor: "#555",

  alignSelf: "center",
  marginBottom: 18,
},

 modalTitle: {
  color: "white",
  fontSize: 22,
  fontWeight: "700",

  textAlign: "center",
  marginBottom: 20,
},

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    gap: 15,
  },

  menuText: {
    color: "white",
    fontSize: 16,
  },
});