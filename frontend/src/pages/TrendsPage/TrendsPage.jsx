import { useState, useEffect } from "react";
import Header from "../MainPage/components/Header/Header";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./TrendsPage.css";
import TimeRangeSelect from "../../components/TimeRangeSelect/TimeRangeSelect";

const COLORS = [
  "#0d47a1",
  "#1565c0",
  "#1976d2",
  "#1e88e5",
  "#2196f3",
  "#42a5f5",
];

export default function TrendsPage() {
  const [rentalsData, setRentalsData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);
  const [timeRangeShare, setTimeRangeShare] = useState(7);

  const timeRangeOptions = [
    { value: 7, label: "Ostatni tydzień" },
    { value: 30, label: "Ostatni miesiąc" },
    { value: 90, label: "Ostatni kwartał" },
    { value: 365, label: "Ostatni rok" },
  ];

  const fetchRentalsData = async (days) => {
    try {
      const rentalsResponse = await fetch(
        `http://localhost:8000/api/trends/rentals?days=${days}`
      );
      const rentalsJson = await rentalsResponse.json();
      setRentalsData(rentalsJson);
    } catch (error) {
      console.error("Error fetching rentals data:", error);
    }
  };

  const fetchEquipmentData = async (days) => {
    try {
      const equipmentResponse = await fetch(
        `http://localhost:8000/api/trends/equipment?days=${days}`
      );
      const equipmentJson = await equipmentResponse.json();
      setEquipmentData(equipmentJson);
    } catch (error) {
      console.error("Error fetching equipment data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchRentalsData(timeRange);
        await fetchEquipmentData(timeRangeShare);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trends data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, timeRangeShare]);

  const handleSearch = () => {
    // zeby sie warning nie pojawial
  };

  if (loading) {
    return <div className="trends-loading">Ładowanie danych...</div>;
  }

  return (
    <div className="trends-page">
      <Header onSearch={handleSearch} />
      <div className="trends-container">
        <h1>Statystyki wypożyczeń</h1>

        <div className="chart-section">
          <div className="chart-header">
            <h2>Wypożyczenia w czasie</h2>
            <TimeRangeSelect
              value={timeRange}
              onChange={(value) => setTimeRange(value)}
              options={timeRangeOptions}
            />
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={rentalsData.timeline}>
              <CartesianGrid strokeDasharray="2 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 14 }}
              />
              <YAxis
                label={{
                  value: "Liczba wypożyczeń",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="rentals"
                name="Wypożyczenia"
                stroke="#1976D2"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <div className="chart-header">
            <h2>Udział w wypożyczeniach</h2>
            <TimeRangeSelect
              value={timeRangeShare}
              onChange={(value) => setTimeRangeShare(value)}
              options={timeRangeOptions}
            />
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={equipmentData.share}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, value }) => `${name} (${value}%)`}
              >
                {equipmentData.share.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === "Inne" ? COLORS[5] : COLORS[index % 5]}
                  />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value) => {
                  const item = equipmentData.share.find(
                    (i) => i.name === value
                  );
                  return `${value} (${item?.value}%)`;
                }}
              />
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h2>
            Stany magazynowe na dzień {" "}
            {new Intl.DateTimeFormat("pl-PL", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(Date.now()))}
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={equipmentData.stock_levels}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={false}
                height={20}
              />
              <YAxis
                label={{
                  value: "Liczba sztuk",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                  offset: 10,
                }}
              />
              <Tooltip />
              <Legend
                wrapperStyle={{
                  paddingLeft: 20,
                }}
              />
              <Bar
                dataKey="total"
                fill="#64b5f6"
                name="Całkowita ilość"
                label={{
                  position: "center",
                  content: ({ name }) => name,
                }}
                stackId="a"
              />
              <Bar
                dataKey="available"
                fill="#1976D2"
                name="Dostępne sztuki"
                label={{
                  position: "center",
                  content: ({ value }) => value,
                }}
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
