import CodeEditor from "@/components/general/CodeEditor"
import SpeechRecognition from "@/components/general/SpeechRecognition"
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
      <Button onClick={sessionHandler}>Start session</Button>
      <div className="p-4 rounded-md">
        <CodeEditor />
      </div>
      <div className="h-56 w-56 bg-gray-700">
        <SpeechRecognition />
      </div>
    </div>
  )
}

export default DashboardPage