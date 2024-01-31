import React, { useState, useEffect } from "react";
import { getData } from "../../api";
import { useParams } from "react-router-dom";
import BasicInfo from "./BasicInfo";
import InterviewSection from "./InterviewSection";
import HouseHoldMembersList from "./HouseholdMembersList";
import MemberQuestions from "./MembersQuestions";
import HouseHoldQuestions from "./HouseHoldQuestions";
import SignatureSection from "./SignatureSection";
import Loader from "../../components/Loader";

const OcrSurveyForm = () => {
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(null);

  const getSurveyNumber = async () => {
    setLoading(true);
    const res = await getData("survey-entry-details/" + id + "/", {});
    if (res.status === 1) {
      const step = res.data.next_section === null ? 1 : +res.data.next_section + 1;
      setStep(step);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    getSurveyNumber();
  }, []);
  const nextStep = (whichStep) => {
    window.scrollTo(0, 0);
    setStep(whichStep);
  };
  return (
    <div>
      {loading ? <Loader /> : null}
      {!loading ? (
        <>
          {step && step === 1 ? (
            <BasicInfo nextStep={nextStep} />
          ) : null}
          {step && step === 2 ? (
            <InterviewSection
              nextStep={nextStep}
            />
          ) : null}
          {step && step === 3 ? (
            <HouseHoldMembersList
              nextStep={nextStep}
            />
          ) : null}
          {step && step === 4 ? (
            <MemberQuestions
              nextStep={nextStep}
            />
          ) : null}
          {step && step === 5 ? (
            <HouseHoldQuestions
              nextStep={nextStep}
            />
          ) : null}
          {step && step === 6 ? (
            <SignatureSection
              nextStep={nextStep}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default OcrSurveyForm;
