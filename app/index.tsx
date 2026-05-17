import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function Index() {
  // หน่วงเวลาแสดง Splash Screen 3 วินาที
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/run");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={Styles.container}>
      <Image
        source={require("../assets/images/runlogo.png")}
        style={Styles.runlogo}
      />
      <Text style={Styles.title1}>Run Tracker</Text>
      <Text style={Styles.title2}>วิ่งเพื่อสุขภาพ</Text>
      <ActivityIndicator
        size="large"
        color="rgb(0, 0, 0)"
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  runlogo: {
    width: 150,
    height: 150,
  },
  title1: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Kanit_700Bold",
    color: "#00d9ff",
    marginTop: 20,
  },
  title2: {
    fontSize: 20,
    fontFamily: "Kanit_400Regular",
    color: "#1c565a",
  },
});
