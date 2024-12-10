import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#6366F1", "#EC4899"];

const RoleDistributionChart = ({ data }) => {
	return (
		<div className='bg-white p-6 rounded shadow-md'>
			<h2 className='text-lg font-bold text-black mb-4'>Role Distribution</h2>
			<ResponsiveContainer width='100%' height={300}>
				<PieChart>
					<Pie
						data={data}
						dataKey='count'
						nameKey='role'
						cx='50%'
						cy='50%'
						innerRadius={50}
						outerRadius={100}
						fill='#8884d8'
						label
					>
						{data.length > 0 && data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
						))}
					</Pie>
					<Tooltip />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};

export default RoleDistributionChart;
