import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { hospitalsAPI } from "../../services/api";
import { Hospital, CreateHospital } from "../../types/api.types";
import {
  Building2,
  Trash2,
  Plus,
  X,
  Check,
  Pencil,
  MapPin,
} from "lucide-react-native";

export default function HospitalsScreen() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);

  // Modais
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [formData, setFormData] = useState<CreateHospital>({
    name: "",
    code: "",
  });

  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    hospital: Hospital | null;
  }>({
    visible: false,
    hospital: null,
  });

  const loadHospitals = async () => {
    setLoading(true);
    try {
      const data = await hospitalsAPI.getAll();
      setHospitals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  const openModal = (hospital?: Hospital) => {
    if (hospital) {
      setEditingHospital(hospital);
      setFormData({ name: hospital.name, code: hospital.code });
    } else {
      setEditingHospital(null);
      setFormData({ name: "", code: "" });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      Alert.alert("Erro", "Nome e Código (CNES/Interno) são obrigatórios");
      return;
    }

    try {
      if (editingHospital) {
        await hospitalsAPI.update(editingHospital.id, formData);
      } else {
        await hospitalsAPI.create(formData);
      }
      setModalVisible(false);
      loadHospitals();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o hospital.");
    }
  };

  const confirmDelete = async () => {
    if (!confirmModal.hospital) return;
    try {
      await hospitalsAPI.delete(confirmModal.hospital.id);
      setConfirmModal({ visible: false, hospital: null });
      loadHospitals();
    } catch (error) {
      Alert.alert("Erro", "Erro ao excluir unidade.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Hospitais</Text>
          <Text style={styles.subtitle}>
            {hospitals.length} unidades parceiras
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={hospitals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadHospitals} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.infoContainer}>
              <View style={styles.iconBox}>
                <Building2 size={22} color="#2563eb" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.nameText}>{item.name}</Text>
                <View style={styles.codeRow}>
                  <MapPin size={12} color="#9CA3AF" />
                  <Text style={styles.detailsText}>CÓD: {item.code}</Text>
                </View>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => openModal(item)}
                style={styles.editButton}
              >
                <Pencil size={18} color="#2563eb" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setConfirmModal({ visible: true, hospital: item })
                }
                style={styles.deleteButton}
              >
                <Trash2 size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* MODAL FORMULÁRIO */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingHospital ? "Editar Unidade" : "Novo Hospital"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Text style={styles.inputLabel}>Nome do Hospital</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(t) => setFormData({ ...formData, name: t })}
                placeholder="Ex: Hospital Regional"
              />

              <Text style={styles.inputLabel}>Código Unidade (CNES)</Text>
              <TextInput
                style={styles.input}
                value={formData.code}
                onChangeText={(t) => setFormData({ ...formData, code: t })}
                placeholder="Ex: 123456"
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Check size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Confirmar Cadastro</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* MODAL CONFIRMAÇÃO (ESTILO SWEETALERT) */}
      <Modal visible={confirmModal.visible} transparent animationType="fade">
        <View style={styles.swalOverlay}>
          <View style={styles.swalBox}>
            <View style={styles.swalIconBox}>
              <Building2 size={40} color="#ef4444" />
            </View>
            <Text style={styles.swalTitle}>Remover Hospital?</Text>
            <Text style={styles.swalText}>
              Você está prestes a excluir o {confirmModal.hospital?.name}. Esta
              ação não pode ser desfeita.
            </Text>

            <View style={styles.swalButtons}>
              <TouchableOpacity
                style={styles.swalCancel}
                onPress={() =>
                  setConfirmModal({ visible: false, hospital: null })
                }
              >
                <Text style={styles.swalCancelText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.swalConfirm}
                onPress={confirmDelete}
              >
                <Text style={styles.swalConfirmText}>Sim, remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6B7280" },
  addButton: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 16,
    elevation: 4,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  infoContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconBox: {
    backgroundColor: "#EFF6FF",
    padding: 10,
    borderRadius: 14,
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  nameText: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  codeRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 4 },
  detailsText: { fontSize: 12, color: "#9CA3AF", fontWeight: "600" },
  actions: { flexDirection: "row", gap: 8 },
  editButton: { backgroundColor: "#EFF6FF", padding: 8, borderRadius: 10 },
  deleteButton: { backgroundColor: "#FEE2E2", padding: 8, borderRadius: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: "40%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  form: { gap: 15 },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: -10,
  },
  input: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  swalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  swalBox: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
  },
  swalIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  swalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 10,
  },
  swalText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  swalButtons: { flexDirection: "row", gap: 12, width: "100%" },
  swalCancel: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  swalCancelText: { fontWeight: "bold", color: "#4B5563" },
  swalConfirm: {
    flex: 2,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    alignItems: "center",
  },
  swalConfirmText: { fontWeight: "bold", color: "white" },
});
