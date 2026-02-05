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
  ScrollView,
} from "react-native";
import { productionsAPI, doctorsAPI, hospitalsAPI } from "../../services/api";
import {
  Production,
  Doctor,
  Hospital,
  CreateProduction,
} from "../../types/api.types";
import {
  TrendingUp,
  Trash2,
  Plus,
  X,
  Check,
  Search,
  Filter,
} from "lucide-react-native";

export default function ProductionsScreen() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados de Filtro e Pesquisa
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    start_date: "", // DD/MM/AAAA
    end_date: "",
  });

  // Modal de Cadastro
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<CreateProduction>({
    doctor: "",
    hospital: "",
    amount: 0,
    production_date: new Date().toISOString().split("T")[0],
  });

  // --- LÓGICA DE DATAS E MÁSCARAS ---
  const applyDateMask = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1");
  };

  const toApiFormat = (dateStr: string) => {
    if (dateStr.length !== 10) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  // Carrega a lista principal de produções
  const loadProductions = async () => {
    setLoading(true);
    try {
      const apiFilters = {
        start_date: toApiFormat(filters.start_date),
        end_date: toApiFormat(filters.end_date),
      };
      const data = await productionsAPI.getAll(apiFilters);
      setProductions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Busca médicos e hospitais apenas para carregar nomes e preencher o form
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

  // Abre o modal buscando dados frescos da API
  const handleOpenModal = async () => {
    setLoading(true); // Feedback visual enquanto carrega seletores
    await loadSelectionData();
    setFormData({
      doctor: "",
      hospital: "",
      amount: 0,
      production_date: new Date().toISOString().split("T")[0],
    });
    setLoading(false);
    setModalVisible(true);
  };

  useEffect(() => {
    loadSelectionData(); // Carrega uma vez para os nomes aparecerem na lista
  }, []);

  useEffect(() => {
    const sLen = filters.start_date.length;
    const eLen = filters.end_date.length;
    if ((sLen === 0 || sLen === 10) && (eLen === 0 || eLen === 10)) {
      loadProductions();
    }
  }, [filters.start_date, filters.end_date]);

  const handleSave = async () => {
    if (!formData.doctor || !formData.hospital || formData.amount <= 0) {
      Alert.alert("Atenção", "Selecione o médico, hospital e informe o valor.");
      return;
    }
    try {
      await productionsAPI.create(formData);
      setModalVisible(false);
      loadProductions();
      Alert.alert("Sucesso", "Produção lançada!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar lançamento.");
    }
  };

  const filteredList = productions.filter((p) => {
    const doc =
      doctors.find((d) => d.id === p.doctor)?.name.toLowerCase() || "";
    const hosp =
      hospitals.find((h) => h.id === p.hospital)?.name.toLowerCase() || "";
    return (
      doc.includes(searchQuery.toLowerCase()) ||
      hosp.includes(searchQuery.toLowerCase())
    );
  });

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <View style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Produções</Text>
          <Text style={styles.subtitle}>Gestão de Lançamentos</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleOpenModal}>
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* BUSCA E FILTRO */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Search size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Filtrar por nome..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, showFilters && styles.filterBtnActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? "white" : "#4B5563"} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>Filtrar Período (DD/MM/AAAA)</Text>
          <View style={styles.dateInputs}>
            <TextInput
              placeholder="Início"
              keyboardType="numeric"
              maxLength={10}
              style={styles.inputDate}
              value={filters.start_date}
              onChangeText={(t) =>
                setFilters({ ...filters, start_date: applyDateMask(t) })
              }
            />
            <TextInput
              placeholder="Fim"
              keyboardType="numeric"
              maxLength={10}
              style={styles.inputDate}
              value={filters.end_date}
              onChangeText={(t) =>
                setFilters({ ...filters, end_date: applyDateMask(t) })
              }
            />
          </View>
          <TouchableOpacity
            onPress={() => setFilters({ start_date: "", end_date: "" })}
            style={styles.resetBtn}
          >
            <Text style={styles.resetText}>Limpar Datas</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* LISTAGEM */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadProductions} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <TrendingUp size={20} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardAmount}>
                {formatCurrency(item.amount)}
              </Text>
              <Text style={styles.cardDoctor}>
                {doctors.find((d) => d.id === item.doctor)?.name || "..."}
              </Text>
              <Text style={styles.cardHospital}>
                {hospitals.find((h) => h.id === item.hospital)?.name || "..."}
              </Text>
            </View>
            <View style={styles.cardDate}>
              <Text style={styles.dateText}>
                {item.production_date.split("-").reverse().join("/")}
              </Text>
            </View>
          </View>
        )}
      />

      {/* MODAL DE CADASTRO */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior="padding" style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Lançamento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={26} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.form}>
                <Text style={styles.label}>Valor (R$)</Text>
                <TextInput
                  placeholder="0,00"
                  keyboardType="numeric"
                  style={styles.inputAmount}
                  onChangeText={(v) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(v.replace(",", ".")) || 0,
                    })
                  }
                />

                <Text style={styles.label}>Médico</Text>
                <View style={styles.chipGrid}>
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

                <Text style={styles.label}>Hospital</Text>
                <View style={styles.chipGrid}>
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
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Check size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}>Salvar Produção</Text>
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
    backgroundColor: "#059669",
    padding: 12,
    borderRadius: 16,
    elevation: 4,
  },

  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 25,
    gap: 10,
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 15,
    borderColor: "#E5E7EB",
    height: 50,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  filterBtn: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 15,

    borderColor: "#E5E7EB",
    justifyContent: "center",
  },
  filterBtnActive: { backgroundColor: "#059669", borderColor: "#059669" },

  filterPanel: {
    backgroundColor: "white",
    marginHorizontal: 25,
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: 12,
  },
  dateInputs: { flexDirection: "row", gap: 12 },
  inputDate: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 12,
    fontSize: 13,
    textAlign: "center",
  },
  resetBtn: { marginTop: 15, alignItems: "center" },
  resetText: { color: "#EF4444", fontWeight: "bold", fontSize: 13 },

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
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 16,
    marginRight: 15,
  },
  cardAmount: { fontSize: 18, fontWeight: "bold", color: "#065F46" },
  cardDoctor: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    marginTop: 2,
  },
  cardHospital: { fontSize: 12, color: "#6B7280" },
  cardDate: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  dateText: { fontSize: 11, fontWeight: "bold", color: "#4B5563" },

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
  form: { gap: 20, paddingBottom: 20 },
  label: { fontSize: 14, fontWeight: "bold", color: "#374151" },
  inputAmount: {
    backgroundColor: "#F3F4F6",
    padding: 18,
    borderRadius: 18,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#059669",
  },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",

    borderColor: "#E5E7EB",
  },
  chipSelected: { backgroundColor: "#059669", borderColor: "#059669" },
  chipText: { fontSize: 13, color: "#4B5563" },
  chipTextSelected: { color: "white", fontWeight: "bold" },
  saveBtn: {
    backgroundColor: "#059669",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: { color: "white", fontWeight: "bold", fontSize: 17 },
});
