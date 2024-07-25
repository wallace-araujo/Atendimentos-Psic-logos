import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
export default function Actions() {
  const navigation = useNavigation();

  return (
    <ScrollView
      style={styles.container}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate("clients")}
      >
        <View style={styles.areaButton}>
          <MaterialIcons name="group" size={26} color="#000" />
        </View>
        <Text style={styles.labelButton}>clientes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate("service")}
      >
        <View style={styles.areaButton}>
          <MaterialIcons name="wysiwyg" size={26} color="#000" />
        </View>
        <Text style={styles.labelButton}>atendimentos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate("debts")}
      >
        <View style={styles.areaButton}>
          <MaterialIcons name="notifications" size={26} color="#000" />
        </View>
        <Text style={styles.labelButton}>cobrança</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <View style={styles.areaButton}>
          <MaterialIcons name="topic" size={26} color="#000" />
        </View>
        <Text style={styles.labelButton}>recibos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    maxHeight: 84,
    marginBottom: 14,
    marginTop: 18,
    paddingEnd: 14,
    paddingStart: 14,
  },
  actionButton: {
    marginRight: 32,
    alignItems: "center",
  },
  areaButton: {
    backgroundColor: "#ecf0f1",
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  labelButton: {
    marginTop: 4,
    fontWeight: "bold",
    textAlign: "center",
  },
});
