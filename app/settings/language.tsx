import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

export default function LanguageScreen() {
  const [selected, setSelected] =
    useState("Español");

  const [search, setSearch] =
    useState("");

  const languages = [
    "Español",
    "English",
    "Português",
    "Français",
    "Deutsch",
    "Italiano",
    "Русский",
    "العربية",
    "中文 (简体)",
    "中文 (繁體)",
    "日本語",
    "한국어",
    "हिन्दी",
    "বাংলা",
    "தமிழ்",
    "తెలుగు",
    "اردو",
    "Türkçe",
    "Nederlands",
    "Polski",
    "Українська",
    "ไทย",
    "Tiếng Việt",
    "Bahasa Indonesia",
    "Bahasa Melayu",
    "Čeština",
    "Svenska",
    "Norsk",
    "Dansk",
    "Suomi",
    "Ελληνικά",
    "עברית",
    "Română",
    "Magyar",
    "Slovenčina",
    "Hrvatski",
    "Srpski",
    "Български",
    "ქართული",
    "Հայերեն",
    "فارسی",
    "Kiswahili",
    "Afrikaans",
    "Zulu",
    "Xhosa",
    "Filipino",
    "Latviešu",
    "Lietuvių",
    "Eesti",
    "Íslenska",
  ];

  const filteredLanguages =
    languages.filter((language) =>
      language
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Idioma
      </Text>

      <View style={styles.searchBox}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
        />

        <TextInput
          placeholder="Buscar idioma..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>

      <FlatList
        data={filteredLanguages}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              setSelected(item)
            }
          >
            <Text style={styles.text}>
              {item}
            </Text>

            {selected === item && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#ff2d55"
              />
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
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
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 14,
    marginLeft: 10,
    fontSize: 16,
  },

  item: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 18,
    marginBottom: 10,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  text: {
    color: "#fff",
    fontSize: 16,
  },
});