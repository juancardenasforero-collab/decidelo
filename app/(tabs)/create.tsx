import React, { useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from "expo-camera";

import * as ImagePicker from "expo-image-picker";

import { Video, ResizeMode } from "expo-av";

const { width, height } = Dimensions.get("window");

export default function CreateScreen() {
  /* ================= CAMERA ================= */

  const [permission, requestPermission] =
    useCameraPermissions();

  const cameraRef = useRef<any>(null);

  const [facing, setFacing] =
    useState<CameraType>("back");

  const [mode, setMode] =
    useState<"photo" | "video">("video");

  const [recording, setRecording] =
    useState(false);

  const [recordTime, setRecordTime] =
    useState(0);

  const timerRef = useRef<any>(null);

  /* ================= MEDIA ================= */

  const [media, setMedia] = useState<any>(null);

  const [mediaType, setMediaType] =
    useState<"image" | "video" | null>(
      null
    );

  /* ================= PUBLISH ================= */

  const [description, setDescription] =
    useState("");

  const [optionA, setOptionA] =
    useState("");

  const [optionB, setOptionB] =
    useState("");

  const [duration, setDuration] =
    useState("24h");

  /* ================= OPEN CAMERA ================= */

  const openPermissions = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
  };

  /* ================= PHOTO ================= */

  const takePhoto = async () => {
    try {
      if (!cameraRef.current) return;

      const photo =
        await cameraRef.current.takePictureAsync({
          quality: 1,
        });

      setMedia(photo.uri);

      setMediaType("image");
    } catch (e) {
      console.log(e);
    }
  };

  /* ================= VIDEO ================= */

  const startRecording = async () => {
    try {
      if (!cameraRef.current) return;

      setRecording(true);

      setRecordTime(0);

      timerRef.current = setInterval(() => {
        setRecordTime((p) => p + 1);
      }, 1000);

      const video =
        await cameraRef.current.recordAsync();

      if (video?.uri) {
        setMedia(video.uri);

        setMediaType("video");
      }
    } catch (e) {
      console.log(e);
    } finally {
      clearInterval(timerRef.current);

      setRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (!cameraRef.current) return;

      cameraRef.current.stopRecording();
    } catch (e) {
      console.log(e);
    }
  };

  /* ================= GALLERY ================= */

  const openGallery = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.All,

        quality: 1,
      });

    if (!result.canceled) {
      const asset = result.assets[0];

      setMedia(asset.uri);

      setMediaType(
        asset.type === "video"
          ? "video"
          : "image"
      );
    }
  };

  /* ================= PUBLISH ================= */

  const publishPost = () => {
    const newPost = {
      id: Date.now().toString(),

      media,

      mediaType,

      description,

      optionA,

      optionB,

      votesA: 0,

      votesB: 0,

      duration,

      createdAt: Date.now(),

      user: {
        name: "juan",
      },
    };

    console.log("POST:", newPost);

    // 🔥 luego aquí va backend/firebase

    alert("Publicado 🔥");

    setMedia(null);

    setDescription("");

    setOptionA("");

    setOptionB("");
  };

  /* ================= PREVIEW ================= */

  if (media) {
    return (
      <View style={styles.previewContainer}>
        {/* MEDIA */}

        {mediaType === "video" ? (
          <Video
            source={{ uri: media }}
            style={styles.previewMedia}
            shouldPlay
            isLooping
            resizeMode={ResizeMode.COVER}
            useNativeControls={false}
          />
        ) : (
          <Image
            source={{ uri: media }}
            style={styles.previewMedia}
          />
        )}

        {/* TOP */}

        <View style={styles.topBar}>
          <Pressable
            onPress={() => setMedia(null)}
          >
            <Ionicons
              name="close"
              size={35}
              color="white"
            />
          </Pressable>
        </View>

        {/* FORM */}

        <ScrollView
          style={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>
            Descripción
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="¿Qué debería hacer?"
            placeholderTextColor="#777"
            style={styles.input}
            multiline
          />

          <Text style={styles.label}>
            Opción A
          </Text>

          <TextInput
            value={optionA}
            onChangeText={setOptionA}
            placeholder="Ej: Sí"
            placeholderTextColor="#777"
            style={styles.input}
          />

          <Text style={styles.label}>
            Opción B
          </Text>

          <TextInput
            value={optionB}
            onChangeText={setOptionB}
            placeholder="Ej: No"
            placeholderTextColor="#777"
            style={styles.input}
          />

          <Text style={styles.label}>
            Duración votación
          </Text>

          <View style={styles.durationRow}>
            {["1h", "12h", "24h", "3d"].map(
              (item) => (
                <Pressable
                  key={item}
                  onPress={() =>
                    setDuration(item)
                  }
                  style={[
                    styles.durationBtn,
                    duration === item && {
                      backgroundColor:
                        "#ff2d55",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              )
            )}
          </View>

          <Pressable
            style={styles.publishBtn}
            onPress={publishPost}
          >
            <Text style={styles.publishText}>
              Publicar
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  /* ================= CAMERA ================= */

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode={mode === "photo" ? "picture" : "video"}
      />

      {/* TIMER */}

      {recording && (
        <View style={styles.timerBox}>
          <View style={styles.redDot} />

          <Text style={styles.timerText}>
            {recordTime}s
          </Text>
        </View>
      )}

      {/* TOP */}

      <View style={styles.header}>
        <Pressable
          onPress={() =>
            setFacing((p) =>
              p === "back"
                ? "front"
                : "back"
            )
          }
        >
          <Ionicons
            name="camera-reverse"
            size={35}
            color="white"
          />
        </Pressable>
      </View>

      {/* MODES */}

      <View style={styles.modes}>
        <Pressable
          onPress={() => setMode("photo")}
        >
          <Text
            style={[
              styles.modeText,
              {
                color:
                  mode === "photo"
                    ? "#ff2d55"
                    : "white",
              },
            ]}
          >
            FOTO
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setMode("video")}
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

      {/* BOTTOM */}

      <View style={styles.bottom}>
        {/* GALLERY */}

        <Pressable onPress={openGallery}>
          <Ionicons
            name="images"
            size={34}
            color="white"
          />
        </Pressable>

        {/* RECORD */}

        {mode === "photo" ? (
          <Pressable
            style={styles.captureBtn}
            onPress={takePhoto}
          />
        ) : (
          <Pressable
            style={[
              styles.captureBtn,
              {
                backgroundColor:
                  recording
                    ? "red"
                    : "white",
              },
            ]}
            onPress={() => {
              if (recording) {
                stopRecording();
              } else {
                startRecording();
              }
            }}
          />
        )}

        {/* EMPTY */}

        <View style={{ width: 34 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  camera: {
    flex: 1,
  },

  header: {
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

  bottom: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  captureBtn: {
    width: 85,
    height: 85,
    borderRadius: 100,
    backgroundColor: "white",
  },

  previewContainer: {
    flex: 1,
    backgroundColor: "black",
  },

  previewMedia: {
    width,
    height: height * 0.5,
  },

  topBar: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },

  form: {
    flex: 1,
    padding: 20,
  },

  label: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    fontSize: 16,
  },

  input: {
    backgroundColor: "#111",
    color: "white",
    borderRadius: 14,
    padding: 14,
  },

  durationRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  durationBtn: {
    backgroundColor: "#222",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  publishBtn: {
    marginTop: 40,
    backgroundColor: "#ff2d55",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 80,
  },

  publishText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
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