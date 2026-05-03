const assert = require("node:assert/strict");
const test = require("node:test");

const {
  VERIFICATION_STATUS,
  calculateVerificationScore,
} = require("../src/lib/verificationScore");

const validInput = {
  enteredName: "김교사",
  enteredSchoolName: "서울고등학교",
  referenceDate: "2026-05-03T00:00:00.000Z",
  extractedFields: {
    name: "김교사",
    schoolName: "서울고등학교",
    employmentKeywordDetected: true,
    issuedAt: "2026-04-10",
    requiredFieldCount: 5,
    templateMatched: true,
    stampOrSignatureDetected: true,
    documentNumber: "2026-12345",
    ocrConfidence: 0.95,
  },
  fileSignals: {},
};

test("recommends automatic approval for a high-confidence certificate", () => {
  const result = calculateVerificationScore(validInput);

  assert.equal(result.score, 100);
  assert.equal(result.statusRecommendation, VERIFICATION_STATUS.autoApproved);
  assert.deepEqual(result.hardRuleResults, []);
});

test("keeps missing OCR identity data in manual review", () => {
  const result = calculateVerificationScore({
    ...validInput,
    extractedFields: {
      ...validInput.extractedFields,
      name: "",
    },
  });

  assert.equal(result.statusRecommendation, VERIFICATION_STATUS.pendingReview);
  assert.equal(result.hardRuleResults.includes("missing_name_or_school"), true);
});

test("rejects invalid or unsafe files immediately", () => {
  const result = calculateVerificationScore({
    ...validInput,
    fileSignals: {
      malwareOrInvalidFile: true,
    },
  });

  assert.equal(result.score, 0);
  assert.equal(result.statusRecommendation, VERIFICATION_STATUS.rejected);
  assert.deepEqual(result.hardRuleResults, ["malware_or_invalid_file"]);
});

test("applies mismatch and duplicate document penalties", () => {
  const result = calculateVerificationScore({
    ...validInput,
    enteredSchoolName: "부산고등학교",
    fileSignals: {
      duplicateApprovedDocument: true,
    },
  });

  assert.equal(result.score, 10);
  assert.equal(result.statusRecommendation, VERIFICATION_STATUS.rejected);
  assert.equal(
    result.negativeRules.some((rule) => rule.code === "school_mismatch"),
    true,
  );
  assert.equal(
    result.negativeRules.some((rule) => rule.code === "duplicate_approved_document"),
    true,
  );
});
