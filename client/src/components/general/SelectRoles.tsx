import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

interface FreeCourseCardProps {
    title: string;
    description: string;
}

const roles = [
    { title: "Frontend Developer", description: "A Frontend Developer should be proficient in HTML, CSS, and JavaScript, along with frameworks ." },
    { title: "Backend Developer", description: "A MERN Stack Developer must have expertise in MongoDB, Express.js, React, and Node.js, along with RESTful APIs," },
    { title: "MERN Stack Developer", description: "A Java Developer should be skilled in Java, Spring Boot, Hibernate, and database management using SQL" }
];

function SelectRoles() {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between flex-wrap">
            {roles.map((role, index) => (
                <Card   
                    key={index}
                    className="dark:bg-[#212121] dark:text-neutral-300 w-[310px] cursor-pointer"
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
            <Card
                className="dark:bg-[#212121] dark:text-neutral-300 w-72 flex items-center justify-center cursor-pointer"
                onClick={() => navigate("/bhai-roles page kaha hai")}
            >
                <CardContent className="flex items-center justify-center h-full">
                    <Plus size={32} className="text-neutral-300" />
                </CardContent>
            </Card>
        </div>
    );
}

export default SelectRoles;
