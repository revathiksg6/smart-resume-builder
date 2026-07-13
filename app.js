const { useState } = React;

function App() {
  const [resumeData, setResumeData] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    education: "",
    skills: "",
    experience: "",
  });

  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleChange = (e) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  const getAISuggestions = async () => {
    setLoading(true);
    setAiSuggestion("");
    try {
      const response = await fetch("http://localhost:5000/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });
      const data = await response.json();
      setAiSuggestion(data.suggestion || "No suggestions available.");
    } catch (err) {
      setAiSuggestion("Error fetching AI suggestions. Please try again.");
    }
    setLoading(false);
  };

  const downloadPDF = () => {
    const element = document.getElementById("resume-preview");
    const opt = {
      margin: 0.5,
      filename: `${resumeData.name || "resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-600">
          Smart Resume Builder
        </h1>
        <p className="text-gray-500 mt-2">
          Build your resume and get AI-powered suggestions instantly
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {/* FORM SECTION */}
        <div className="bg-white rounded-2xl shadow-lg p-6 resume-card no-print">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Your Details
          </h2>

          <div className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={resumeData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={resumeData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={resumeData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <textarea
              name="summary"
              placeholder="Professional Summary"
              value={resumeData.summary}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            ></textarea>
            <textarea
              name="education"
              placeholder="Education (e.g. B.E CSE - 2026)"
              value={resumeData.education}
              onChange={handleChange}
              rows="2"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            ></textarea>
            <textarea
              name="skills"
              placeholder="Skills (comma separated)"
              value={resumeData.skills}
              onChange={handleChange}
              rows="2"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            ></textarea>
            <textarea
              name="experience"
              placeholder="Experience / Internships"
              value={resumeData.experience}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            ></textarea>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={getAISuggestions}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              {loading ? <span className="loader"></span> : "Get AI Suggestions"}
            </button>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
            >
              {previewMode ? "Edit Mode" : "Preview Mode"}
            </button>
          </div>

          {/* AI Suggestion Box */}
          {aiSuggestion && (
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg fade-in">
              <h3 className="font-semibold text-indigo-700 mb-1">
                AI Suggestion:
              </h3>
              <p className="text-gray-700 text-sm whitespace-pre-line">
                {aiSuggestion}
              </p>
            </div>
          )}
        </div>

        {/* PREVIEW SECTION */}
        <div
          id="resume-preview"
          className="bg-white rounded-2xl shadow-lg p-6 resume-preview resume-card"
        >
          <h2 className="text-2xl font-bold text-gray-800">
            {resumeData.name || "Your Name"}
          </h2>
          <p className="text-sm text-gray-500">
            {resumeData.email || "your.email@example.com"} |{" "}
            {resumeData.phone || "Phone Number"}
          </p>

          <div className="section-divider"></div>

          <div className="mb-3">
            <h3 className="font-semibold text-indigo-600">Summary</h3>
            <p className="text-gray-700 text-sm">
              {resumeData.summary || "Your professional summary will appear here."}
            </p>
          </div>

          <div className="mb-3">
            <h3 className="font-semibold text-indigo-600">Education</h3>
            <p className="text-gray-700 text-sm whitespace-pre-line">
              {resumeData.education || "Your education details will appear here."}
            </p>
          </div>

          <div className="mb-3">
            <h3 className="font-semibold text-indigo-600">Skills</h3>
            <p className="text-gray-700 text-sm">
              {resumeData.skills || "Your skills will appear here."}
            </p>
          </div>

          <div className="mb-3">
            <h3 className="font-semibold text-indigo-600">Experience</h3>
            <p className="text-gray-700 text-sm whitespace-pre-line">
              {resumeData.experience || "Your experience will appear here."}
            </p>
          </div>

          <button
            onClick={downloadPDF}
            className="no-print mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
