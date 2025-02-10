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
      <Button onClick={sessionHandler}>Start session</Button>
      <div>
        <CodeEditor/>
      </div>
    </div>
  )
}

export default DashboardPage