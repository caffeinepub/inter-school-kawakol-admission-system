import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    _class: Class;
    name: string;
    email: string;
    isStudent: boolean;
}
export type Time = bigint;
export interface SubjectSelection {
    mil: Array<string>;
    sil: Array<string>;
    stream?: Stream;
    extraSubjects?: string;
    extra?: string;
    compulsory: Array<string>;
}
export interface AdmissionForm {
    bankAccountNumber: string;
    fatherAadhar: string;
    studentEmail: string;
    emailId: string;
    studentName: string;
    subjects: SubjectSelection;
    fathersNameAsPerAadhaar: string;
    previousSchool: string;
    ifscCode: string;
    marksObtained: bigint;
    dateOfBirth: bigint;
    eShikshakoshNumber: string;
    passingYear: bigint;
    apparNumber: string;
    accountHolderName: string;
    passingDivision: PassingDivision;
    studentPhone: string;
    studentPen: string;
    motherName: string;
    mobileNumber: string;
    mothersOccupation: string;
    mothersNameAsPerAadhaar: string;
    fathersName: string;
    bankName: BankName;
    mothersName: string;
    fathersContact: string;
    aadharNumber: string;
    fatherName: string;
    handicapType?: string;
    address: {
        policeStation: string;
        district: string;
        state: State;
        village: string;
        pinCode: string;
        block: string;
        postOffice: string;
    };
    gender: Gender;
    physicallyHandicapped: boolean;
    mothersContact: string;
    category: Category;
    previousRollNo: string;
    photo?: ExternalBlob;
    guardianDeclaration: boolean;
    annualFamilyIncome: string;
    handicapPercentage?: bigint;
    motherAadhar: string;
    fathersOccupation: string;
    previousExam: string;
}
export interface Student {
    status: ApplicationStatus;
    principal: Principal;
    form?: AdmissionForm;
    _class: Class;
    password: string;
    name: string;
    email: string;
    registrationDate: Time;
}
export enum ApplicationStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected",
    draft = "draft"
}
export enum BankName {
    other = "other",
    finoPaymentBank = "finoPaymentBank",
    dakshinBiharGraminBank = "dakshinBiharGraminBank",
    indianPostPaymentBank = "indianPostPaymentBank",
    madhyaBiharGraminBank = "madhyaBiharGraminBank",
    stateBankOfIndia = "stateBankOfIndia",
    unionBankOfIndia = "unionBankOfIndia",
    punjabNationalBank = "punjabNationalBank"
}
export enum Category {
    sc = "sc",
    st = "st",
    bci = "bci",
    ews = "ews",
    bcii = "bcii",
    general = "general"
}
export enum Class {
    class09th = "class09th",
    class10th = "class10th",
    class11th = "class11th",
    class12th = "class12th"
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male"
}
export enum PassingDivision {
    first = "first",
    third = "third",
    second = "second"
}
export enum State {
    bihar = "bihar",
    jharkhand = "jharkhand"
}
export enum Stream {
    arts = "arts",
    commerce = "commerce",
    science = "science"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveApplication(email: string): Promise<void>;
    approveApplicationForAdmin(email: string, adminPassword: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllApplications(): Promise<Array<Student>>;
    getAllApplicationsForAdmin(adminPassword: string): Promise<Array<Student>>;
    getAllApprovedApplications(): Promise<Array<Student>>;
    getAllPendingApplications(): Promise<Array<Student>>;
    getAllRejectedApplications(): Promise<Array<Student>>;
    getApplicationStatus(email: string): Promise<ApplicationStatus>;
    getApplicationsSortedByDate(): Promise<Array<Student>>;
    getCallerStudent(): Promise<Student | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getStudent(email: string): Promise<Student>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    loginStudent(email: string, password: string): Promise<boolean>;
    registerStudent(_class: Class, name: string, email: string, password: string): Promise<void>;
    rejectApplication(email: string): Promise<void>;
    rejectApplicationForAdmin(email: string, adminPassword: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveDraft(email: string, form: AdmissionForm): Promise<void>;
    submitForm(email: string, form: AdmissionForm): Promise<void>;
}
