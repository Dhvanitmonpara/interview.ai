<<<<<<< HEAD
import Container from "@/components/general/Container";
import DataVisualization from "@/components/general/DataVisualization";
import SelectRoles from "@/components/general/SelectRoles";
=======
import SpeechRecognition from "@/components/general/SpeechRecognition"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
>>>>>>> 1c9147b1c1430cde0c88428ad073ab1fde97994f

function DashboardPage() {
  return (
    <div className="h-full w-full p-6 space-y-6">
      <Container>
        <div>
          <SelectRoles />
        </div>
        <div className="mt-4">
          <DataVisualization />
        </div>
      </Container>
    </div>
  );
}

export default DashboardPage;
