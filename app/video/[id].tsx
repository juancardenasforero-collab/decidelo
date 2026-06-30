import React, {
  useState,
  useEffect,
} from "react";

import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
  Image,
  Modal,
  TextInput,
  FlatList,
  Share,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useRouter,
  useLocalSearchParams,
} from "expo-router";

import {
  VideoView,
  useVideoPlayer,
} from "expo-video";

import Slider from "@react-native-community/slider";

const { width, height } =
  Dimensions.get("window");

export default function VideoScreen() {
  const router = useRouter();

  const params =
    useLocalSearchParams();

  const videoUri =
    typeof params.uri === "string"
      ? params.uri
      : "";

  const username =
    typeof params.username ===
    "string"
      ? params.username
      : "@juan";

  const description =
    typeof params.description ===
    "string"
      ? params.description
      : "Video 🔥";

  const avatar =
    typeof params.avatar ===
    "string"
      ? params.avatar
      : "";

      {avatar ? (
  <Image
    source={{ uri: avatar }}
    style={styles.avatar}
  />
) : (
  <Ionicons
    name="person-circle"
    size={100}
    color="#777"
  />
)}

  /* ================= VOTING ================= */

  const optionA =
    typeof params.optionA ===
    "string"
      ? params.optionA
      : "Opción A";

  const optionB =
    typeof params.optionB ===
    "string"
      ? params.optionB
      : "Opción B";

  const votesA = Number(
    params.votesA || 0
  );

  const votesB = Number(
    params.votesB || 0
  );

  const createdAt = Number(
    params.createdAt || Date.now()
  );

  const voteDuration =
    typeof params.duration ===
    "string"
      ? params.duration
      : "24h";

  const getDurationMs = () => {
    if (voteDuration === "1h") {
      return 1 * 60 * 60 * 1000;
    }

    if (voteDuration === "12h") {
      return 12 * 60 * 60 * 1000;
    }

    if (voteDuration === "24h") {
      return 24 * 60 * 60 * 1000;
    }

    if (voteDuration === "3d") {
      return (
        3 *
        24 *
        60 *
        60 *
        1000
      );
    }

    return (
      24 *
      60 *
      60 *
      1000
    );
  };

  const endTime =
    createdAt + getDurationMs();

  const remaining =
    endTime - Date.now();

  const votingFinished =
    remaining <= 0;

  let winner = "Empate";

  if (votesA > votesB) {
    winner = optionA;
  }

  if (votesB > votesA) {
    winner = optionB;
  }

  const formatRemainingTime =
    () => {
      if (votingFinished) {
        return "Votación terminada";
      }

      const totalSeconds =
        Math.floor(
          remaining / 1000
        );

      const hours =
        Math.floor(
          totalSeconds / 3600
        );

      const minutes =
        Math.floor(
          (totalSeconds %
            3600) /
            60
        );

      return `${hours}h ${minutes}m restantes`;
    };

  /* ================= STATES ================= */

  const [paused, setPaused] =
    useState(false);

  const [liked, setLiked] =
    useState(false);

  const [likes, setLikes] =
    useState(1200);

  const [
    commentsVisible,
    setCommentsVisible,
  ] = useState(false);

  const [
    currentTime,
    setCurrentTime,
  ] = useState(0);

  const [duration, setDuration] =
    useState(1);

  const [
    comments,
    setComments,
  ] = useState([
    {
      id: "1",
      user: "@laura",
      text: "🔥 Brutal video",
      likes: 12,
    },

    {
      id: "2",
      user: "@carlos",
      text: "JAJAJA buenísimo 😂",
      likes: 4,
    },

    {
      id: "3",
      user: "@andrea",
      text: "Necesito parte 2",
      likes: 8,
    },
  ]);

  const [
    comment,
    setComment,
  ] = useState("");

  /* ================= VIDEO ================= */

  const player = useVideoPlayer(
    videoUri,
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  /* ================= VIDEO TRACKING ================= */

  useEffect(() => {
    const interval =
      setInterval(() => {
        if (
          player?.currentTime !=
          null
        ) {
          setCurrentTime(
            player.currentTime
          );
        }

        if (
          player?.duration !=
          null
        ) {
          setDuration(
            player.duration
          );
        }
      }, 300);

    return () =>
      clearInterval(interval);
  }, [player]);

  /* ================= PLAY ================= */

  const togglePlayPause = () => {
    if (paused) {
      player.play();
      setPaused(false);
    } else {
      player.pause();
      setPaused(true);
    }
  };

  /* ================= LIKE ================= */

  const toggleLike = () => {
    if (liked) {
      setLiked(false);

      setLikes(
        (prev) => prev - 1
      );
    } else {
      setLiked(true);

      setLikes(
        (prev) => prev + 1
      );
    }
  };

  /* ================= SHARE ================= */

  const handleShare =
    async () => {
      try {
        await Share.share({
          message:
            "Mira este video en Decídelo 🔥",
        });
      } catch (error) {
        console.log(error);
      }
    };

  /* ================= SEEK VIDEO ================= */

  const handleSeek = (
    value: number
  ) => {
    player.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <View style={styles.container}>
      {/* VIDEO */}

      <Pressable
        style={styles.touchLayer}
        onPress={togglePlayPause}
      >
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
        />

        {/* PLAY ICON */}

        {paused && (
          <View
            style={
              styles.playOverlay
            }
          >
            <Ionicons
              name="play"
              size={70}
              color="white"
            />
          </View>
        )}
      </Pressable>

      {/* TOP BAR */}

      <View style={styles.topBar}>
        <Pressable
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={30}
            color="white"
          />
        </Pressable>

        <Text style={styles.logo}>
          Decídelo
        </Text>

        <View
          style={{ width: 30 }}
        />
      </View>

      {/* ACTIONS */}

      <View style={styles.actions}>
        {/* AVATAR */}

        <Image
          source={{
            uri: avatar,
          }}
          style={styles.avatar}
        />

        {/* LIKE */}

        <Pressable
          style={styles.actionBtn}
          onPress={toggleLike}
        >
          <Ionicons
            name={
              liked
                ? "heart"
                : "heart-outline"
            }
            size={36}
            color={
              liked
                ? "#ff2d55"
                : "white"
            }
          />

          <Text
            style={styles.actionText}
          >
            {likes}
          </Text>
        </Pressable>

        {/* COMMENTS */}

        <Pressable
          style={styles.actionBtn}
          onPress={() =>
            setCommentsVisible(
              true
            )
          }
        >
          <Ionicons
            name="chatbubble"
            size={33}
            color="white"
          />

          <Text
            style={styles.actionText}
          >
            {comments.length}
          </Text>
        </Pressable>

        {/* SHARE */}

        <Pressable
          style={styles.actionBtn}
          onPress={handleShare}
        >
          <Ionicons
            name="arrow-redo"
            size={36}
            color="white"
          />

          <Text
            style={styles.actionText}
          >
            Compartir
          </Text>
        </Pressable>
      </View>

      {/* BOTTOM INFO */}

      <View style={styles.bottomInfo}>
        {/* VOTING */}

        <View
          style={
            styles.voteContainer
          }
        >
          <View
            style={[
              styles.voteTimeBox,

              {
                backgroundColor:
                  votingFinished
                    ? "#16a34a"
                    : "#ff2d55",
              },
            ]}
          >
            <Text
              style={
                styles.voteTimeText
              }
            >
              {formatRemainingTime()}
            </Text>
          </View>

          <View
            style={
              styles.voteOption
            }
          >
            <Text
              style={
                styles.voteOptionTitle
              }
            >
              🅰 {optionA}
            </Text>

            <Text
              style={
                styles.voteOptionVotes
              }
            >
              {votesA} votos
            </Text>
          </View>

          <View
            style={
              styles.voteOption
            }
          >
            <Text
              style={
                styles.voteOptionTitle
              }
            >
              🅱 {optionB}
            </Text>

            <Text
              style={
                styles.voteOptionVotes
              }
            >
              {votesB} votos
            </Text>
          </View>

          {votingFinished && (
            <View
              style={
                styles.winnerBox
              }
            >
              <Text
                style={
                  styles.winnerTitle
                }
              >
                Ganador
              </Text>

              <Text
                style={
                  styles.winnerText
                }
              >
                {winner}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.username}>
          {username}
        </Text>

        <Text
          style={styles.description}
        >
          {description}
        </Text>
      </View>

      {/* SLIDER */}

      <View style={styles.sliderBox}>
        <Slider
          style={{
            width: width - 20,
            height: 40,
          }}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onSlidingComplete={
            handleSeek
          }
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#666"
          thumbTintColor="#fff"
        />
      </View>

      {/* COMMENTS */}

      <Modal
        visible={commentsVisible}
        animationType="slide"
        transparent
      >
        <View
          style={
            styles.modalContainer
          }
        >
          <View
            style={
              styles.commentsBox
            }
          >
            <View
              style={
                styles.commentsHeader
              }
            >
              <Text
                style={
                  styles.commentsTitle
                }
              >
                Comentarios
              </Text>

              <Pressable
                onPress={() =>
                  setCommentsVisible(
                    false
                  )
                }
              >
                <Ionicons
                  name="close"
                  size={30}
                  color="white"
                />
              </Pressable>
            </View>

            <FlatList
              data={comments}
              keyExtractor={(
                item
              ) => item.id}
              renderItem={({
                item,
              }) => (
                <View
                  style={
                    styles.commentRow
                  }
                >
                  <Image
                    source={{
                      uri: `https://i.pravatar.cc/150?u=${item.user}`,
                    }}
                    style={
                      styles.commentAvatar
                    }
                  />

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        styles.commentUser
                      }
                    >
                      {item.user}
                    </Text>

                    <Text
                      style={
                        styles.commentText
                      }
                    >
                      {item.text}
                    </Text>

                    <View
                      style={
                        styles.commentActions
                      }
                    >
                      <Text
                        style={
                          styles.replyText
                        }
                      >
                        Responder
                      </Text>

                      <View
                        style={
                          styles.commentLike
                        }
                      >
                        <Ionicons
                          name="heart-outline"
                          size={14}
                          color="#999"
                        />

                        <Text
                          style={
                            styles.replyText
                          }
                        >
                          {
                            item.likes
                          }
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            />

            <View
              style={
                styles.commentInputBox
              }
            >
              <TextInput
                placeholder="Añade un comentario..."
                placeholderTextColor="#777"
                value={comment}
                onChangeText={
                  setComment
                }
                style={
                  styles.commentInput
                }
              />

              <Pressable
                onPress={() => {
                  if (
                    comment.trim()
                  ) {
                    setComments(
                      (
                        prev
                      ) => [
                        {
                          id:
                            Date.now().toString(),
                          user:
                            "@tu",
                          text: comment,
                          likes: 0,
                        },

                        ...prev,
                      ]
                    );

                    setComment(
                      ""
                    );
                  }
                }}
              >
                <Ionicons
                  name="send"
                  size={24}
                  color="#ff2d55"
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */

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

  touchLayer: {
    flex: 1,
  },

  playOverlay: {
    position: "absolute",
    top: "43%",
    alignSelf: "center",

    backgroundColor:
      "rgba(0,0,0,0.4)",

    padding: 20,
    borderRadius: 100,
  },

  topBar: {
    position: "absolute",
    top: 55,
    left: 15,
    right: 15,

    zIndex: 20,

    flexDirection: "row",
    justifyContent:
      "space-between",

    alignItems: "center",
  },

  logo: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  actions: {
    position: "absolute",
    right: 10,
    bottom: 160,

    zIndex: 20,

    alignItems: "center",
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 100,
    marginBottom: 22,
    borderWidth: 2,
    borderColor: "white",
  },

  actionBtn: {
    alignItems: "center",
    marginBottom: 25,
  },

  actionText: {
    color: "white",
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
  },

  bottomInfo: {
    position: "absolute",
    bottom: 85,
    left: 15,
    right: 90,

    zIndex: 20,
  },

  username: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
  },

  description: {
    color: "white",
    fontSize: 14,
    lineHeight: 21,
  },

  sliderBox: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    zIndex: 20,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",

    backgroundColor:
      "rgba(0,0,0,0.45)",
  },

  commentsBox: {
    backgroundColor: "#121212",
    height: "72%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 18,
  },

  commentsHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",

    alignItems: "center",
    marginBottom: 20,
  },

  commentsTitle: {
    color: "white",
    fontSize: 19,
    fontWeight: "bold",
  },

  commentRow: {
    flexDirection: "row",
    marginBottom: 22,
  },

  commentAvatar: {
    width: 42,
    height: 42,
    borderRadius: 100,
    marginRight: 12,
  },

  commentUser: {
    color: "#aaa",
    fontWeight: "700",
    marginBottom: 4,
  },

  commentText: {
    color: "white",
    fontSize: 15,
    lineHeight: 21,
  },

  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  replyText: {
    color: "#888",
    marginRight: 18,
    fontSize: 12,
  },

  commentLike: {
    flexDirection: "row",
    alignItems: "center",
  },

  commentInputBox: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#222",

    borderRadius: 30,

    paddingHorizontal: 16,

    marginTop: 10,
  },

  commentInput: {
    flex: 1,
    color: "white",
    paddingVertical: 14,
  },

  voteContainer: {
    marginBottom: 18,
  },

  voteTimeBox: {
    alignSelf: "flex-start",

    paddingHorizontal: 14,
    paddingVertical: 7,

    borderRadius: 30,

    marginBottom: 14,
  },

  voteTimeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },

  voteOption: {
    backgroundColor:
      "rgba(255,255,255,0.12)",

    borderRadius: 16,

    padding: 14,

    marginBottom: 10,
  },

  voteOptionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  voteOptionVotes: {
    color: "#ccc",
    marginTop: 5,
    fontSize: 13,
  },

  winnerBox: {
    marginTop: 10,

    backgroundColor:
      "rgba(22,163,74,0.22)",

    borderWidth: 1,
    borderColor: "#16a34a",

    borderRadius: 16,

    padding: 16,

    alignItems: "center",
  },

  winnerTitle: {
    color: "#16a34a",
    fontWeight: "bold",
    fontSize: 16,
  },

  winnerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
  },
});