export const calculateProfileCompletion = (data) => {
  if (!data) return 0;

  const fields = [
    "firstName",
    "lastName",
    "phone",
    "email",
    "country",
    "state",
    "city",
    "gender"
  ];

  const completedFields = fields.filter((field) => {
    const value = data[field];
    const isComplete = value && value.toString().trim() !== "";
    return isComplete;
  });

  const percentage = Math.round((completedFields.length / fields.length) * 100);
  console.log("DEBUG calculateProfileCompletion:", {
    dataKeys: Object.keys(data),
    completedFields,
    percentage
  });

  return percentage;
};

export const isFieldIncomplete = (data, field) => {
  if (!data) return true;
  const value = data[field];
  const isIncomplete = !value || value.toString().trim() === "";
  return isIncomplete;
};
