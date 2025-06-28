// utils/generateReport.ts

type Report = {
  agent: string;
  user: string;
  timestamp: string;
  symptoms: string[];
  duration: string;
  severity: string;
  medications: string[];
  recommendations: string[];
  treatment: string;
  precautions: string[];
  diagnosis: string;
};

export function generateReport(selectedDoctor: any, notes: string, symptoms: string[]) {
  const doctor = selectedDoctor?.specialist?.toLowerCase();
  const report: Report = {
    agent: selectedDoctor?.specialist || "General Physician",
    user: "Anonymous",
    timestamp: new Date().toISOString(),
    symptoms,
    duration: "2-3 days",
    severity: "Moderate",
    medications: [],
    recommendations: [],
    treatment: "",
    precautions: [],
    diagnosis: "",
  };

  switch (doctor) {
    case "general physician":
      report.diagnosis = "Common viral infection";
      report.medications = ["Paracetamol", "Vitamin C"];
      report.treatment = "Hydration, rest, over-the-counter medication";
      report.recommendations = ["Drink warm fluids", "Monitor temperature"];
      report.precautions = ["Avoid crowded places"];
      break;

    case "cardiologist":
      report.diagnosis = "Mild hypertension";
      report.medications = ["Amlodipine"];
      report.treatment = "Lifestyle changes & low-dose antihypertensive";
      report.recommendations = ["Reduce salt intake", "Exercise regularly"];
      report.precautions = ["Monitor BP weekly", "Avoid stress"];
      break;

    case "dermatologist":
      report.diagnosis = "Mild acne vulgaris";
      report.medications = ["Topical benzoyl peroxide", "Clindamycin gel"];
      report.treatment = "Daily gentle cleansing & spot treatment";
      report.recommendations = ["Avoid oily foods", "Use non-comedogenic products"];
      report.precautions = ["Do not pick or squeeze pimples"];
      break;

    case "psychiatrist":
      report.diagnosis = "Generalized anxiety disorder";
      report.medications = ["Low-dose SSRIs"];
      report.treatment = "Counseling & short-term medication";
      report.recommendations = ["Practice mindfulness", "Stay socially connected"];
      report.precautions = ["Avoid alcohol & drugs"];
      break;

    case "pediatrician":
      report.diagnosis = "Viral fever in child";
      report.medications = ["Paracetamol syrup"];
      report.treatment = "Hydration & monitoring";
      report.recommendations = ["Light food", "Keep child cool"];
      report.precautions = ["Visit if fever persists beyond 3 days"];
      break;

    case "orthopedic surgeon":
      report.diagnosis = "Knee ligament strain";
      report.medications = ["Ibuprofen"];
      report.treatment = "Rest, ice, compression & elevation";
      report.recommendations = ["Avoid strenuous activity"];
      report.precautions = ["Wear knee brace if advised"];
      break;

    case "ent specialist":
      report.diagnosis = "Acute sinusitis";
      report.medications = ["Nasal decongestant", "Steam inhalation"];
      report.treatment = "Symptomatic care";
      report.recommendations = ["Use saline nasal spray", "Stay hydrated"];
      report.precautions = ["Avoid cold drinks"];
      break;

    case "gynecologist":
      report.diagnosis = "Mild PCOS symptoms";
      report.medications = ["Hormonal regulator"];
      report.treatment = "Diet & lifestyle modification";
      report.recommendations = ["Exercise regularly", "Manage weight"];
      report.precautions = ["Regular ultrasound monitoring"];
      break;

    case "neurologist":
      report.diagnosis = "Migraine without aura";
      report.medications = ["Sumatriptan"];
      report.treatment = "Acute migraine management";
      report.recommendations = ["Avoid triggers like caffeine", "Maintain sleep hygiene"];
      report.precautions = ["Seek help if worsening"];
      break;

    case "gastroenterologist":
      report.diagnosis = "Mild gastritis";
      report.medications = ["Antacid", "Proton pump inhibitor"];
      report.treatment = "Dietary adjustments & medication";
      report.recommendations = ["Eat small frequent meals", "Avoid spicy food"];
      report.precautions = ["No smoking/alcohol"];
      break;

    default:
      report.diagnosis = "General viral illness";
      report.medications = ["Paracetamol"];
      report.treatment = "Rest & hydration";
      report.recommendations = ["Stay home & rest"];
      report.precautions = ["Monitor for worsening symptoms"];
      break;
  }

  return report;
}
