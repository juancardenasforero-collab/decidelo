import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Cuenta
      </Text>

      <Text style={styles.text}>
        Configuración de la cuenta.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
  },

  text: {
    color: "#aaa",
    marginTop: 10,
    fontSize: 16,
  },
});