import { supabase } from "@/services/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RunDetail() {
  // ตัวแปรเก็บข้อมูลพารามิเตอร์ที่ส่งมาจากหน้า Run คือ id ของรายการวิ่งที่ส่งมา
  const { id } = useLocalSearchParams();

  // สร้าง state เพื่อเก็บข้อมูลรายละเอียดของรายการวิ่งที่ดึงมาจาก Supabase
  // เพื่อเอาไปใช้กับ component ที่จะแสดงบน UI เพื่อแก้ไข หรือจบทิ้งต่อไป
  const [location, setLocation] = React.useState("");
  const [distance, setDistance] = React.useState("");
  const [timeOfDay, setTimeOfDay] = React.useState("เช้า");
  const [imageUri, setImageUri] = React.useState(""); //สำหรับใช้แสดงบน UI

  // ดึงข้อมูลรายละเอียดของรายการวิ่งจาก Supabase โดยใช้ id ที่ได้จากพารามิเตอร์
  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลจาก Supabase และกำหนดค่าที่ดึงมาให้กับ state ที่เตรียมไว้
    const fetchRunDetail = async () => {
      // ดึงข้อมูลจาก Supabase โดยใช้ id ที่ได้จากพารามิเตอร์
      const { data, error } = await supabase
        .from("runs")
        .select("*")
        .eq("id", id)
        .single();
      // ตรวจสอบ Error
      if (error) {
        Alert.alert(
          "คำเตือน",
          "ไม่สามารถดึงข้อมูลรายละเอียดรายการวิ่งได้ กรุณาลองใหม่",
        );
        return;
      }
      // กำหนดค่าที่ดึงมาให้กับ state
      if (data) {
        setLocation(data.location);
        setDistance(data.distance.toString());
        setTimeOfDay(data.time_of_day);
        setImageUri(data.image_url);
      }
    };

    // เรียกใช้ฟังก์ชันดึงข้อมูล
    fetchRunDetail();
  }, []);

  // ฟังก์ชันสำหรับอัปเดตข้อมูลรายการวิ่งใน Supabase
  const handleUpdateRun = async () => {
    // Validate UI
    if (!location || !distance) {
      Alert.alert("คำเตือน", "กรุณาป้อนข้อมูลให้ครบถ้วนด้วยนะคร๊าบบบบบ");
      return;
    }

    // บันทึกแก้ไขไปยัง Supabase
    const { error } = await supabase
      .from("runs")
      .update({
        location: location,
        distance: parseFloat(distance),
        time_of_day: timeOfDay,
      })
      .eq("id", id);
    // ตรวจสอบ Error
    if (error) {
      Alert.alert("คำเตือน", "ไม่สามารถบันทึกการแก้ไขได้ กรุณาลองใหม่");
      return;
    }

    // แสดงข้อความแจ้งผลการบันทึกแก้ไข
    Alert.alert("ผลการทำงาน", "บันทึกการแก้ไขเรียบร้อยแล้ว");

    // ย้อนกลับไปหน้า /run เพื่อแสดงข้อมูลล่าสุดจาก Supabase
    router.back();
  };

  // ฟังก์ชันสำหรับลบรายการวิ่งใน Supabase
  const handleDeleteRun = async () => {
    Alert.alert(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ว่าต้องการลบรายการวิ่งนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "ลบ",
          style: "destructive",
          onPress: async () => {
            // ลบรายการวิ่งใน Supabase โดยใช้ id ที่ได้จากพารามิเตอร์
            const { error: deleteError } = await supabase
              .from("runs")
              .delete()
              .eq("id", id);
            // ตรวจสอบ Error
            if (deleteError) {
              Alert.alert("คำเตือน", "ไม่สามารถลบรายการวิ่งได้ กรุณาลองใหม่");
              return;
            }

            // ลบรูปออกจาก Supabase Storage ด้วย
            const { error: deleteImageError } = await supabase.storage
              .from("run_bk")
              .remove([imageUri.split("/").pop() || ""]);
            // ตรวจสอบ Error
            if (deleteImageError) {
              Alert.alert(
                "คำเตือน",
                "ไม่สามารถลบรูปภาพที่เกี่ยวข้องได้ กรุณาลองใหม่",
              );
              return;
            }
            // แสดงผลการลบ
            Alert.alert("ผลการทำงาน", "ลบรายการวิ่งเรียบร้อยแล้ว");

            // ย้อนกลับไปหน้า /run เพื่อแสดงข้อมูลล่าสุดจาก Supabase
            router.back();
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* ส่วนแสดงรูปภาพ */}
      <Image
        source={{ uri: imageUri }}
        style={styles.imgRun}
        resizeMode="cover"
      />

      {/* ส่วนแสดงรายละเอียดการวิ่ง เพื่อให้ผู้ใช้ดูและแก้ไขต่อไป */}
      <View style={styles.detailContainer}>
        {/* ป้อนสถานที่วิ่ง */}
        <Text style={styles.titleShow}>สถานที่วิ่ง</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="เช่น สวนลุมพินี"
          style={styles.inputValue}
        />

        {/* ป้อนระยะทาง */}
        <Text style={styles.titleShow}>ระยะทาง (กิโลเมตร)</Text>
        <TextInput
          value={distance}
          onChangeText={setDistance}
          placeholder="เช่น 5.2"
          keyboardType="numeric"
          style={styles.inputValue}
        />

        {/* เลือกช่วงเวลา */}
        <Text style={styles.titleShow}>ช่วงเวลา</Text>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <TouchableOpacity
            style={[
              styles.todBtn,
              { backgroundColor: timeOfDay === "เช้า" ? "#1889da" : "#e6e6e6" },
            ]}
            onPress={() => setTimeOfDay("เช้า")}
          >
            <Text style={{ fontFamily: "Kanit_400Regular", color: "#4d4d4d" }}>
              เช้า
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.todBtn,
              { backgroundColor: timeOfDay === "เย็น" ? "#1889da" : "#e6e6e6" },
            ]}
            onPress={() => setTimeOfDay("เย็น")}
          >
            <Text style={{ fontFamily: "Kanit_400Regular", color: "#4d4d4d" }}>
              เย็น
            </Text>
          </TouchableOpacity>
        </View>

        {/* ปุ่มบันทึกแก้ไข  */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateRun}>
          <Text style={{ fontFamily: "Kanit_700Bold", color: "#fff" }}>
            บันทึกการแก้ไข
          </Text>
        </TouchableOpacity>

        {/* ปุ่มลบรายการ */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteRun}>
          <Ionicons name="trash-bin" size={24} color="red" />
          <Text style={{ fontFamily: "Kanit_400Regular", color: "#f00" }}>
            {"   "}ลบรายการนี้
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  deleteBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  saveBtn: {
    padding: 15,
    backgroundColor: "#1889da",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  todBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  inputValue: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontFamily: "Kanit_400Regular",
    backgroundColor: "#EFEFEF",
  },
  titleShow: {
    fontFamily: "Kanit_700Bold",
    marginBottom: 10,
  },
  detailContainer: {
    backgroundColor: "#FFF",
    height: "100%",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },
  imgRun: {
    width: "100%",
    height: 250,
  },
  container: {
    flex: 1,
  },
});
