"use client";
import React, { useState } from "react";

import PersonalInfo, { defaultData } from "@/components/user/resume-builder/PersonalInfo";
import StepperHeaderResume, { steps } from "@/components/user/resume-builder/StepperHeaderResume";
import StepperNavigation from "@/components/user/resume-builder/StepperNavigation";
import ResumePreview from "@/components/user/resume-builder/ResumePreview";
import EducationStep, { EducationRecord } from "@/components/user/resume-builder/EducationStep";
import WorkStep, { WorkRecord } from "@/components/user/resume-builder/WorkStep";
import SkillsStep, { SkillRecord } from "@/components/user/resume-builder/SkillsStep";
import ProjectsStep, { ProjectRecord } from "@/components/user/resume-builder/ProjectsStep";
import ResearchStep, { ResearchRecord } from "@/components/user/resume-builder/ResearchStep"; 
import SoftwareSkillsStep, { SoftwareSkillRecord } from "@/components/user/resume-builder/SoftwareSkillsStep";
import AwardsAndHonors, { AwardRecord } from "@/components/user/resume-builder/AwardsAndHonors";
import Internship, { InternshipRecord } from "@/components/user/resume-builder/Internship"; 
import OtherStep, { VolunteerRecord, ReferenceRecord, HobbyRecord } from "@/components/user/resume-builder/OtherStep"; // ایمپورت کامپوننت سایر

// ─── Root Component ───────────────────────────────────────────────────────────
export default function ResumeBuilder() {
  const [activeStep, setActiveStep] = useState(0);
  
  // مقداردهی اولیه به صورت آبجکت کامل به همراه آرایه‌های خالی
  const [data, setData] = useState<any>({ 
    ...defaultData, 
    educations: defaultData.educations || [],
    experiences: defaultData.experiences || [],
    skills: defaultData.skills || [],
    projects: defaultData.projects || [],
    researches: defaultData.researches || [],
    softwareSkills: defaultData.softwareSkills || [],
    awards: defaultData.awards || [],
    internships: defaultData.internships || [],
    volunteering: defaultData.volunteering || [], // اضافه شدن فیلدهای بخش سایر
    references: defaultData.references || [],
    hobbies: defaultData.hobbies || []
  });

  // توابع آپدیت
  const updateField = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateEducations = (newEducations: EducationRecord[]) => {
    setData((prev: any) => ({ ...prev, educations: newEducations }));
  };

  const updateExperiences = (newExperiences: WorkRecord[]) => {
    setData((prev: any) => ({ ...prev, experiences: newExperiences }));
  };

  const updateSkills = (newSkills: SkillRecord[]) => {
    setData((prev: any) => ({ ...prev, skills: newSkills }));
  };

  const updateProjects = (newProjects: ProjectRecord[]) => {
    setData((prev: any) => ({ ...prev, projects: newProjects }));
  };

  const updateResearches = (newResearches: ResearchRecord[]) => {
    setData((prev: any) => ({ ...prev, researches: newResearches }));
  };

  const updateSoftwareSkills = (newSoftwareSkills: SoftwareSkillRecord[]) => {
    setData((prev: any) => ({ ...prev, softwareSkills: newSoftwareSkills }));
  };

  const updateAwards = (newAwards: AwardRecord[]) => {
    setData((prev: any) => ({ ...prev, awards: newAwards }));
  };

  const updateInternships = (newInternships: InternshipRecord[]) => {
    setData((prev: any) => ({ ...prev, internships: newInternships }));
  };

  // توابع آپدیت بخش سایر
  const updateVolunteering = (newVolunteering: VolunteerRecord[]) => {
    setData((prev: any) => ({ ...prev, volunteering: newVolunteering }));
  };
  const updateReferences = (newReferences: ReferenceRecord[]) => {
    setData((prev: any) => ({ ...prev, references: newReferences }));
  };
  const updateHobbies = (newHobbies: HobbyRecord[]) => {
    setData((prev: any) => ({ ...prev, hobbies: newHobbies }));
  };

  // تابعی برای مدیریت رندر کردن گام‌های مختلف فرم
  const renderStepContent = () => {
    // 0: پایه، 1: تحصیلی، 2: شغلی، 3: مهارت‌ها، 4: پروژه‌ها، 5: تحقیقات، 6: مهارت نرم‌افزاری، 7: جوایز، 8: کارآموزی، 9: سایر
    switch (activeStep) {
      case 0:
        return <PersonalInfo data={data} update={updateField} />;
      case 1:
        return <EducationStep educations={data.educations} onChange={updateEducations} />;
      case 2:
        return <WorkStep experiences={data.experiences} onChange={updateExperiences} />;
      case 3:
        return <SkillsStep skills={data.skills} onChange={updateSkills} />;
      case 4:
        return <ProjectsStep projects={data.projects} onChange={updateProjects} />;
      case 5:
        return <ResearchStep researches={data.researches} onChange={updateResearches} />;
      case 6:
        return <SoftwareSkillsStep softwareSkills={data.softwareSkills} onChange={updateSoftwareSkills} />;
      case 7:
        return <AwardsAndHonors awards={data.awards} onChange={updateAwards} />;
      case 8:
        return <Internship internships={data.internships} onChange={updateInternships} />;
      case 9:
        return (
          <OtherStep 
            volunteering={data.volunteering} onChangeVolunteering={updateVolunteering}
            references={data.references} onChangeReferences={updateReferences}
            hobbies={data.hobbies} onChangeHobbies={updateHobbies}
          />
        );
      default:
        return <EmptySection label={steps[activeStep]?.label} icon={steps[activeStep]?.icon} />;
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50/40 font-sans antialiased text-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 items-start">
        
        {/* ── TOP: Stepper Header Container ── */}
        <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
          <StepperHeaderResume steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />
        </div>

        {/* ── BOTTOM: Two Columns Layout ── */}
        <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ── RIGHT: Form Container ── */}
          <div className="w-full lg:flex-1 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col overflow-hidden">
            
            {/* Top bar */}
            <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-slate-800">ساخت رزومه</h1>
                <p className="text-xs text-slate-400 mt-0.5">مرحله {activeStep + 1} از {steps.length}</p>
              </div>
              {/* Mobile preview toggle */}
              <button className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                پیش‌نمایش
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 bg-slate-50/40 flex-1">
              {renderStepContent()}
            </div>

            {/* Navigation Component */}
            <StepperNavigation activeStep={activeStep} setActiveStep={setActiveStep} totalSteps={steps.length} />
          </div>

          {/* ── LEFT: Sticky Live Preview Component ── */}
          <ResumePreview data={data} />
          
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────
const EmptySection = ({ label, icon }: { label: string; icon: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[450px] border-2 border-dashed border-slate-200 rounded-2xl bg-white text-center p-6">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-slate-700 mb-1">بخش {label}</h3>
    <p className="text-sm text-slate-400 max-w-xs">این بخش در حال توسعه است و به زودی فرم‌های مربوطه اضافه می‌شود.</p>
  </div>
);