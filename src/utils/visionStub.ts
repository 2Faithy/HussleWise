export interface PhotoAnalysisResult {
  name: string;
  quantity: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
}

/**
 * ⚠️ INTEGRATION POINT
 * This function simulates a vision-AI product recognition call.
 * To go live, replace the body with a real call to a vision model
 * (e.g. GPT-4 Vision, Claude with image input, or Google Vision API)
 * through YOUR OWN backend — never call a vision API directly from
 * the frontend with an embedded API key.
 *
 *   const res = await fetch('/api/vision/analyze-product', {
 *     method: 'POST',
 *     body: formDataContainingImage,
 *   });
 *   return await res.json();
 */
export function simulatePhotoAnalysis(_file: File): Promise<PhotoAnalysisResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulated "best guess" — in reality this would come from the vision model
      resolve({
        name: 'New Product',
        quantity: 10,
        unit: 'units',
        costPrice: 0,
        sellingPrice: 0,
      });
    }, 1800);
  });
}