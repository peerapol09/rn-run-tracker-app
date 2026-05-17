import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Run() {
  return (
    <View style={styles.container}>
      {/* picture */}
      <Image
        source={{ uri: "https://example.com/runlogo.jpg" }}
        style={styles.runlogo}
      />

      {/* แสดงปุ่มเปิดไปหน้า Add */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/add")}
      >
        <Ionicons name="add-circle" size={30} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  runlogo: {
    width: 150,
    height: 150,
  },
  addBtn: {
    position: "absolute",
    bottom: 50,
    right: 50,
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#0facf5",
    justifyContent: "center",
    alignItems: "center",
  },
});
