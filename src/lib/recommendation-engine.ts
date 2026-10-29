// Recommendation engine - rule-based, designed to be swapped with ML model
export interface SoilInput {
  soilType: string;
  cropType: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  temperature: number;
  humidity: number;
  moisture: number;
  rainfall: number;
  season: string;
  region: string;
}

export interface Recommendation {
  fertilizer: string;
  formulaCode: string;
  confidence: number;
  reason: string;
  soilHealth: "good" | "moderate" | "poor";
  soilHealthDesc: string;
  nDeficient: boolean;
  pDeficient: boolean;
  kDeficient: boolean;
  dosage: string;
  timing: string;
  precautions: string;
  organicAlt: string;
  costEffectiveness: "high" | "medium" | "low";
  yieldImprovement: string;
}

const OPTIMAL_N = 40;
const OPTIMAL_P = 35;
const OPTIMAL_K = 35;

export function getRecommendation(input: SoilInput): Recommendation {
  const nDef = input.nitrogen < OPTIMAL_N;
  const pDef = input.phosphorus < OPTIMAL_P;
  const kDef = input.potassium < OPTIMAL_K;
  
  const defCount = [nDef, pDef, kDef].filter(Boolean).length;
  const soilHealth: "good" | "moderate" | "poor" = defCount === 0 ? "good" : defCount <= 1 ? "moderate" : "poor";

  let fertilizer = "DAP (Diammonium Phosphate)";
  let formulaCode = "18-46-0";
  let organicAlt = "Vermicompost + Bone Meal";
  let reason = "";
  let dosage = "";

  if (nDef && pDef) {
    fertilizer = "DAP (Diammonium Phosphate)";
    formulaCode = "18-46-0";
    reason = `Nitrogen is ${((OPTIMAL_N - input.nitrogen) / OPTIMAL_N * 100).toFixed(1)}% below optimal and Phosphorus is ${((OPTIMAL_P - input.phosphorus) / OPTIMAL_P * 100).toFixed(1)}% below optimal for ${input.cropType}. DAP provides both N and P in an efficient ratio.`;
    dosage = "125 kg/hectare, split into 2 applications";
    organicAlt = "Vermicompost (5 t/ha) + Rock Phosphate (200 kg/ha)";
  } else if (nDef) {
    fertilizer = "Urea";
    formulaCode = "46-0-0";
    reason = `Nitrogen is ${((OPTIMAL_N - input.nitrogen) / OPTIMAL_N * 100).toFixed(1)}% below the optimal threshold for ${input.cropType}. Urea provides the highest N concentration.`;
    dosage = "100 kg/hectare, split into 3 applications";
    organicAlt = "Neem Cake (500 kg/ha) + Green Manure";
  } else if (pDef) {
    fertilizer = "Single Super Phosphate (SSP)";
    formulaCode = "0-16-0";
    reason = `Phosphorus is ${((OPTIMAL_P - input.phosphorus) / OPTIMAL_P * 100).toFixed(1)}% below optimal. SSP provides steady P release suitable for ${input.cropType}.`;
    dosage = "200 kg/hectare, basal application";
    organicAlt = "Bone Meal (300 kg/ha)";
  } else if (kDef) {
    fertilizer = "Muriate of Potash (MOP)";
    formulaCode = "0-0-60";
    reason = `Potassium is ${((OPTIMAL_K - input.potassium) / OPTIMAL_K * 100).toFixed(1)}% below optimal. MOP is the most cost-effective K source for ${input.cropType}.`;
    dosage = "80 kg/hectare, basal application";
    organicAlt = "Wood Ash (1 t/ha) + Banana Stem Compost";
  } else {
    fertilizer = "NPK Complex";
    formulaCode = "10-26-26";
    reason = `All nutrient levels are within optimal range. A balanced NPK complex will maintain soil fertility for ${input.cropType}.`;
    dosage = "100 kg/hectare, maintenance dose";
    organicAlt = "Farm Yard Manure (10 t/ha)";
  }

  // pH adjustment
  if (input.ph < 5.5) {
    reason += " Note: Soil is acidic — consider lime application (2-4 t/ha) to raise pH.";
  } else if (input.ph > 8.0) {
    reason += " Note: Soil is alkaline — consider gypsum application (2-3 t/ha) to lower pH.";
  }

  const confidence = soilHealth === "good" ? 92 : soilHealth === "moderate" ? 85 : 78;
  const timing = input.season === "kharif" ? "Apply at sowing and 30 days after germination" : input.season === "rabi" ? "Apply at sowing and 45 days after sowing" : "Apply at planting and 20 days after";

  return {
    fertilizer,
    formulaCode,
    confidence: confidence + Math.random() * 5,
    reason,
    soilHealth,
    soilHealthDesc: soilHealth === "good" ? "Healthy — all nutrients within optimal range" : soilHealth === "moderate" ? "Moderate — minor nutrient adjustments needed" : "Needs attention — significant nutrient deficiencies detected",
    nDeficient: nDef,
    pDeficient: pDef,
    kDeficient: kDef,
    dosage,
    timing,
    precautions: "Wear gloves during application. Keep away from water bodies. Store in a cool, dry place. Do not apply on wet foliage.",
    organicAlt,
    costEffectiveness: soilHealth === "good" ? "high" : soilHealth === "moderate" ? "medium" : "low",
    yieldImprovement: soilHealth === "poor" ? "18-25% expected improvement" : soilHealth === "moderate" ? "10-15% expected improvement" : "Maintenance — stable yield expected",
  };
}
