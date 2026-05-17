import { supabase } from "@/services/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native"; // ใช้ดักจับตอนหน้าจอถูกเปิด/กดย้อนกลับ
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 1. กำหนด Interface ให้ตรงกับตาราง runs ใน Supabase
interface RunRecord {
  id: number;
  location: string;
  distance: number;
  time_of_day: string;
  run_date: string;
  image_url: string;
}

export default function Run() {
  // สร้าง State สำหรับเก็บข้อมูลและสถานะการรีเฟรช
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // 2. ฟังก์ชันดึงข้อมูลทั้งหมดมาจากตาราง runs
  const fetchRunsData = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from("runs")
        .select("*")
        .order("id", { ascending: false }); // เอาข้อมูลที่พึ่งบันทึกล่าสุดขึ้นก่อน

      if (error) {
        Alert.alert("คำเตือน", "พบปัญหาในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง");
        return;
      }

      setRuns(data as RunRecord[]);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // 3. ใช้ useFocusEffect เพื่อสั่งให้ fetch ข้อมูลใหม่ทุกครั้งที่หน้านี้แสดงผล (รวมถึงตอนย้อนกลับมา)
  useFocusEffect(
    useCallback(() => {
      fetchRunsData();
    }, []),
  );

  // 4. ฟังก์ชันจัดการโครงสร้างหน้าตาของแต่ละ Item ใน FlatList
  const renderRunItem = ({ item }: { item: RunRecord }) => (
    <TouchableOpacity
      style={styles.cardSty}
      onPress={() =>
        router.push({
          pathname: "/[id]", //
          params: { ...item },
        })
      }
    >
      {/* รูปภาพสถานที่ที่ดึงมาจาก Supabase Storage */}
      <Image source={{ uri: item.image_url }} style={styles.cardImg} />

      {/* รายละเอียด ชื่อสถานที่ และ วันที่(ช่วงเวลา) */}
      <View style={styles.cardContent}>
        <Text style={styles.txtLocation} numberOfLines={1}>
          {item.location}
        </Text>
        <Text style={styles.txtDate}>
          {item.run_date} ({item.time_of_day})
        </Text>
      </View>

      {/* ระยะทางกิโลเมตรและลูกศรฝั่งขวา */}
      <View style={styles.distanceContainer}>
        <Text style={styles.txtDistance}>{item.distance} km</Text>
        <Ionicons name="chevron-forward" size={16} color="#c7c7cc" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* ส่วนหัวแสดงรูปภาพโลโก้คนวิ่งด้านบน */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/runlogo.png")} // เปลี่ยนเป็น URL รูปจริงของคุณได้ครับ
          style={styles.runlogo}
        />
      </View>

      {/* แสดงรายการการวิ่งทั้งหมด */}
      <FlatList
        data={runs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRunItem}
        contentContainerStyle={{ paddingBottom: 120 }} // เว้นพื้นที่ด้านล่างไม่ให้ปุ่มบวกลอยมาบังการ์ด
        refreshing={refreshing}
        onRefresh={fetchRunsData} // ลากจอลงเพื่อดึงข้อมูลใหม่แบบแมนนวลได้ด้วย
      />

      {/* แสดงปุ่มเปิดไปหน้า Add (โครงสร้างตำแหน่งเดิมของคุณ) */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/add")}
      >
        <Ionicons name="add" size={35} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  runlogo: {
    width: 150,
    height: 150,
  },
  addBtn: {
    position: "absolute",
    bottom: 50,
    right: 50,
    width: 60, // ปรับขนาดเพิ่มขึ้นนิดหน่อยให้รับกับไอคอนด้านในอย่างสวยงาม
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0facf5", // สีฟ้าเดิมของคุณ
    justifyContent: "center",
    alignItems: "center",
    // เพิ่มเงาให้ปุ่มดูนูนขึ้นมา
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  // --- สไตล์ส่วนของรายการการ์ดแสดงผล ---
  cardSty: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: "#efefef",
    // เงาสำหรับการ์ด
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  txtLocation: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  txtDate: {
    fontSize: 12,
    color: "#747474",
    marginTop: 5,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  txtDistance: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0facf5", // ใช้สีฟ้าธีมเดียวกับปุ่มของคุณ
    marginRight: 5,
  },
});
