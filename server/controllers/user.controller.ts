// API Route to Save Form Data
app.post("/submit", async (req, res) => {
  try {
    const newEntry = new Interview(req.body);
    await newEntry.save();
    res.status(201).json({ message: "Form submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit form" });
  }
});