/* Shared API contracts — mirrors Product_JOB_BE (Express + Mongo) */

export type ApiCode = "success" | "error" | string;

export interface ApiResponse<T = unknown> {
  code: ApiCode;
  message?: string;
  data?: T;
}

export interface InfoUser {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  phone?: string;
}

export interface InfoCompany {
  id: string;
  companyName: string;
  email: string;
  city?: string;
  address?: string;
  companyModel?: string;
  companyEmployees?: string;
  workingTime?: string;
  workOvertime?: string;
  description?: string;
  logo?: string;
  phone?: string;
}

export interface City {
  _id: string;
  name: string;
  id?: string;
}

export interface JobCard {
  id: string;
  companyLogo?: string;
  title: string;
  companyName: string;
  salaryMin: number;
  salaryMax: number;
  position: string;
  workingForm: string;
  companyCity?: string;
  technologies: string[];
}

export interface JobDetail {
  id: string;
  title: string;
  companyName: string;
  salaryMin: number;
  salaryMax: number;
  images: string[];
  position: string;
  workingForm: string;
  companyAddress: string;
  technologies: string[];
  description: string;
  companyLogo: string;
  companyId: string;
  companyModel: string;
  companyEmployees: string;
  companyWorkingTime: string;
  companyWorkOvertime: string;
}

export interface CompanyCard {
  id: string;
  logo?: string;
  companyName: string;
  cityName: string;
  totalJob: number;
}

export interface CompanyDetail {
  id: string;
  logo?: string;
  companyName: string;
  address?: string;
  companyModel?: string;
  companyEmployees?: string;
  workingTime?: string;
  workOvertime?: string;
  description?: string;
}

export interface CvCompanyItem {
  id: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  jobSalaryMin: number;
  jobSalaryMax: number;
  jobPosition: string;
  jobWorkingForm: string;
  viewed: boolean;
  status: string;
}

export interface CvUserItem {
  id: string;
  jobTitle: string;
  companyName: string;
  jobSalaryMin: number;
  jobSalaryMax: number;
  jobPosition: string;
  jobWorkingForm: string;
  status: string;
}

export interface CvDetailInfo {
  fullName: string;
  email: string;
  phone: string;
  fileCV: string;
}

export interface CvDetailJob {
  id: string;
  title: string;
  salaryMin: number;
  salaryMax: number;
  position: string;
  workingForm: string;
  technologies: string[];
}

export interface SearchResult {
  jobs: JobCard[];
  totalPage: number;
  totalRecord: number;
}
