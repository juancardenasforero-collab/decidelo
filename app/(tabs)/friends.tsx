import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Amigos() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const handleSearchChange = (text: string) => {
    setSearchText(text);

    if (text.length > 2 && !history.includes(text)) {
      setHistory((prev) => [text, ...prev].slice(0, 10));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 15,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          Amigos
        </Text>

        <Pressable onPress={() => setSearchOpen(!searchOpen)}>
          <Ionicons name="search" size={24} color="white" />
        </Pressable>
      </View>

      {/* SEARCH */}
      {searchOpen && (
        <View style={{ paddingHorizontal: 10 }}>
          <TextInput
            placeholder="Buscar amigos..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={handleSearchChange}
            style={{
              backgroundColor: "#222",
              color: "white",
              padding: 10,
              borderRadius: 10,
            }}
          />

          <Text style={{ color: "white", marginTop: 10 }}>
            Historial
          </Text>

          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={{ color: "#aaa", paddingVertical: 5 }}>
                {item}
              </Text>
            )}
          />
        </View>
      )}

      {/* FEED */}
      {!searchOpen && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>
            Videos de amigos aquí 👥🎥
          </Text>
        </View>
      )}
    </View>
  );
}