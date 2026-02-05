import { Tabs } from "expo-router";
import {
  DollarSign,
  File,
  Hospital,
  LayoutDashboard,
  ReplyIcon,
  Users,
} from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#2563eb" }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <LayoutDashboard size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="doctors"
        options={{
          title: "Médicos",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="hospitals"
        options={{
          title: "Hospitais",
          tabBarIcon: ({ color }) => <Hospital size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="productions"
        options={{
          title: "Produções",
          tabBarIcon: ({ color }) => <File size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transfers"
        options={{
          title: "Repasses",
          tabBarIcon: ({ color }) => <DollarSign size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
