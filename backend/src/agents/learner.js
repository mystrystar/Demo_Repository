// How deep the clarifying questions should go for each self-reported level.
export const LEVELS = {
  beginner: "Little or no experience. Check the fundamentals and prerequisites first.",
  intermediate: "Knows the fundamentals. Skip basic definitions; ask about applied practice and weak spots.",
  expert: "Strong command of the field. Never ask about basics; ask about specialisation, depth, and goals.",
};

// How the wording should be pitched for each age group.
export const AGE_GROUPS = {
  kid: "Age 8-12. Very simple words, short sentences, school-level examples.",
  teen: "Age 13-17. Plain words, school or exam context.",
  student: "Age 18-24. College or early career context.",
  adult: "Age 25+. Work and career context.",
};

export const describeLearner = (level, ageGroup) =>
  `Level: ${level} (${LEVELS[level]})\nAge group: ${ageGroup} (${AGE_GROUPS[ageGroup]})`;
