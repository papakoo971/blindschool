const SCORE_THRESHOLDS = {
  autoApprove: 85,
  pendingReview: 60,
};

const VERIFICATION_STATUS = {
  autoApproved: "auto_approved",
  pendingReview: "pending_review",
  rejected: "rejected",
};

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase();
}

function clampScore(score) {
  return Math.max(0, Math.min(100, score));
}

function daysSince(dateValue, referenceDate) {
  const issuedAt = new Date(dateValue);
  if (Number.isNaN(issuedAt.getTime())) {
    return null;
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((referenceDate.getTime() - issuedAt.getTime()) / msPerDay);
}

function addRule(rules, code, points) {
  rules.push({ code, points });
}

function calculateVerificationScore(input) {
  const extractedFields = input.extractedFields ?? {};
  const fileSignals = input.fileSignals ?? {};
  const referenceDate = input.referenceDate
    ? new Date(input.referenceDate)
    : new Date();

  const positiveRules = [];
  const negativeRules = [];
  const hardRuleResults = [];
  const reviewReasons = [];

  const enteredName = normalizeText(input.enteredName);
  const ocrName = normalizeText(extractedFields.name);
  const enteredSchoolName = normalizeText(input.enteredSchoolName);
  const ocrSchoolName = normalizeText(extractedFields.schoolName);

  if (fileSignals.malwareOrInvalidFile) {
    hardRuleResults.push("malware_or_invalid_file");
    return {
      score: 0,
      statusRecommendation: VERIFICATION_STATUS.rejected,
      positiveRules,
      negativeRules,
      hardRuleResults,
      reviewReasons: ["파일 형식 또는 보안 검사에 실패했습니다."],
    };
  }

  if (enteredName && ocrName && enteredName === ocrName) {
    addRule(positiveRules, "name_match", 20);
  } else if (enteredName && ocrName) {
    addRule(negativeRules, "name_mismatch", -30);
    reviewReasons.push("입력 이름과 OCR 이름이 일치하지 않습니다.");
  }

  if (enteredSchoolName && ocrSchoolName && enteredSchoolName === ocrSchoolName) {
    addRule(positiveRules, "school_match", 20);
  } else if (enteredSchoolName && ocrSchoolName) {
    addRule(negativeRules, "school_mismatch", -30);
    reviewReasons.push("입력 학교명과 OCR 학교명이 일치하지 않습니다.");
  }

  if (extractedFields.employmentKeywordDetected) {
    addRule(positiveRules, "employment_keyword_detected", 10);
  }

  const issuedDaysAgo = daysSince(extractedFields.issuedAt, referenceDate);
  if (issuedDaysAgo !== null && issuedDaysAgo >= 0 && issuedDaysAgo <= 90) {
    addRule(positiveRules, "issued_within_90_days", 10);
  } else if (issuedDaysAgo !== null && issuedDaysAgo >= 91 && issuedDaysAgo <= 180) {
    addRule(negativeRules, "issued_91_to_180_days", -10);
  } else if (issuedDaysAgo !== null && issuedDaysAgo > 180) {
    addRule(negativeRules, "issued_over_180_days", -25);
  }

  if ((extractedFields.requiredFieldCount ?? 0) >= 5) {
    addRule(positiveRules, "required_fields_extracted", 10);
  }

  if (extractedFields.templateMatched) {
    addRule(positiveRules, "certificate_template_matched", 10);
  }

  if (extractedFields.stampOrSignatureDetected) {
    addRule(positiveRules, "stamp_or_signature_detected", 10);
  }

  if (extractedFields.documentNumber) {
    addRule(positiveRules, "document_number_detected", 5);
  }

  if ((extractedFields.ocrConfidence ?? 0) >= 0.9) {
    addRule(positiveRules, "high_ocr_confidence", 5);
  }

  if (fileSignals.lowResolution) {
    addRule(negativeRules, "low_resolution", -10);
    reviewReasons.push("문서 이미지 품질이 낮습니다.");
  }

  if (fileSignals.editingTraceDetected) {
    addRule(negativeRules, "editing_trace_detected", -25);
    reviewReasons.push("문서 편집 흔적이 감지되었습니다.");
  }

  if (fileSignals.abnormalMetadata) {
    addRule(negativeRules, "abnormal_metadata", -10);
    reviewReasons.push("문서 메타데이터가 일반적이지 않습니다.");
  }

  if (fileSignals.duplicateApprovedDocument) {
    addRule(negativeRules, "duplicate_approved_document", -40);
    reviewReasons.push("기존 승인 계정과 동일한 문서 해시입니다.");
  }

  const score = clampScore(
    positiveRules.reduce((sum, rule) => sum + rule.points, 0) +
      negativeRules.reduce((sum, rule) => sum + rule.points, 0),
  );

  if (!ocrName || !ocrSchoolName) {
    hardRuleResults.push("missing_name_or_school");
    reviewReasons.push("OCR에서 성명 또는 학교명을 추출하지 못했습니다.");
  }

  if ((fileSignals.highRiskTamperSignalCount ?? 0) >= 2) {
    hardRuleResults.push("high_risk_tamper_signals");
    reviewReasons.push("위변조 고위험 신호가 2개 이상 감지되었습니다.");
  }

  let statusRecommendation;
  if (hardRuleResults.length > 0) {
    statusRecommendation = VERIFICATION_STATUS.pendingReview;
  } else if (score >= SCORE_THRESHOLDS.autoApprove) {
    statusRecommendation = VERIFICATION_STATUS.autoApproved;
  } else if (score >= SCORE_THRESHOLDS.pendingReview) {
    statusRecommendation = VERIFICATION_STATUS.pendingReview;
  } else {
    statusRecommendation = VERIFICATION_STATUS.rejected;
  }

  return {
    score,
    statusRecommendation,
    positiveRules,
    negativeRules,
    hardRuleResults,
    reviewReasons,
  };
}

module.exports = {
  SCORE_THRESHOLDS,
  VERIFICATION_STATUS,
  calculateVerificationScore,
};
