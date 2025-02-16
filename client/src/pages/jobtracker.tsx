import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

type Job = {
  id: string;
  title: string;
};

type JobColumns = {
  [key: string]: Job[];
};

const jobStages: string[] = ["Applied", "Interview", "Waiting", "Offer Received", "Rejected"];

// Load from localStorage or set default
const getSavedJobs = (): JobColumns => {
  const storedJobs = localStorage.getItem("jobTracker");
  return storedJobs ? JSON.parse(storedJobs) : {
    Applied: [{ id: "1", title: "Software Engineer @ OpenAI" }],
    Interview: [],
    Waiting: [],
    "Offer Received": [],
    Rejected: [],
  };
};

const JobTracker: React.FC = () => {
  const [jobs, setJobs] = useState<JobColumns>(getSavedJobs);
  const [newJobTitle, setNewJobTitle] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("Applied");

  // Save jobs to localStorage on every update
  useEffect(() => {
    localStorage.setItem("jobTracker", JSON.stringify(jobs));
  }, [jobs]);

  // Handle Dragging
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return; // Dropped outside

    const sourceColumn = Array.from(jobs[source.droppableId]); // Clone array
    const destColumn = Array.from(jobs[destination.droppableId]); // Clone array

    const [movedJob] = sourceColumn.splice(source.index, 1); // Remove from source
    destColumn.splice(destination.index, 0, movedJob); // Add to destination

    setJobs({
      ...jobs,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    });
  };

  // Add a new job
  const addJob = () => {
    if (!newJobTitle.trim()) return;
    const newJob: Job = { id: Date.now().toString(), title: newJobTitle };
    setJobs({ ...jobs, [selectedStage]: [...jobs[selectedStage], newJob] });
    setNewJobTitle("");
  };

  // Edit a job title
  const editJob = (stage: string, jobId: string, newTitle: string) => {
    const updatedJobs = jobs[stage].map((job) =>
      job.id === jobId ? { ...job, title: newTitle } : job
    );
    setJobs({ ...jobs, [stage]: updatedJobs });
  };

  // Delete a job
  const deleteJob = (stage: string, jobId: string) => {
    const updatedJobs = jobs[stage].filter((job) => job.id !== jobId);
    setJobs({ ...jobs, [stage]: updatedJobs });
  };

  return (
    <div className="p-4">
      {/* Job Input */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Job Title"
          value={newJobTitle}
          onChange={(e) => setNewJobTitle(e.target.value)}
          className="p-2 border rounded w-1/2"
        />
        <select value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)} className="p-2 border rounded">
          {jobStages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
        <button onClick={addJob} className="p-2 bg-blue-500 text-white rounded">Add Job</button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4">
          {jobStages.map((stage) => (
            <Droppable droppableId={stage} key={stage}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-1/5 p-4 border rounded min-h-[200px] bg-gray-50"
                >
                  <h2 className="font-bold">{stage}</h2>
                  {jobs[stage].map((job, index) => (
                    <Draggable key={job.id} draggableId={job.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 mt-2 bg-gray-200 rounded shadow flex justify-between items-center"
                        >
                          <input
                            type="text"
                            value={job.title}
                            onChange={(e) => editJob(stage, job.id, e.target.value)}
                            className="bg-transparent border-none w-full focus:outline-none"
                          />
                          <button onClick={() => deleteJob(stage, job.id)} className="ml-2 text-red-500">✖</button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default JobTracker;
