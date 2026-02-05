import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { transfersAPI, doctorsAPI, hospitalsAPI } from "../../services/api";
import {
  Transfer,
  Doctor,
  Hospital,
  CreateTransfer,
} from "../../types/api.types";
import { Banknote, Trash2, Plus, X, Check, Search } from "lucide-react-native";

export default function TransfersScreen() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<CreateTransfer>({
    doctor: "",
    hospital: "",
    amount: 0,
    transfer_date: new Date().toISOString().split("T")[0],
  });

  // Carrega apenas a lista principal de repasses
  const loadTransfers = async () => {
    setLoading(true);
    try {
      const data = await transfersAPI.getAll();
      setTransfers(data);
    } catch (error) {
      console.error("Erro ao carregar repasses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Busca médicos e hospitais (usado para nomes na lista e preencher o form)
  const loadSelectionData = async () => {
    try {
      const [docData, hospData] = await Promise.all([
        doctorsAPI.getAll(),
        hospitalsAPI.getAll(),
      ]);
      setDoctors(docData);
      setHospitals(hospData);
    } catch (e) {
      console.log("Erro ao carregar seletores");
    }
  };

  // FUNÇÃO CHAVE: Abre o modal e garante dados atualizados
  const handleOpenModal = async () => {
    setLoading(true); // Feedback visual enquanto revalida
    await loadSelectionData();

    setFormData({
      doctor: "",
      hospital: "",
      amount: 0,
      transfer_date: new Date().toISOString().split("T")[0],
    });

    setLoading(false);
    setModalVisible(true);
  };

  useEffect(() => {
    loadTransfers();
    loadSelectionData(); // Carga inicial para popular os nomes na lista
  }, []);

  const handleDelete = async (id: string, docName: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente remover o repasse do(a) Dr(a). ${docName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await transfersAPI.delete(id);
              loadTransfers();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível remover o repasse.");
            }
          },
        },
      ],
    );
  };

  const filteredTransfers = transfers.filter((t) => {
    const docName =
      doctors.find((d) => d.id === t.doctor)?.name.toLowerCase() || "";
    const hospName =
      hospitals.find((h) => h.id === t.hospital)?.name.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return docName.includes(query) || hospName.includes(query);
  });

  const handleSave = async () => {
    if (!formData.doctor || !formData.hospital || formData.amount <= 0) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    try {
      await transfersAPI.create(formData);
      setModalVisible(false);
      loadTransfers();
      Alert.alert("Sucesso", "Repasse registrado!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao registrar repasse.");
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Repasses</Text>
          <Text style={styles.subtitle}>Pagamentos efetuados</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleOpenModal}>
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Search size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Pesquisar médico ou hospital..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredTransfers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadTransfers} />
        }
        renderItem={({ item }) => {
          const doc = doctors.find((d) => d.id === item.doctor);
          const hosp = hospitals.find((h) => h.id === item.hospital);

          return (
            <View style={styles.card}>
              <View style={styles.cardIcon}>
                <Banknote size={20} color="#2563EB" />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardAmount}>
                  {formatCurrency(item.amount)}
                </Text>
                <Text style={styles.cardDoctor}>{doc?.name || "..."}</Text>
                <Text style={styles.cardHospital}>{hosp?.name || "..."}</Text>
              </View>

              <View style={styles.rightSection}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>
                    {item.transfer_date.split("-").reverse().join("/")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id, doc?.name || "Médico")}
                  style={styles.deleteBtn}
                >
                  <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior="padding" style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Repasse</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={26} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalForm}>
                <Text style={styles.label}>Valor do Pagamento</Text>
                <TextInput
                  placeholder="R$ 0,00"
                  keyboardType="numeric"
                  style={styles.inputAmount}
                  onChangeText={(v) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(v.replace(",", ".")) || 0,
                    })
                  }
                />

                <Text style={styles.label}>Selecione o Médico</Text>
                <View style={styles.chipContainer}>
                  {doctors.map((doc) => (
                    <TouchableOpacity
                      key={doc.id}
                      onPress={() =>
                        setFormData({ ...formData, doctor: doc.id })
                      }
                      style={[
                        styles.chip,
                        formData.doctor === doc.id && styles.chipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          formData.doctor === doc.id && styles.chipTextSelected,
                        ]}
                      >
                        {doc.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Selecione o Hospital</Text>
                <View style={styles.chipContainer}>
                  {hospitals.map((hosp) => (
                    <TouchableOpacity
                      key={hosp.id}
                      onPress={() =>
                        setFormData({ ...formData, hospital: hosp.id })
                      }
                      style={[
                        styles.chip,
                        formData.hospital === hosp.id && styles.chipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          formData.hospital === hosp.id &&
                            styles.chipTextSelected,
                        ]}
                      >
                        {hosp.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={{ height: 20 }} />
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
              <Check size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.btnSaveText}>Confirmar Repasse</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
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
    padding: 25,
    paddingTop: 50,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6B7280" },
  addButton: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 18,
    elevation: 4,
  },
  searchRow: { paddingHorizontal: 25, marginBottom: 15 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,

    borderColor: "#E5E7EB",
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  list: { paddingHorizontal: 25, paddingBottom: 30 },
  card: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 18,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  cardIcon: {
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 16,
    marginRight: 15,
  },
  cardBody: { flex: 1 },
  cardAmount: { fontSize: 18, fontWeight: "bold", color: "#1E40AF" },
  cardDoctor: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    marginTop: 2,
  },
  cardHospital: { fontSize: 12, color: "#6B7280" },
  rightSection: { alignItems: "flex-end", gap: 10 },
  dateBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  dateText: { fontSize: 11, fontWeight: "bold", color: "#4B5563" },
  deleteBtn: { padding: 8, backgroundColor: "#FEE2E2", borderRadius: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 25,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  modalForm: { gap: 20 },
  label: { fontSize: 14, fontWeight: "bold", color: "#374151" },
  inputAmount: {
    backgroundColor: "#F3F4F6",
    padding: 20,
    borderRadius: 20,
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2563EB",
  },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",

    borderColor: "#E5E7EB",
  },
  chipSelected: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  chipText: { fontSize: 13, color: "#4B5563" },
  chipTextSelected: { color: "white", fontWeight: "bold" },
  btnSave: {
    backgroundColor: "#2563EB",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btnSaveText: { color: "white", fontWeight: "bold", fontSize: 17 },
});
