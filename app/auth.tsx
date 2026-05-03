import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Ionicons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

export default function Auth() {
  const router = useRouter();

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔴 GOOGLE
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "TU_CLIENT_ID_DE_GOOGLE",
  });

  useEffect(() => {
    if (response?.type === "success") {
      handleSuccessLogin();
    }
  }, [response]);

  const handleSuccessLogin = async () => {
    await AsyncStorage.setItem("isLogged", "true");
    router.replace("/");
  };

  // 📧 REGISTRO SIMPLE
  const handleEmailRegister = async () => {
    if (!email || !password) return;

    await AsyncStorage.setItem("isLogged", "true");
    router.replace("/");
  };

  // 🔥 PANTALLA PRINCIPAL (tipo TikTok)
  if (!showEmailForm) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Únete a Decídelo</Text>

        {/* GOOGLE */}
        <Pressable
          style={[styles.button, styles.google]}
          onPress={() => promptAsync()}
        >
          <Ionicons name="logo-google" size={20} color="black" />
          <Text style={styles.buttonTextDark}>
            Continuar con Google
          </Text>
        </Pressable>

        {/* FACEBOOK (visual por ahora) */}
        <Pressable style={[styles.button, styles.facebook]}>
          <Ionicons name="logo-facebook" size={20} color="white" />
          <Text style={styles.buttonText}>
            Continuar con Facebook
          </Text>
        </Pressable>

        {/* EMAIL */}
        <Pressable
          style={[styles.button, styles.email]}
          onPress={() => setShowEmailForm(true)}
        >
          <Ionicons name="mail" size={20} color="white" />
          <Text style={styles.buttonText}>
            Registrarse con correo
          </Text>
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.skip}>Ahora no</Text>
        </Pressable>
      </View>
    );
  }

  // 📧 FORMULARIO EMAIL
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        placeholder="Correo"
        placeholderTextColor="gray"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="gray"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.submit} onPress={handleEmailRegister}>
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Registrarme
        </Text>
      </Pressable>

      <Pressable onPress={() => setShowEmailForm(false)}>
        <Text style={styles.skip}>Volver</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
  },

  google: {
    backgroundColor: "white",
  },

  facebook: {
    backgroundColor: "#1877F2",
  },

  email: {
    backgroundColor: "#FE2C55",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  buttonTextDark: {
    color: "black",
    fontWeight: "bold",
  },

  skip: {
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },

  // 📧 FORM
  input: {
    backgroundColor: "#1e1e1e",
    color: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  submit: {
    backgroundColor: "#FE2C55",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
});