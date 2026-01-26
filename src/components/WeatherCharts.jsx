import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WeatherCharts = ({ data }) => {
  return (
    <div className="charts-container">
      <h3 className="charts-title">Weather Trends (Next Hours)</h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />

          <Line type="monotone" dataKey="temp" stroke="#ff7300" strokeWidth={2} />
          <Line type="monotone" dataKey="humidity" stroke="#00c6ff" strokeWidth={2} />
          <Line type="monotone" dataKey="wind" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherCharts;
