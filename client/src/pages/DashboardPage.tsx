import SessionInfoForm from "@/components/interview/SessionInfoForm";
import CodeEditor from "@/components/general/CodeEditor"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

function DashboardPage() {

  const navigate = useNavigate()

  const sessionHandler = () => {
    navigate(`/interview/${Date.now()}`)
  }

  return (
    <div className="h-full w-full">
      <p className="text-white dark:text-black">dashboard</p>
      <SessionInfoForm />
      <Button onClick={sessionHandler}>Start session</Button>
        <div className="p-4 rounded-md">
          <CodeEditor />
        </div>
    </div>
  )
}

export default DashboardPage