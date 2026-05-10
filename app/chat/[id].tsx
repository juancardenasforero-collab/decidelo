import React, { useState, useRef, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  Keyboard,
  KeyboardEvent,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";

import {
  Audio,
  Video,
  ResizeMode,
} from "expo-av";

import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from "expo-camera";

/* ================= TYPES ================= */

type Message = {
  id: string;
  type: "text" | "image" | "audio" | "video";
  text?: string;
  uri?: string;
  me: boolean;
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();

  const router = useRouter();

  /* ================= STATES ================= */

  const [text, setText] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "text",
      text: "Hola 👋",
      me: false,
    },

    {
      id: "2",
      type: "text",
      text: "Qué más 🔥",
      me: true,
    },
  ]);

  const [recording, setRecording] =
    useState<Audio.Recording | null>(null);

  const soundRef =
    useRef<Audio.Sound | null>(null);

  const [playingId, setPlayingId] =
    useState<string | null>(null);

  const [keyboardHeight, setKeyboardHeight] =
    useState(0);

  /* ================= CAMERA ================= */

  const [showCamera, setShowCamera] =
    useState(false);

  const [facing, setFacing] =
    useState<CameraType>("back");

  const [mode, setMode] =
    useState<"picture" | "video">(
      "picture"
    );

  const [permission, requestPermission] =
    useCameraPermissions();

  const cameraRef = useRef<any>(null);

  const [recordingVideo, setRecordingVideo] =
    useState(false);

  const [previewVideo, setPreviewVideo] =
    useState<string | null>(null);

  const [recordTime, setRecordTime] =
    useState(0);

  const timerRef = useRef<any>(null);

  /* ================= STATUS ================= */

  const isOnline = true;

  /* ================= KEYBOARD ================= */

  useEffect(() => {
    const showSubscription =
      Keyboard.addListener(
        "keyboardDidShow",
        (e: KeyboardEvent) => {
          setKeyboardHeight(
            e.endCoordinates.height
          );
        }
      );

    const hideSubscription =
      Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setKeyboardHeight(0);
        }
      );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  /* ================= BACK ================= */

  const goBack = () => {
    router.push("/message");
  };

  /* ================= TEXT ================= */

  const sendText = () => {
    if (!text.trim()) return;

    setMessages((p) => [
      ...p,
      {
        id: Date.now().toString(),
        type: "text",
        text,
        me: true,
      },
    ]);

    setText("");
  };

  /* ================= EMOJI ================= */

  const addEmoji = () => {
    setText((p) => p + "😂");
  };

  /* ================= GALLERY ================= */

  const pickImage = async () => {
    const res =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.All,

        quality: 1,

        videoMaxDuration: 600,
      });

    if (!res.canceled) {
      const asset = res.assets[0];

      setMessages((p) => [
        ...p,
        {
          id: Date.now().toString(),

          type:
            asset.type === "video"
              ? "video"
              : "image",

          uri: asset.uri,

          me: true,
        },
      ]);
    }
  };

  /* ================= CAMERA ================= */

  const openCamera = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }

    setShowCamera(true);
  };

  /* ================= PHOTO ================= */

  const capturePhoto = async () => {
    try {
      if (!cameraRef.current) return;

      const photo =
        await cameraRef.current.takePictureAsync({
          quality: 1,
        });

      setMessages((p) => [
        ...p,
        {
          id: Date.now().toString(),

          type: "image",

          uri: photo.uri,

          me: true,
        },
      ]);

      setShowCamera(false);
    } catch (e) {
      console.log(e);
    }
  };

  /* ================= VIDEO ================= */

  const startVideoRecording = async () => {
    try {
      if (recordingVideo) return;

      if (!cameraRef.current) return;

      setRecordingVideo(true);

      setRecordTime(0);

      timerRef.current = setInterval(() => {
        setRecordTime((p) => p + 1);
      }, 1000);

      const video =
        await cameraRef.current.recordAsync();

      if (video?.uri) {
        setPreviewVideo(video.uri);
      }
    } catch (e) {
      console.log(e);
    } finally {
      clearInterval(timerRef.current);

      setRecordingVideo(false);
    }
  };

  const stopVideoRecording = async () => {
    try {
      if (!cameraRef.current) return;

      cameraRef.current.stopRecording();
    } catch (e) {
      console.log(e);
    }
  };

  /* ================= AUDIO ================= */

  const startRecording = async () => {
    try {
      const perm =
        await Audio.requestPermissionsAsync();

      if (!perm.granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } =
        await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets
            .HIGH_QUALITY
        );

      setRecording(recording);
    } catch (e) {
      console.log(e);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();

      setRecording(null);

      setMessages((p) => [
        ...p,
        {
          id: Date.now().toString(),
          type: "audio",
          uri: uri || "",
          me: true,
        },
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  /* ================= PLAY AUDIO ================= */

  const playAudio = async (
    uri?: string,
    id?: string
  ) => {
    try {
      if (!uri) return;

      if (soundRef.current) {
        await soundRef.current.unloadAsync();

        soundRef.current = null;
      }

      const { sound } =
        await Audio.Sound.createAsync({
          uri,
        });

      soundRef.current = sound;

      setPlayingId(id || null);

      sound.setOnPlaybackStatusUpdate(
        (status: any) => {
          if (status.didJustFinish) {
            setPlayingId(null);
          }
        }
      );

      await sound.playAsync();
    } catch (e) {
      console.log(e);
    }
  };

  /* ================= PREVIEW ================= */

  if (previewVideo) {
    return (
      <View style={styles.previewContainer}>
        <Video
          source={{ uri: previewVideo }}
          style={styles.previewVideo}
          shouldPlay
          isLooping
          resizeMode={ResizeMode.COVER}
        />

        {/* CLOSE */}

        <View style={styles.previewTop}>
          <Pressable
            onPress={() =>
              setPreviewVideo(null)
            }
          >
            <Ionicons
              name="close"
              size={35}
              color="white"
            />
          </Pressable>
        </View>

        {/* BOTTOM */}

        <View style={styles.previewBottom}>
          {/* REPEAT */}

          <Pressable
            style={styles.previewBtn}
            onPress={() => {
              setPreviewVideo(null);

              setShowCamera(true);
            }}
          >
            <Ionicons
              name="refresh"
              size={30}
              color="white"
            />

            <Text style={styles.previewText}>
              Repetir
            </Text>
          </Pressable>

          {/* SEND */}

          <Pressable
            style={styles.sendVideoBtn}
            onPress={() => {
              setMessages((p) => [
                ...p,
                {
                  id: Date.now().toString(),

                  type: "video",

                  uri: previewVideo,

                  me: true,
                },
              ]);

              setPreviewVideo(null);

              setShowCamera(false);
            }}
          >
            <Ionicons
              name="send"
              size={30}
              color="white"
            />
          </Pressable>
        </View>
      </View>
    );
  }

  /* ================= CAMERA SCREEN ================= */

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          mode={mode}
        />

        {/* TIMER */}

        {recordingVideo && (
          <View style={styles.timerBox}>
            <View style={styles.redDot} />

            <Text style={styles.timerText}>
              {recordTime}s
            </Text>
          </View>
        )}

        {/* CLOSE */}

        <Pressable
          onPress={() =>
            setShowCamera(false)
          }
          style={styles.closeBtn}
        >
          <Ionicons
            name="close"
            size={35}
            color="white"
          />
        </Pressable>

        {/* REVERSE */}

        <Pressable
          onPress={() =>
            setFacing((p) =>
              p === "back"
                ? "front"
                : "back"
            )
          }
          style={styles.reverseBtn}
        >
          <Ionicons
            name="camera-reverse"
            size={35}
            color="white"
          />
        </Pressable>

        {/* MODES */}

        <View style={styles.modes}>
          <Pressable
            onPress={() =>
              setMode("picture")
            }
          >
            <Text
              style={[
                styles.modeText,
                {
                  color:
                    mode === "picture"
                      ? "#ff2d55"
                      : "white",
                },
              ]}
            >
              FOTO
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              setMode("video")
            }
          >
            <Text
              style={[
                styles.modeText,
                {
                  color:
                    mode === "video"
                      ? "#ff2d55"
                      : "white",
                },
              ]}
            >
              VIDEO
            </Text>
          </Pressable>
        </View>

        {/* BUTTON */}

        <View style={styles.captureArea}>
          {mode === "picture" ? (
            <Pressable
              onPress={capturePhoto}
              style={styles.captureBtn}
            />
          ) : (
            <Pressable
              onPress={() => {
                if (recordingVideo) {
                  stopVideoRecording();
                } else {
                  startVideoRecording();
                }
              }}
              style={[
                styles.captureBtn,
                {
                  transform: [
                    {
                      scale:
                        recordingVideo
                          ? 1.25
                          : 1,
                    },
                  ],

                  backgroundColor:
                    recordingVideo
                      ? "red"
                      : "white",
                },
              ]}
            />
          )}
        </View>
      </View>
    );
  }

  /* ================= RENDER ITEM ================= */

  const renderItem = ({ item }: any) => {
    return (
      <View
        style={[
          styles.msg,
          item.me
            ? styles.my
            : styles.other,
        ]}
      >
        {/* TEXT */}

        {item.type === "text" && (
          <Text style={styles.msgText}>
            {item.text}
          </Text>
        )}

        {/* IMAGE */}

        {item.type === "image" && (
          <Image
            source={{ uri: item.uri }}
            style={styles.img}
          />
        )}

        {/* VIDEO */}

        {item.type === "video" && (
          <Video
            source={{ uri: item.uri }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.COVER}
          />
        )}

        {/* AUDIO */}

        {item.type === "audio" && (
          <Pressable
            style={styles.audioBox}
            onPress={() =>
              playAudio(
                item.uri,
                item.id
              )
            }
          >
            <Ionicons
              name={
                playingId === item.id
                  ? "pause"
                  : "play"
              }
              size={24}
              color="white"
            />

            <Text
              style={{
                color: "white",
                marginLeft: 10,
              }}
            >
              Audio mensaje
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  /* ================= MAIN ================= */

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <Pressable onPress={goBack}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="white"
          />
        </Pressable>

        <View>
          <Text style={styles.title}>
            Usuario {id}
          </Text>

          <Text
            style={{
              color: isOnline
                ? "green"
                : "gray",
            }}
          >
            {isOnline
              ? "En línea"
              : "Desconectado"}
          </Text>
        </View>
      </View>

      {/* CHAT */}

      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 10,

          paddingBottom:
            keyboardHeight > 0
              ? keyboardHeight
              : 80,
        }}
      />

      {/* INPUT */}

      <View
        style={[
          styles.bar,
          {
            bottom:
              keyboardHeight > 0
                ? keyboardHeight - 10
                : 0,
          },
        ]}
      >
        <Pressable onPress={addEmoji}>
          <Ionicons
            name="happy-outline"
            size={24}
            color="white"
          />
        </Pressable>

        <Pressable onPress={pickImage}>
          <Ionicons
            name="image-outline"
            size={24}
            color="white"
          />
        </Pressable>

        <Pressable onPress={openCamera}>
          <Ionicons
            name="camera-outline"
            size={24}
            color="white"
          />
        </Pressable>

        <Pressable
          onPress={
            recording
              ? stopRecording
              : startRecording
          }
        >
          <Ionicons
            name={
              recording
                ? "stop-circle"
                : "mic-outline"
            }
            size={24}
            color={
              recording
                ? "red"
                : "white"
            }
          />
        </Pressable>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Mensaje..."
          placeholderTextColor="#777"
          style={styles.input}
        />

        <Pressable onPress={sendText}>
          <Ionicons
            name="send"
            size={24}
            color="#ff2d55"
          />
        </Pressable>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  header: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderColor: "#222",
  },

  title: {
    color: "white",
    fontWeight: "bold",
  },

  msg: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "75%",
  },

  msgText: {
    color: "white",
  },

  my: {
    alignSelf: "flex-end",
    backgroundColor: "#ff2d55",
  },

  other: {
    alignSelf: "flex-start",
    backgroundColor: "#222",
  },

  img: {
    width: 220,
    height: 220,
    borderRadius: 10,
  },

  video: {
    width: 220,
    height: 320,
    borderRadius: 10,
  },

  audioBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 20,
  },

  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderTopWidth: 0.5,
    borderColor: "#222",
    backgroundColor: "black",
  },

  input: {
    flex: 1,
    backgroundColor: "#111",
    color: "white",
    padding: 10,
    borderRadius: 20,
  },

  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
  },

  camera: {
    flex: 1,
  },

  closeBtn: {
    position: "absolute",
    top: 60,
    left: 20,
  },

  reverseBtn: {
    position: "absolute",
    top: 60,
    right: 20,
  },

  modes: {
    position: "absolute",
    bottom: 140,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
  },

  modeText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  captureArea: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },

  captureBtn: {
    width: 85,
    height: 85,
    borderRadius: 50,
    backgroundColor: "white",
  },

  previewContainer: {
    flex: 1,
    backgroundColor: "black",
  },

  previewVideo: {
    flex: 1,
  },

  previewTop: {
    position: "absolute",
    top: 60,
    left: 20,
  },

  previewBottom: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  previewBtn: {
    alignItems: "center",
  },

  previewText: {
    color: "white",
    marginTop: 5,
  },

  sendVideoBtn: {
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: "#ff2d55",
    justifyContent: "center",
    alignItems: "center",
  },

  timerBox: {
    position: "absolute",
    top: 70,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },

  redDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "red",
    marginRight: 8,
  },

  timerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});