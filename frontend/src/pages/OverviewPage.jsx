import { UserCheck, UserMinus, UserPlus, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import RoleDistributionChart from "../components/overview/RoleDistributionChart";
import ActivityLineChart from "../components/overview/ActivityLineChart";

const OverviewPage = () => {
	const [recentActivityCounts, setRecentActivityCounts] = useState({
		added: 0,
		updated: 0,
		deleted: 0,
	});
	const [stats, setStats] = useState({
		totalMembers: 0,
		admins: 0,
		users: 0,
	});
	const [activityLogs, setActivityLogs] = useState([]);
	const [roleData, setRoleData] = useState([]);

	useEffect(() => {
		// Fetch dashboard data from the API
		const fetchData = async () => {
			try {
				const [membersRes, logsRes, rolesRes, countsRes] = await Promise.all([
					axios.get("/api/dashboard/stats"), // Endpoint for total members and counts by role
					axios.get("/api/dashboard/recent"), // Endpoint for recent activity logs
					axios.get("/api/dashboard/roles"), // Endpoint for role distribution
					axios.get("/api/dashboard/recent-activity-counts")
				]);

				// Update state with the fetched data
				setStats(membersRes.data);
				setActivityLogs(logsRes.data);
				setRoleData(rolesRes.data);
				setRecentActivityCounts(countsRes.data);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Dashboard' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Members' icon={UserCheck} value={stats.totalMembers} color='#6366F1' />
					<StatCard name="Added (24h)" icon={UserPlus} value={recentActivityCounts.added} color="#10B981" />
					<StatCard name="Updated (24h)" icon={UserMinus} value={recentActivityCounts.updated} color="#3B82F6" />
					<StatCard name="Deleted (24h)" icon={UserX} value={recentActivityCounts.deleted} color="#EF4444" />
				</motion.div>

				{/* RECENT ACTIVITY LOGS */}
				<div className="mb-8 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-lg p-6">
					<h2 className="text-xl font-bold mb-4 text-gray-100">Recent Activities</h2>
					<div className="overflow-x-auto">
						<table className="w-full table-auto border-collapse text-gray-300">
							<thead>
								<tr className="bg-gray-700 text-gray-100">
									<th className="border border-gray-600 px-4 py-2 text-left">Date</th>
									<th className="border border-gray-600 px-4 py-2 text-left">Action</th>
									<th className="border border-gray-600 px-4 py-2 text-left">Performed By</th>
								</tr>
							</thead>
							<tbody>
								{Array.isArray(activityLogs) && activityLogs.length > 0 ? (
									activityLogs.map((log, index) => (
										<tr
											key={index}
											className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-600`}
										>
											<td className="border border-gray-600 px-4 py-2">
												{new Date(log.timestamp).toLocaleString()}
											</td>
											<td className="border border-gray-600 px-4 py-2">{log.action}</td>
											<td className="border border-gray-600 px-4 py-2">{log.performedBy}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="3" className="border border-gray-600 px-4 py-2 text-center text-gray-400">
											No recent activities found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
				{/* CHARTS */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<RoleDistributionChart data={roleData} />
					<ActivityLineChart data={recentActivityCounts} />
				</div>
			</main>
		</div>
	);
};

export default OverviewPage;
