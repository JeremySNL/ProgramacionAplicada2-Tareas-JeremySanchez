import { StyleSheet, FlatList } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista hardcodeada</Text>
      <FlatList
        data={[
          {
            id: "1",
            nombre: "Jeremy Sanchez Cabrera",
            matricula: "1000-4353",
          },
          {
            id: "2",
            nombre: "Carlos Martin Ferrera",
            matricula: "1000-4369",
          },
          {
            id: "3",
            nombre: "Juan Perez Castillo",
            matricula: "1000-4201",
          },
          {
            id: "4",
            nombre: "Wilbert Rosario Sanchez",
            matricula: "1000-4399",
          },
          {
            id: "5",
            nombre: "Jean Marte Nunez",
            matricula: "1000-4401",
          },
        ]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{ padding: 15, backgroundColor: "#adadad", marginBottom: 10 }}
          >
            <Text style={{ fontSize: 18 }}>
              {item.nombre}
            </Text>
            <Text style={{ color: "#666" }}>
              {item.matricula}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
