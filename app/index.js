import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NoteCard from "../components/NoteCard";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [notes, setNotes] = useState([]);
  const router = useRouter();
  const [num, setNum] = useState(0);

  const loadNotes = async () => {
    try {
      const json = await AsyncStorage.getItem("NOTES");
      const notesArr = json ? JSON.parse(json) : [];
      setNotes(notesArr);
      setNum(notesArr.length);
    } catch (e) {
      console.log("Failed loading notes", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pg_title}>Notes</Text>
      {num > 0 ? (
        <View style={{ flex: 1, marginTop: 30 }}>
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            renderItem={({ item, index }) => (
              <NoteCard
                note={item}
                index={index}
                onPress={() => router.push(`/note/${item.id}`)}
              />
            )}
          />
        </View>
      ) : (
        <View>
          <Image
            source={require("../assets/Taking notes-bro.png")}
            style={{
              height: 300,
              width: 300,
              alignSelf: "center",
              marginTop: 70,
              marginBottom: 20,
            }}
          />
          <Text
            style={{
              color: "#fff",
              alignSelf: "center",
              fontSize: 25,
              textAlign: "center",
              width: "80%",
              marginHorizontal: 10,
            }}
          >
            Create new note...
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/note/new")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 15,
  },
  pg_title: {
    color: "#dddddd",
    marginTop: "10%",
    fontSize: 50,
  },
  fab: {
    position: "absolute",
    right: 25,
    bottom: 30,
    backgroundColor: "#202020",
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
});
