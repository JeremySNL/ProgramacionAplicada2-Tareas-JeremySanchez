import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Tarea = {
  id: number;
  titulo: string;
  completada: boolean;
  creadoEn: string;
  usuarioId: number;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Cabeceras con el token guardado en el login
const authHeaders = async () => {
  const token = await AsyncStorage.getItem("userToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const formatearFecha = (fechaStr: string) => {
  if (!fechaStr) return "";
  const fecha = new Date(fechaStr);
  return fecha.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function HomeScreen() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  const cargarTareas = () => {
    authHeaders()
      .then((headers) => fetch(`${API_URL}/v2/tareas`, { headers }))
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data) => {
        setTareas(data);
        setError("");
      })
      .catch(() => setError("No se pudieron cargar las tareas."))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    const verificar = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        router.replace("/");
        return;
      }
      cargarTareas();
    };
    verificar();
  }, [router]);

  const reintentar = () => {
    setCargando(true);
    cargarTareas();
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem("userToken");
    router.replace("/");
  };

  const handleAgregarTarea = async () => {
    if (!nuevaTarea.trim()) return;

    try {
      const response = await fetch(`${API_URL}/v2/tareas`, {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ titulo: nuevaTarea.trim() }),
      });
      if (!response.ok) throw new Error();
      const tareaCreada = await response.json();
      setTareas([tareaCreada, ...tareas]);
      setNuevaTarea("");
    } catch {
      setError("No se pudo agregar la tarea.");
    }
  };

  const toggleCompletada = async (tarea: Tarea) => {
    try {
      const response = await fetch(`${API_URL}/v2/tareas/${tarea.id}`, {
        method: "PUT",
        headers: await authHeaders(),
        body: JSON.stringify({ completada: !tarea.completada }),
      });
      if (!response.ok) throw new Error();
      const actualizada = await response.json();
      setTareas(tareas.map((t) => (t.id === actualizada.id ? actualizada : t)));
    } catch {
      setError("No se pudo actualizar la tarea.");
    }
  };

  const handleEliminarTarea = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/v2/tareas/${id}`, {
        method: "DELETE",
        headers: await authHeaders(),
      });
      if (!response.ok) throw new Error();
      setTareas(tareas.filter((t) => t.id !== id));
    } catch {
      setError("No se pudo eliminar la tarea.");
    }
  };

  const tareaRender: ListRenderItem<Tarea> = ({ item }) => (
    <View style={styles.cardTarea}>
      <Pressable
        style={styles.contenidoTarea}
        onPress={() => toggleCompletada(item)}
      >
        <View
          style={[
            styles.checkbox,
            item.completada && styles.checkboxCompletado,
          ]}
        >
          {item.completada && <Text style={styles.checkmark}>✓</Text>}
        </View>

        <Text
          style={[
            styles.textoTarea,
            item.completada && styles.textoTareaCompletada,
          ]}
        >
          {item.titulo}
        </Text>
      </Pressable>

      <Text style={styles.fecha}>{formatearFecha(item.creadoEn)}</Text>

      <Pressable
        style={styles.botonEliminar}
        onPress={() => handleEliminarTarea(item.id)}
      >
        <Text style={styles.textoEliminar}>✕</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTexto}>
          <Text style={styles.titulo}>Mis Tareas</Text>
          <Text style={styles.subtitulo}>
            {tareas.filter((t) => !t.completada).length} pendientes
          </Text>
        </View>
        <Pressable style={styles.botonSalir} onPress={cerrarSesion}>
          <Text style={styles.textoSalir}>Cerrar sesión</Text>
        </Pressable>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe una nueva tarea..."
          placeholderTextColor="#888"
          value={nuevaTarea}
          onChangeText={setNuevaTarea}
        />
        <Pressable style={styles.botonAgregar} onPress={handleAgregarTarea}>
          <Text style={styles.textoBotonAgregar}>+</Text>
        </Pressable>
      </View>

      {error ? (
        <Pressable style={styles.errorContainer} onPress={reintentar}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorRetry}>Toca para reintentar</Text>
        </Pressable>
      ) : null}

      {cargando ? (
        <ActivityIndicator style={styles.loader} size="large" color="blue" />
      ) : (
        <FlatList
          data={tareas}
          renderItem={tareaRender}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes tareas pendientes</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTexto: {
    flex: 1,
  },
  botonSalir: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ffe5e5",
  },
  textoSalir: {
    color: "#cc0000",
    fontWeight: "bold",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  subtitulo: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  formContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  botonAgregar: {
    width: 48,
    height: 48,
    backgroundColor: "blue",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textoBotonAgregar: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  cardTarea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  contenidoTarea: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#bbb",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCompletado: {
    backgroundColor: "blue",
    borderColor: "blue",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  textoTarea: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  textoTareaCompletada: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  botonEliminar: {
    padding: 6,
    marginLeft: 8,
  },
  textoEliminar: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
  },
  loader: {
    marginTop: 40,
  },
  errorContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#ffe5e5",
    alignItems: "center",
  },
  errorText: {
    color: "#cc0000",
    fontWeight: "bold",
  },
  errorRetry: {
    color: "#cc0000",
    fontSize: 12,
    marginTop: 4,
  },
  fecha: {
    fontSize: 12,
    color: "#888",
  },
});
