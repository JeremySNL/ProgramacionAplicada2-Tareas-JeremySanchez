import { StyleSheet, FlatList, TextInput, Button } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useState } from "react";
import { stylePropsBuilder } from "react-native-reanimated/lib/typescript/common";

export default function TabTwoScreen() {
  const [input, setInput] = useState("");
  const [texto, setTexto] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario</Text>

      <TextInput
        placeholder="Escribe algo..."
        placeholderTextColor="#888"
        value={input}
        onChangeText={setInput}
        style={styles.input}

      />
      <Button title="Enter" onPress={() => {
        setTexto(input);
        setInput("");
      }}></Button>
      <Text>{texto}</Text>
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
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
});
