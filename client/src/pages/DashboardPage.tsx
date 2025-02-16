import Container from "@/components/general/Container";
import DataVisualization from "@/components/general/DataVisualization";
import SelectRoles from "@/components/general/SelectRoles";
import StreakTracker from "@/components/general/StreakTracker";
import SessionInfoForm from "@/components/interview/SessionInfoForm";
import { Link } from "react-router-dom";
function DashboardPage() {
  return (
    <div className="h-full w-screen overflow-x-hidden space-y-6">
      <div className="w-1/2 mx-auto my-2 py-2 rounded-xl bg-blue-300 flex justify-center items-center">
        <p className="text-zinc-600"><Link to="/dashboard/form" className="text-zinc-900 font-semibold hover:underline">Visit form</Link> to get started</p>
      </div>
      <SessionInfoForm />
      <Container>
        <div>
          <SelectRoles />
        </div>
        <div className="mt-4 flex justify-between">
          <DataVisualization />
          <StreakTracker />
        </div>
      </Container>
    </div>
  );
}

export default DashboardPage;
