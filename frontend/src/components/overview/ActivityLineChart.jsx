import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const ActivityLineChart = ({ data }) => {
	// Transform the incoming data object into an array suitable for the chart
	const chartData = Object.keys(data).map((key) => ({
		activity: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize activity names
		count: data[key],
	}));

	return (
		<div className='bg-white p-6 rounded shadow-md'>
			<h2 className='text-lg font-bold text-black mb-4'>Activity Overview</h2>
			<ResponsiveContainer width='100%' height={300}>
				<LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="activity" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line type="monotone" dataKey="count" name="Activity Count" stroke="#6366F1" />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default ActivityLineChart;
