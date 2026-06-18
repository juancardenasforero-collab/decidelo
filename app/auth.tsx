import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase";

export default function Auth() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert(
        "Campos requeridos",
        "Ingresa correo y contraseña"
      );
      return;
    }

    try {
      setLoading(true);

      if (isRegister) {
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        Alert.alert(
          "Cuenta creada",
          "Tu cuenta fue creada correctamente"
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      }

      router.replace("/");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "Ocurrió un error"
      );
    } finally {
      setLoading(false);
    }
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

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#777"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#777"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        style={[styles.button, styles.phone]}
        onPress={handleAuth}
      >
        <Text style={styles.buttonText}>
          {loading
            ? "Cargando..."
            : isRegister
            ? "Crear cuenta"
            : "Iniciar sesión"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() =>
          setIsRegister(!isRegister)
        }
      >
        <Text style={styles.switchText}>
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </Text>
      </Pressable>

      <View style={styles.separator} />

      <Pressable
        style={[styles.button, styles.google]}
      >
        <Ionicons
          name="logo-google"
          size={22}
          color="black"
        />

        <Text style={styles.googleText}>
          Google (próximamente)
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
    marginBottom: 30,
    fontSize: 15,
  },

  input: {
    backgroundColor: "#1f1f1f",
    color: "white",
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
  },

  button: {
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
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

  switchText: {
    color: "#FE2C55",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },

  separator: {
    height: 1,
    backgroundColor: "#222",
    marginVertical: 25,
  },

  terms: {
    color: "#777",
    textAlign: "center",
    marginTop: 25,
    fontSize: 12,
  },
});