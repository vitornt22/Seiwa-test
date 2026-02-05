import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { doctorsAPI, hospitalsAPI, storage } from "../../services/api";
import {
  TrendingUp,
  DollarSign,
  Wallet,
  LogOut,
  ChevronDown,
  User,
  Building2,
  Search,
  X,
  Check,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { FinancialSummary, Doctor, Hospital } from "../../types/api.types";

export default function Dashboard() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  // Estados de Seleção
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null,
  );

  // Controle de Modais
  const [docModalVisible, setDocModalVisible] = useState(false);
  const [hospModalVisible, setHospModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [docs, hosps] = await Promise.all([
        doctorsAPI.getAll(),
        hospitalsAPI.getAll(),
      ]);
      setDoctors(docs);
      setHospitals(hosps);

      if (docs.length > 0 && !selectedDoctor) {
        setSelectedDoctor(docs[0]);
      }
    } catch (e) {
      console.log("Erro ao carregar bases:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    if (!selectedDoctor) return;
    setLoading(true);
    try {
      // Filtramos na API pelo médico e, se houver, pelo hospital
      const data = await doctorsAPI.getFinancialSummary(
        selectedDoctor.id,
        undefined,
        undefined,
      );
      setSummary(data);
    } catch (e) {
      console.log("Erro ao carregar sumário:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);
  useEffect(() => {
    loadSummary();
  }, [selectedDoctor, selectedHospital]);

  const handleLogout = async () => {
    try {
      // Remove os tokens
      await storage.deleteItem("access_token");
      await storage.deleteItem("refresh_token");

      // Volta para o login e limpa o histórico
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadInitialData} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Bem-vindo ao</Text>
            <Text style={styles.mainTitle}>Seiwa Financeiro</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <LogOut size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* ÁREA DE FILTROS ESTILO SELECT */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filtros Ativos</Text>

          <TouchableOpacity
            style={styles.selectBtn}
            onPress={() => setDocModalVisible(true)}
          >
            <View style={styles.selectInfo}>
              <User size={18} color="#2563EB" />
              <Text style={styles.selectText}>
                {selectedDoctor?.name || "Selecionar Médico"}
              </Text>
            </View>
            <ChevronDown size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectBtn}
            onPress={() => setHospModalVisible(true)}
          >
            <View style={styles.selectInfo}>
              <Building2 size={18} color="#059669" />
              <Text style={styles.selectText}>
                {selectedHospital?.name || "Todos os Hospitais"}
              </Text>
            </View>
            <ChevronDown size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* CARDS DE RESULTADO */}
        <View style={styles.summaryList}>
          <SummaryCard
            title="Produção"
            value={summary?.total_produced || 0}
            color="#2563EB"
            icon={TrendingUp}
            bgColor="#EFF6FF"
          />
          <SummaryCard
            title="Repassado"
            value={summary?.total_transferred || 0}
            color="#059669"
            icon={DollarSign}
            bgColor="#ECFDF5"
          />
          <SummaryCard
            title="Saldo"
            value={summary?.balance || 0}
            color="#EA580C"
            icon={Wallet}
            bgColor="#FFF7ED"
          />
        </View>
      </ScrollView>

      {/* MODAL SELECT MÉDICOS */}
      <SelectionModal
        visible={docModalVisible}
        onClose={() => setDocModalVisible(false)}
        data={doctors}
        onSelect={(item: Doctor) => {
          setSelectedDoctor(item);
          setDocModalVisible(false);
        }}
        selectedId={selectedDoctor?.id}
        title="Selecionar Médico"
      />

      {/* MODAL SELECT HOSPITAIS */}
      <SelectionModal
        visible={hospModalVisible}
        onClose={() => setHospModalVisible(false)}
        data={hospitals}
        onSelect={(item: Hospital) => {
          setSelectedHospital(item);
          setHospModalVisible(false);
        }}
        selectedId={selectedHospital?.id}
        title="Selecionar Hospital"
        allowClear
      />
    </View>
  );
}

// COMPONENTE DE MODAL DE SELEÇÃO REUTILIZÁVEL
function SelectionModal({
  visible,
  onClose,
  data,
  onSelect,
  selectedId,
  title,
  allowClear,
}: any) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              allowClear && (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => onSelect(null)}
                >
                  <Text style={styles.listItemText}>Todos os registros</Text>
                  {!selectedId && <Check size={18} color="#2563EB" />}
                </TouchableOpacity>
              )
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => onSelect(item)}
              >
                <Text
                  style={[
                    styles.listItemText,
                    selectedId === item.id && styles.selectedText,
                  ]}
                >
                  {item.name}
                </Text>
                {selectedId === item.id && <Check size={18} color="#2563EB" />}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

function SummaryCard({ title, value, color, icon: Icon, bgColor }: any) {
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
        <Icon size={24} color={color} />
      </View>
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{formatted}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    paddingTop: 50,
  },
  welcomeText: { color: "#6B7280", fontSize: 14 },
  mainTitle: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  logoutBtn: { padding: 10, backgroundColor: "#FEE2E2", borderRadius: 50 },

  filterSection: { paddingHorizontal: 24, gap: 10, marginBottom: 20 },
  filterLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  selectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  selectText: { fontSize: 15, color: "#1F2937", fontWeight: "500" },

  summaryList: { paddingHorizontal: 24, gap: 12 },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  iconBox: { padding: 16, borderRadius: 18, marginRight: 20 },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#9CA3AF",
    textTransform: "uppercase",
  },
  cardValue: { fontSize: 24, fontWeight: "bold", color: "#111827" },

  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: "70%",
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  listItemText: { fontSize: 16, color: "#4B5563" },
  selectedText: { color: "#2563EB", fontWeight: "bold" },
});
