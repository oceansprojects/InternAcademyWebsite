import BasicInformationEditor from "./BasicInformationEditor";
import OverviewEditor from "./OverviewEditor";
import SummaryCardEditor from "./SummaryCardEditor";
import TechnologyEditor from "./TechnologyEditor";
import ProjectEditor from "./ProjectEditor";
import TestimonialEditor from "./TestimonialEditor";
import CurriculumEditor from "./CurriculumEditor";
import FAQEditor from "./FAQEditor";
import FacultyEditor from "./FacultyEditor";

export const EDITORS = {
  "basic-information": BasicInformationEditor,
  overview: OverviewEditor,
  "summary-cards": SummaryCardEditor,
  technologies: TechnologyEditor,
  projects: ProjectEditor,
  testimonials: TestimonialEditor,
  curriculum: CurriculumEditor,
  faqs: FAQEditor,
  faculty: FacultyEditor,
};