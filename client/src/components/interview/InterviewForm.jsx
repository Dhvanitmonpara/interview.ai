import { useState } from "react";
import { motion } from "framer-motion";

const InterviewForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    linkedin: "",
    higherEducation: "",
    ugDegree: "",
    college: "",
    jobRole: "",
    company: "",
    experience: "",
    achievements: "",
    skills: "",
    projects: "",
    preferredRole: "",
    goals: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // You can send data to your backend API here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6"
    >
      <h2 className="text-2xl font-semibold text-center mb-4">Interview AI Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </motion.div>

        {/* Phone */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </motion.div>

        {/* LinkedIn */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block font-medium">LinkedIn Profile</label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn profile URL"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* Higher Education */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block font-medium">Higher Education</label>
          <input
            type="text"
            name="higherEducation"
            value={formData.higherEducation}
            onChange={handleChange}
            placeholder="e.g. Master's Degree"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* UG Degree */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block font-medium">UG Degree</label>
          <input
            type="text"
            name="ugDegree"
            value={formData.ugDegree}
            onChange={handleChange}
            placeholder="e.g. BCA, B.Tech"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* College Name */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block font-medium">College Name</label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="Enter your college name"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* Job Role (if any) */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block font-medium">Job Role (if any)</label>
          <input
            type="text"
            name="jobRole"
            value={formData.jobRole}
            onChange={handleChange}
            placeholder="e.g. Software Developer"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* Company Name */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block font-medium">Company Name</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Enter company name (if applicable)"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* Years of Experience */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block font-medium">Years of Experience</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Years of work experience"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* Achievements */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block font-medium">Achievements</label>
          <textarea
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            placeholder="List your key achievements"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* Skills */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block font-medium">Skills</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Python, Java"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* Project GitHub Links */}
        <motion.div whileFocus={{ scale: 1.02 }}>
          <label className="block font-medium">Project GitHub Links</label>
          <input
            type="url"
            name="projects"
            value={formData.projects}
            onChange={handleChange}
            placeholder="GitHub repository URL"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Submit
        </motion.button>
      </form>
    </motion.div>
  );
};

export default InterviewForm;
