import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../../firebase";

import { Alert } from "react-native";

export default function EditProfileScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    try {
      setSaving(true);

      const currentUser =
        auth.currentUser;

      if (!currentUser) return;

      await updateDoc(
        doc(
          db,
          "users",
          currentUser.uid
        ),
        {
          name,
          username,
          bio,
        }
      );

      Alert.alert(
        "Perfil actualizado",
        "Los cambios fueron guardados"
      );
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "No se pudieron guardar los cambios"
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Editar perfil
        </Text>

        <Text style={styles.label}>
          Nombre
        </Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Tu nombre"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>
          Usuario
        </Text>

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="@usuario"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>
          Biografía
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.bioInput,
          ]}
          value={bio}
          onChangeText={setBio}
          multiline
          placeholder="Cuéntale algo a la comunidad..."
          placeholderTextColor="#666"
        />

        <TouchableOpacity
          style={[
            styles.button,
            saving && { opacity: 0.7 }
          ]}
          onPress={saveProfile}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving
              ? "Guardando..."
              : "Guardar cambios"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  content: {
    padding: 20,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 25,
  },

  label: {
    color: "#fff",
    marginBottom: 8,
    marginTop: 15,
    fontSize: 15,
  },

  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },

  bioInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#ff2d55",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});