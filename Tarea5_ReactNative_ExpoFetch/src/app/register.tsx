import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RegisterScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("usuario");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleRegister = async () => {
    setError("");
    if (!nombre || !email || !password) {
      setError("Campos requeridos. Completa todos los datos.");
      return;
    }

    setCargando(true);
    try {
      const response = await fetch(`${API_URL}/auth/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, email, password, rol }),
      });

      const data = await response.json();

      if (response.ok) {
        router.replace("/");
      } else {
        setError(data.error || "No se pudo completar el registro.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Register</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Nombre..."
          placeholderTextColor={"#888"}
          autoCapitalize="none"
          autoComplete="name"
          value={nombre}
          onChangeText={setNombre}
        />
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

        {/* Selector de rol */}
        <View style={styles.rolContainer}>
          <Pressable
            style={[styles.rolBoton, rol === "usuario" && styles.rolBotonActivo]}
            onPress={() => setRol("usuario")}
          >
            <Text
              style={[styles.rolTexto, rol === "usuario" && styles.rolTextoActivo]}
            >
              Usuario
            </Text>
          </Pressable>
          <Pressable
            style={[styles.rolBoton, rol === "admin" && styles.rolBotonActivo]}
            onPress={() => setRol("admin")}
          >
            <Text
              style={[styles.rolTexto, rol === "admin" && styles.rolTextoActivo]}
            >
              Admin
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.button}
          onPress={handleRegister}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </Pressable>

        <Link href={"/"} style={styles.linkText}>
          ¿Tienes una cuenta?
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
  input: {
    width: "100%",
    height: 48, // Altura accesible
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  rolContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  rolBoton: {
    flex: 1,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  rolBotonActivo: {
    backgroundColor: "blue",
    borderColor: "blue",
  },
  rolTexto: {
    color: "#333",
    fontWeight: "bold",
  },
  rolTextoActivo: {
    color: "#fff",
  },
  linkText: {
    color: "blue",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});
