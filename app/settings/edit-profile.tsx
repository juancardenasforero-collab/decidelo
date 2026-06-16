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

export default function EditProfileScreen() {
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
          placeholder="Tu nombre"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>
          Usuario
        </Text>

        <TextInput
          style={styles.input}
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
          multiline
          placeholder="Cuéntale algo a la comunidad..."
          placeholderTextColor="#666"
        />

        <TouchableOpacity
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Guardar cambios
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