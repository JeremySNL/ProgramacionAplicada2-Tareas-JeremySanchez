import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, SplashScreen, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

SplashScreen.hideAsync();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cargando, setCargando] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

  const handleLogin = async () => {
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Campos requeridos. Por favor ingresa tu correo y contraseña.");
      return;
    }

    setCargando(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          await AsyncStorage.setItem("userToken", data.token);
        }
        router.replace("/home");
      } else {
        setErrorMessage("Credenciales incorrectas.");
      }
    } catch {
      setErrorMessage("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Email..."
          placeholderTextColor={"#888"}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password..."
          placeholderTextColor={"#888"}
          secureTextEntry={true}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={styles.button}
          onPress={handleLogin}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </Pressable>

        <Link href={"/register"} style={styles.linkText}>
          ¿No tienes una cuenta?
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24, // Padding adecuado para que no rompa la pantalla
    width: "85%", // Ancho adaptable para cualquier móvil
    maxWidth: 400, // Para que no se estire demasiado en pantallas grandes
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 48, // Altura accesible
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "blue",
    height: 48, // Altura accesible
    width: "100%", // Ancho completo del contenedor
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    color: "blue",
    marginTop: 8,
  },
  errorText: {
    color: "red",
    textAlign: "center"
  },
});
