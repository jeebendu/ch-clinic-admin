import { fetchAllSpecializations, fetchLanguageList } from "@/admin/services/SpecializationService";

// Common function to fetch specializations
export const fetchSpecializations = async () => {
  try {
    const response = await fetchAllSpecializations();
    return response.data;
  } catch (error) {
    console.error("Failed to fetch specializations:", error);
    return [];
  }
};

// Common function to fetch languages
export const fetchLanguages = async () => {
  try {
    const response = await fetchLanguageList();
    return response.data;
  } catch (error) {
    console.error("Failed to fetch languages:", error);
    return [];
  }
};

// Helper function to parse query text and extract relevant filters
export const parseQueryAndApplyFilters = (
  query: string, 
  specializations: { id: number; name: string }[], 
  languages: { id: number; name: string }[], 
  genders: { key: string; value: string }[],
  experienceRanges: { key: string; value: string }[],
  toggleSpecialty: (specialty: string) => void,
  toggleGender: (gender: string) => void,
  toggleLanguage: (language: string) => void,
  toggleExperience: (experience: string) => void,
) => {
  const lowerCaseQuery = query.toLowerCase();

  // Extract gender dynamically
  genders.forEach((gender) => {
    if (lowerCaseQuery.includes(gender.value.toLowerCase())) {
      toggleGender(gender.key);
    }
  });

  // Extract experience dynamically
  experienceRanges.forEach((range) => {
    // Match numeric values in the query (e.g., "2" in "two year experience")
    const match = lowerCaseQuery.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten)/i);

    if (match) {
      // Convert the matched value to a number (handle both numeric and word-based numbers)
      const queryExperience = isNaN(Number(match[0]))
        ? convertWordToNumber(match[0].toLowerCase())
        : parseInt(match[0], 10);

      // Parse the range (e.g., "1-5" -> min = 1, max = 5)
      const [min, max] = range.value.split("-").map((val) => parseInt(val.trim(), 10));

      // Check if the extracted experience falls within the range
      if (queryExperience >= min && queryExperience <= max) {
        toggleExperience(range.key);
      }
    } else if (lowerCaseQuery.includes(range.value.toLowerCase())) {
      // Fallback to the original logic if no numeric value is found
      toggleExperience(range.key);
    }
  });

  // Helper function to convert word-based numbers to numeric values
  const convertWordToNumber = (word: string): number => {
    const wordToNumberMap: { [key: string]: number } = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
    };
    return wordToNumberMap[word] || 0; // Default to 0 if the word is not in the map
  };

  // Extract specialty dynamically
  specializations.forEach((specialty) => {
    if (lowerCaseQuery.includes(specialty.name.toLowerCase())) {
      toggleSpecialty(specialty.name);
    }
  });

  // Extract language dynamically
  languages.forEach((language) => {
    if (lowerCaseQuery.includes(language.name.toLowerCase())) {
      toggleLanguage(language.name);
    }
  });
};
