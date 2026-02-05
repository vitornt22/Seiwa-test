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
import { doctorsAPI } from "../../services/api";
import { Doctor, CreateDoctor } from "../../types/api.types";
import { UserRound, Trash2, Plus, X, Check, Pencil } from "lucide-react-native";

export default function DoctorsScreen() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados para Modal de Cadastro/Edição
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<CreateDoctor>({
    name: "",
    crm: "",
    specialty: "",
  });

  // Estados para Modal de Confirmação (Estilo SweetAlert)
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    doctor: Doctor | null;
  }>({
    visible: false,
    doctor: null,
  });

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorsAPI.getAll();
      setDoctors(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const openModal = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        crm: doctor.crm,
        specialty: doctor.specialty,
      });
    } else {
      setEditingDoctor(null);
      setFormData({ name: "", crm: "", specialty: "" });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.crm) {
      Alert.alert("Erro", "Nome e CRM são obrigatórios");
      return;
    }

    try {
      if (editingDoctor) {
        await doctorsAPI.update(editingDoctor.id, formData);
      } else {
        // Certifique-se de que o doctorsAPI.create existe no seu api.ts
        await doctorsAPI.create(formData);
      }
      setModalVisible(false);
      loadDoctors();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  const confirmDelete = async () => {
    if (!confirmModal.doctor) return;
    try {
      await doctorsAPI.delete(confirmModal.doctor.id);
      setConfirmModal({ visible: false, doctor: null });
      loadDoctors();
    } catch (error) {
      Alert.alert("Erro", "Erro ao excluir médico.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Médicos</Text>
          <Text style={styles.subtitle}>{doctors.length} profissionais</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadDoctors} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.infoContainer}>
              <View style={styles.iconBox}>
                <UserRound size={22} color="#2563eb" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.nameText}>{item.name}</Text>
                <Text style={styles.detailsText}>
                  CRM {item.crm} • {item.specialty}
                </Text>
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
                onPress={() => setConfirmModal({ visible: true, doctor: item })}
                style={styles.deleteButton}
              >
                <Trash2 size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingDoctor ? "Editar Médico" : "Novo Médico"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Text style={styles.inputLabel}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(t) => setFormData({ ...formData, name: t })}
                placeholder="Ex: Dr. Vitor Neto"
              />

              <Text style={styles.inputLabel}>CRM</Text>
              <TextInput
                style={styles.input}
                value={formData.crm}
                onChangeText={(t) => setFormData({ ...formData, crm: t })}
                placeholder="000000/PI"
              />

              <Text style={styles.inputLabel}>Especialidade</Text>
              <TextInput
                style={styles.input}
                value={formData.specialty}
                onChangeText={(t) => setFormData({ ...formData, specialty: t })}
                placeholder="Ex: Cardiologia"
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Check size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* MODAL DE CONFIRMAÇÃO (ESTILO SWEETALERT) */}
      <Modal visible={confirmModal.visible} transparent animationType="fade">
        <View style={styles.swalOverlay}>
          <View style={styles.swalBox}>
            <View style={styles.swalIconBox}>
              <Trash2 size={40} color="#ef4444" />
            </View>
            <Text style={styles.swalTitle}>Tem certeza?</Text>
            <Text style={styles.swalText}>
              Você não poderá reverter a exclusão do(a) Dr(a).{" "}
              {confirmModal.doctor?.name}!
            </Text>

            <View style={styles.swalButtons}>
              <TouchableOpacity
                style={styles.swalCancel}
                onPress={() =>
                  setConfirmModal({ visible: false, doctor: null })
                }
              >
                <Text style={styles.swalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.swalConfirm}
                onPress={confirmDelete}
              >
                <Text style={styles.swalConfirmText}>Sim, excluir!</Text>
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
  detailsText: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  actions: { flexDirection: "row", gap: 8 },
  editButton: { backgroundColor: "#EFF6FF", padding: 8, borderRadius: 10 },
  deleteButton: { backgroundColor: "#FEE2E2", padding: 8, borderRadius: 10 },

  // Estilos do Modal de Formulário
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
    minHeight: "50%",
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

  // Estilos do Modal Estilo SweetAlert
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
