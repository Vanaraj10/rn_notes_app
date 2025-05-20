import { View, Alert, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { Ionicons } from "@expo/vector-icons";

export default function NoteScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const loadNote = async () => {
    try {
      const savedJson = await AsyncStorage.getItem("NOTES");
      const saved = savedJson ? JSON.parse(savedJson) : [];
      const note = saved.find((n) => n.id === id);

      if (note) {
        setTitle(note.title);
        setBody(note.body);
      }
    } catch (e) {
      console.log("Error loading notes", e);
    }
  };

  const saveNote = async () => {
    if (!title.trim()) {
      Alert.alert("Please enter a title");
      return;
    }
    try {
      const savedJson = await AsyncStorage.getItem("NOTES");
      const saved = savedJson ? JSON.parse(savedJson) : [];
      let updated;
      if (id && id !== "new") {
        updated = saved.map((n) =>
          n.id === id ? { ...n, title, body, updatedAt: Date.now() } : n
        );
      } else {
        const newNote = { id: uuid.v4(), title, body, createdAt: Date.now() };
        updated = [newNote, ...saved];
      }
      await AsyncStorage.setItem("NOTES", JSON.stringify(updated));
      router.back();
    } catch (e) {
      console.error("Failed saving note", e);
    }
  };

  useEffect(() => {
    if (id && id !== "new") loadNote();
  }, [id]);

  const deleteNote = async () => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const savedJson = await AsyncStorage.getItem("NOTES");
            const saved = savedJson ? JSON.parse(savedJson) : [];
            const updated = saved.filter((n) => n.id !== id);
            await AsyncStorage.setItem("NOTES", JSON.stringify(updated));
            router.back();
          } catch (e) {
            console.error("Failed deleting note", e);
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <View
        style={{
          marginTop: 40,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
        }}
      >
        <TouchableOpacity
          style={{ backgroundColor: "#202020", borderRadius: 10, padding: 8 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" color="#fff" size={30} />
        </TouchableOpacity>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={{ backgroundColor: "#202020", borderRadius: 10, padding: 8 }}
            onPress={saveNote}
          >
            <Ionicons name="save" color={"#fff"} size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: "#202020", borderRadius: 10, padding: 8 }}
            onPress={deleteNote}
          >
            <Ionicons name="trash" color={"#fff"} size={30} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ paddingHorizontal: 17, flex: 1, marginTop: 30 }}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          multiline
          placeholderTextColor={"#dddddd"}
          place
          style={{ fontSize: 45, fontWeight: 700, color: "#cccccc" }}
        />
        <TextInput
          placeholder="Write your note here..."
          value={body}
          onChangeText={setBody}
          placeholderTextColor={"#cccccc"}
          style={{ fontSize: 20, fontWeight: "500", color: "#bbbbbb" }}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}
