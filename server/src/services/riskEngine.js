// Pure deterministic risk classification — NO AI, NO database calls.
// Same thresholds confirmed in the assignment's own CSV data.

export function classifyRisk(attendanceRate) {
  if (attendanceRate >= 0.75) return "On Track";
  if (attendanceRate >= 0.60) return "Behind";
  if (attendanceRate >= 0.35) return "At Risk";
  return "Critical";
}

// Used during CSV import (Phase 3) to compute the derived fields ourselves,
// instead of trusting the CSV's pre-baked columns — this proves our logic is correct.
export function computeSchoolMetrics(row) {
  const totalEnrollment =
    row.class6Enrollment + row.class7Enrollment + row.class8Enrollment;

  const totalAttendance =
    row.class6ScienceAttendance + row.class6MathAttendance +
    row.class7ScienceAttendance + row.class7MathAttendance +
    row.class8ScienceAttendance + row.class8MathAttendance;

  // denominator = enrollment counted once per session-type actually held per class
  // i.e. if a school taught both Science and Math in a class, that class's enrollment
  // is counted twice (once per session) to match attendance being two session-totals.
  const sessionDenominator =
    (row.class6ScienceAttendance > 0 || row.subject?.includes("Science") ? row.class6Enrollment : 0) +
    (row.class6MathAttendance > 0 || row.subject?.includes("Math") ? row.class6Enrollment : 0) +
    (row.class7ScienceAttendance > 0 || row.subject?.includes("Science") ? row.class7Enrollment : 0) +
    (row.class7MathAttendance > 0 || row.subject?.includes("Math") ? row.class7Enrollment : 0) +
    (row.class8ScienceAttendance > 0 || row.subject?.includes("Science") ? row.class8Enrollment : 0) +
    (row.class8MathAttendance > 0 || row.subject?.includes("Math") ? row.class8Enrollment : 0);

  const attendanceRate = sessionDenominator > 0
    ? Number((totalAttendance / sessionDenominator).toFixed(4))
    : 0;

  return {
    totalEnrollment,
    totalAttendance,
    attendanceRate,
    riskStatus: classifyRisk(attendanceRate),
  };
}