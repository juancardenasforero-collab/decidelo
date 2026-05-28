import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import * as Contacts from "expo-contacts";

const { width } =
  Dimensions.get("window");

/* ================= USERS ================= */

const usersMock = [
  {
    id: "1",
    name: "Juan",
    username: "@juanp",
    phone: "3001111111",
    avatar:
      "https://i.pravatar.cc/300?img=1",
    topVideo:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
    followers: "12K",
  },

  {
    id: "2",
    name: "Laura",
    username: "@laura",
    phone: "3002222222",
    avatar:
      "https://i.pravatar.cc/300?img=2",
    topVideo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop",
    followers: "8K",
  },

  {
    id: "3",
    name: "Carlos",
    username: "@carlos",
    phone: "3003333333",
    avatar:
      "https://i.pravatar.cc/300?img=3",
    topVideo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    followers: "30K",
  },

  {
    id: "4",
    name: "Andrea",
    username: "@andrea",
    phone: "3004444444",
    avatar:
      "https://i.pravatar.cc/300?img=4",
    topVideo:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1200&auto=format&fit=crop",
    followers: "5K",
  },
];

export default function Amigos({
  navigation,
}: any) {
  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  const [history, setHistory] =
    useState<string[]>([]);

  const [following, setFollowing] =
    useState<string[]>([]);

  const [contactsUsers, setContactsUsers] =
    useState<any[]>([]);

  /* ================= CONTACTS ================= */

  useEffect(() => {
    requestContacts();
  }, []);

  const requestContacts =
    async () => {
      const { status } =
        await Contacts.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Debes permitir contactos"
        );

        setContactsUsers(usersMock);

        return;
      }

      const { data } =
        await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.PhoneNumbers,
          ],
        });

      if (data.length > 0) {
        const matchedUsers =
          usersMock.filter((user) =>
            data.some((contact) => {
              const phones =
                contact.phoneNumbers?.map(
                  (p) =>
                    p.number?.replace(
                      /\D/g,
                      ""
                    )
                );

              return phones?.some(
                (phone) =>
                  phone?.includes(
                    user.phone
                  )
              );
            })
          );

        if (
          matchedUsers.length > 0
        ) {
          setContactsUsers(
            matchedUsers
          );
        } else {
          setContactsUsers(
            usersMock
          );
        }
      } else {
        setContactsUsers(usersMock);
      }
    };

  /* ================= SEARCH ================= */

  const handleSearchChange = (
    text: string
  ) => {
    setSearchText(text);

    if (
      text.length > 1 &&
      !history.includes(text)
    ) {
      setHistory((prev) =>
        [text, ...prev].slice(0, 10)
      );
    }
  };

  /* ================= DELETE HISTORY ================= */

  const deleteHistoryItem = (
    itemToDelete: string
  ) => {
    setHistory((prev) =>
      prev.filter(
        (item) =>
          item !== itemToDelete
      )
    );
  };

  /* ================= FOLLOW ================= */

  const toggleFollow = (
    userId: string
  ) => {
    if (
      following.includes(userId)
    ) {
      setFollowing((prev) =>
        prev.filter(
          (id) => id !== userId
        )
      );
    } else {
      setFollowing((prev) => [
        ...prev,
        userId,
      ]);
    }
  };

  /* ================= FILTER ================= */

  const filteredUsers =
    contactsUsers.filter((user) => {
      const text =
        searchText.toLowerCase();

      return (
        user.name
          .toLowerCase()
          .includes(text) ||
        user.username
          .toLowerCase()
          .includes(text)
      );
    });

  /* ================= RENDER USER ================= */

  const renderUser = ({
    item,
  }: any) => {
    const isFollowing =
      following.includes(item.id);

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate(
            "UserProfile",
            {
              user: item,
            }
          )
        }
      >
        {/* VIDEO */}

        <Image
          source={{
            uri: item.topVideo,
          }}
          style={styles.videoPreview}
        />

        {/* OVERLAY */}

        <View style={styles.overlay}>
          <Ionicons
            name="play"
            size={15}
            color="white"
          />

          <Text style={styles.views}>
            {item.followers}
          </Text>
        </View>

        {/* AVATAR */}

        <View
          style={styles.avatarContainer}
        >
          <Image
            source={{
              uri: item.avatar,
            }}
            style={styles.avatar}
          />
        </View>

        {/* INFO */}

        <View style={styles.info}>
          <Text
            style={styles.name}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          <Text
            style={styles.username}
            numberOfLines={1}
          >
            {item.username}
          </Text>

          <Pressable
            style={[
              styles.followBtn,

              isFollowing && {
                backgroundColor:
                  "#333",
              },
            ]}
            onPress={() =>
              toggleFollow(item.id)
            }
          >
            <Text
              style={
                styles.followText
              }
            >
              {isFollowing
                ? "Siguiendo"
                : "Seguir"}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
      />

      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.title}>
          Amigos
        </Text>

        <Pressable
          onPress={() =>
            setSearchOpen(
              !searchOpen
            )
          }
        >
          <Ionicons
            name="search"
            size={24}
            color="white"
          />
        </Pressable>
      </View>

      {/* SEARCH */}

      {searchOpen && (
        <View
          style={styles.searchContainer}
        >
          <TextInput
            placeholder="Buscar amigos..."
            placeholderTextColor="#777"
            value={searchText}
            onChangeText={
              handleSearchChange
            }
            style={styles.searchInput}
          />

          {/* HISTORY */}

          {history.length > 0 && (
            <>
              <Text
                style={
                  styles.historyTitle
                }
              >
                Historial
              </Text>

              <FlatList
                data={history}
                keyExtractor={(
                  item,
                  index
                ) =>
                  index.toString()
                }
                renderItem={({
                  item,
                }) => (
                  <View
                    style={
                      styles.historyRow
                    }
                  >
                    <Text
                      style={
                        styles.historyItem
                      }
                    >
                      {item}
                    </Text>

                    <Pressable
                      onPress={() =>
                        deleteHistoryItem(
                          item
                        )
                      }
                    >
                      <Ionicons
                        name="close"
                        size={18}
                        color="#888"
                      />
                    </Pressable>
                  </View>
                )}
              />
            </>
          )}
        </View>
      )}

      {/* EMPTY */}

      {filteredUsers.length === 0 && (
        <View style={styles.emptyBox}>
          <Ionicons
            name="people"
            size={55}
            color="#444"
          />

          <Text
            style={styles.emptyText}
          >
            No encontramos amigos
          </Text>
        </View>
      )}

      {/* USERS */}

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) =>
          item.id
        }
        numColumns={2}
        contentContainerStyle={
          styles.listContent
        }
        columnWrapperStyle={
          styles.columnWrapper
        }
        renderItem={renderUser}
        showsVerticalScrollIndicator={
          false
        }
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const CARD_WIDTH =
  width * 0.46;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  /* ================= HEADER ================= */

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",

    paddingHorizontal: 18,

    paddingTop: 18,

    paddingBottom: 18,
  },

  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },

  /* ================= SEARCH ================= */

  searchContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  searchInput: {
    backgroundColor: "#181818",
    color: "white",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    fontSize: 15,
  },

  historyTitle: {
    color: "white",
    marginTop: 15,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 15,
  },

  historyRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  historyItem: {
    color: "#aaa",
    fontSize: 15,
  },

  /* ================= EMPTY ================= */

  emptyBox: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyText: {
    color: "#666",
    marginTop: 10,
    fontSize: 16,
  },

  /* ================= LIST ================= */

  listContent: {
    paddingBottom: 140,
    paddingHorizontal: 8,
  },

  columnWrapper: {
    justifyContent:
      "space-between",
  },

  /* ================= CARD ================= */

  card: {
    width: CARD_WIDTH,
    backgroundColor: "#111",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
  },

  videoPreview: {
    width: "100%",
    height: CARD_WIDTH * 1,
    resizeMode: "cover",
  },

  overlay: {
    position: "absolute",
    top: 10,
    right: 10,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      "rgba(0,0,0,0.55)",

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 20,
  },

  views: {
    color: "white",
    marginLeft: 4,
    fontWeight: "bold",
    fontSize: 11,
  },

  /* ================= AVATAR ================= */

  avatarContainer: {
    position: "absolute",
    bottom: 78,
    alignSelf: "center",
    zIndex: 10,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "white",
  },

  /* ================= INFO ================= */

  info: {
    alignItems: "center",

    paddingTop: 46,
    paddingBottom: 16,
    paddingHorizontal: 10,
  },

  name: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",

    marginTop: 10,
  },

  username: {
    color: "#888",
    marginTop: 3,
    marginBottom: 12,
    fontSize: 13,
  },

  /* ================= BUTTON ================= */

  followBtn: {
    backgroundColor: "#ff2d55",

    paddingVertical: 10,
    paddingHorizontal: 22,

    borderRadius: 30,

    minWidth: 110,

    alignItems: "center",
  },

  followText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});