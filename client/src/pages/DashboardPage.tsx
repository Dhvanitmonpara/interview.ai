import Container from "@/components/general/Container";
import DataVisualization from "@/components/general/DataVisualization";
import SelectRoles from "@/components/general/SelectRoles";
import StreakTracker from "@/components/general/StreakTracker";
import SessionInfoForm from "@/components/interview/SessionInfoForm";
import Analysis from "./Analysis";
function DashboardPage() {
  return (
    <>
      <div className="h-full w-full p-6 space-y-6">
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
      <div>
        <Analysis />
      </div>
    </>
  );
}

export default DashboardPage;
