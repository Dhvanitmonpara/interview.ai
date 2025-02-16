import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const roles = [
  {
    title: "Frontend Developer",
    description:
      "A Frontend Developer should be proficient in HTML, CSS, and JavaScript, along with frameworks.",
  },
  {
    title: "Backend Developer",
    description:
      "A MERN Stack Developer must have expertise in MongoDB, Express.js, React, and Node.js, along with RESTful APIs.",
  },
  {
    title: "MERN Stack Developer",
    description:
      "A Java Developer should be skilled in Java, Spring Boot, Hibernate, and database management using SQL.",
  },
];

function SelectRoles() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold my-4 mx-2 rounded-xl py-3 bg-blue-200 h-15 w-full text-center transition duration-300 hover:bg-blue-400 hover:text-white">
        Interview Option
      </h1>

      {/* Grid Layout: 2 Columns on Medium Screens & Above */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role, index) => (
          <Card
            key={index}
            className="dark:bg-[#212121] dark:text-neutral-300 w-[350px] cursor-pointer transition duration-300 hover:scale-105 hover:shadow-lg hover:bg-blue-100 dark:hover:bg-[#2a2a2a]"
            onClick={() => navigate("/interview")}
          >
            <CardHeader>
              <CardTitle className="text-sm font-medium">{role.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs">{role.description}</p>
            </CardContent>
          </Card>
        ))}
        
        {/* Add More Roles Card */}
        <Card
          className="dark:bg-[#212121] dark:text-neutral-300 w-[350px] flex items-center justify-center cursor-pointer transition duration-300 hover:scale-105 hover:shadow-lg hover:bg-blue-100 dark:hover:bg-[#2a2a2a]"
          onClick={() => navigate("/bhai-roles page kaha hai")}
        >
          <CardContent className="flex items-center justify-center h-full">
            <Plus size={32} className="text-neutral-300" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SelectRoles;
