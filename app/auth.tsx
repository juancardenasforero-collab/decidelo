import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Auth() {
  const router = useRouter();

  const handleLogin = async () => {
    await AsyncStorage.setItem("isLogged", "true");
    router.replace("/");
  };

  return (
    <LinearGradient
      colors={["#000000", "#111111", "#1a1a1a"]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>D</Text>
      </View>

      <Text style={styles.title}>Decídelo</Text>

      <Text style={styles.subtitle}>
        Comparte decisiones y deja que la comunidad vote.
      </Text>

      <Pressable
        style={[styles.button, styles.google]}
        onPress={handleLogin}
      >
        <Ionicons
          name="logo-google"
          size={22}
          color="black"
        />
        <Text style={styles.googleText}>
          Continuar con Google
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.phone]}
        onPress={handleLogin}
      >
        <Ionicons
          name="call"
          size={22}
          color="white"
        />
        <Text style={styles.buttonText}>
          Continuar con teléfono
        </Text>
      </Pressable>

      <Text style={styles.terms}>
        Al continuar aceptas nuestros términos y
        políticas de privacidad.
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  logoContainer: {
    alignSelf: "center",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FE2C55",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
  },

  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 50,
    fontSize: 15,
  },

  button: {
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    gap: 10,
  },

  google: {
    backgroundColor: "white",
  },

  phone: {
    backgroundColor: "#FE2C55",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  googleText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },

  terms: {
    color: "#777",
    textAlign: "center",
    marginTop: 25,
    fontSize: 12,
  },
});