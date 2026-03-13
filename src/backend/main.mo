import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Int "mo:core/Int";


import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  type Class = { #class09th; #class10th; #class11th; #class12th };
  type Gender = { #male; #female; #other };
  type Category = { #general; #ews; #sc; #st; #bci; #bcii };
  type BankName = {
    #stateBankOfIndia;
    #punjabNationalBank;
    #madhyaBiharGraminBank;
    #dakshinBiharGraminBank;
    #unionBankOfIndia;
    #indianPostPaymentBank;
    #finoPaymentBank;
    #other;
  };
  type PassingDivision = { #first; #second; #third };
  type State = { #bihar; #jharkhand };
  type Stream = { #science; #arts; #commerce };
  type ApplicationStatus = { #draft; #pending; #approved; #rejected };

  type SubjectSelection = {
    mil : [Text];
    sil : [Text];
    compulsory : [Text];
    extra : ?Text;
    stream : ?Stream;
    extraSubjects : ?Text;
  };

  type AdmissionForm = {
    studentPen : Text;
    apparNumber : Text;
    eShikshakoshNumber : Text;
    studentPhone : Text;
    studentEmail : Text;
    fathersName : Text;
    mothersName : Text;
    fathersOccupation : Text;
    mothersOccupation : Text;
    fathersContact : Text;
    mothersContact : Text;
    fathersNameAsPerAadhaar : Text;
    mothersNameAsPerAadhaar : Text;
    studentName : Text;
    fatherName : Text;
    motherName : Text;
    dateOfBirth : Int;
    gender : Gender;
    category : Category;
    physicallyHandicapped : Bool;
    handicapType : ?Text;
    handicapPercentage : ?Nat;
    aadharNumber : Text;
    annualFamilyIncome : Text;
    accountHolderName : Text;
    bankAccountNumber : Text;
    ifscCode : Text;
    bankName : BankName;
    mobileNumber : Text;
    emailId : Text;
    fatherAadhar : Text;
    motherAadhar : Text;
    previousExam : Text;
    previousRollNo : Text;
    previousSchool : Text;
    passingYear : Nat;
    marksObtained : Nat;
    passingDivision : PassingDivision;
    address : {
      village : Text;
      postOffice : Text;
      policeStation : Text;
      block : Text;
      district : Text;
      state : State;
      pinCode : Text;
    };
    guardianDeclaration : Bool;
    subjects : SubjectSelection;
    photo : ?Storage.ExternalBlob;
  };

  type Student = {
    principal : Principal;
    _class : Class;
    name : Text;
    email : Text;
    password : Text;
    registrationDate : Time.Time;
    form : ?AdmissionForm;
    status : ApplicationStatus;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    _class : Class;
    isStudent : Bool;
  };

  module Student {
    public func compareByRegistrationDate(student1 : Student, student2 : Student) : Order.Order {
      Int.compare(student1.registrationDate, student2.registrationDate);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Stable storage to persist data across canister upgrades
  stable var studentsStable : [Student] = [];

  let students = Map.empty<Text, Student>();
  let principalToEmail = Map.empty<Principal, Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Restore data from stable storage on init/upgrade
  do {
    for (student in studentsStable.vals()) {
      students.add(student.email, student);
      principalToEmail.add(student.principal, student.email);
    };
  };

  system func preupgrade() {
    studentsStable := students.values().toArray();
  };

  system func postupgrade() {
    studentsStable := [];
  };

  let ADMIN_PASSWORD : Text = "InterSchool@951";

  private func isRegisteredStudent(caller : Principal) : Bool {
    switch (principalToEmail.get(caller)) {
      case (null) { false };
      case (?email) {
        switch (students.get(email)) {
          case (null) { false };
          case (?student) { true };
        };
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func registerStudent(_class : Class, name : Text, email : Text, password : Text) : async () {
    if (students.containsKey(email)) {
      Runtime.trap("Email already registered");
    };
    let student : Student = {
      principal = caller;
      _class;
      name;
      email;
      password;
      registrationDate = Time.now();
      form = null;
      status = #draft;
    };
    students.add(email, student);
    principalToEmail.add(caller, email);
    let profile : UserProfile = {
      name;
      email;
      _class;
      isStudent = true;
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func loginStudent(email : Text, password : Text) : async Bool {
    switch (students.get(email)) {
      case (null) { Runtime.trap("Invalid credentials") };
      case (?student) {
        if (student.password == password) { true } else { Runtime.trap("Invalid credentials") };
      };
    };
  };

  public shared ({ caller }) func saveDraft(email : Text, form : AdmissionForm) : async () {
    switch (students.get(email)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        let updatedStudent : Student = {
          principal = student.principal;
          _class = student._class;
          name = student.name;
          email = student.email;
          password = student.password;
          registrationDate = student.registrationDate;
          form = ?form;
          status = #draft;
        };
        students.add(email, updatedStudent);
      };
    };
  };

  public shared ({ caller }) func submitForm(email : Text, form : AdmissionForm) : async () {
    switch (students.get(email)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        let updatedStudent : Student = {
          principal = student.principal;
          _class = student._class;
          name = student.name;
          email = student.email;
          password = student.password;
          registrationDate = student.registrationDate;
          form = ?form;
          status = #pending;
        };
        students.add(email, updatedStudent);
      };
    };
  };

  public shared ({ caller }) func approveApplication(email : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (students.get(email)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        let updatedStudent : Student = {
          principal = student.principal;
          _class = student._class;
          name = student.name;
          email = student.email;
          password = student.password;
          registrationDate = student.registrationDate;
          form = student.form;
          status = #approved;
        };
        students.add(email, updatedStudent);
      };
    };
  };

  public shared ({ caller }) func rejectApplication(email : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (students.get(email)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        let updatedStudent : Student = {
          principal = student.principal;
          _class = student._class;
          name = student.name;
          email = student.email;
          password = student.password;
          registrationDate = student.registrationDate;
          form = student.form;
          status = #rejected;
        };
        students.add(email, updatedStudent);
      };
    };
  };

  // PASSWORD-BASED ADMIN FUNCTIONS
  public query func getAllApplicationsForAdmin(adminPassword : Text) : async [Student] {
    if (adminPassword != ADMIN_PASSWORD) {
      Runtime.trap("Unauthorized: Invalid admin password");
    };
    students.values().toArray();
  };

  public shared func approveApplicationForAdmin(email : Text, adminPassword : Text) : async () {
    if (adminPassword != ADMIN_PASSWORD) {
      Runtime.trap("Unauthorized: Invalid admin password");
    };
    switch (students.get(email)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        let updatedStudent : Student = {
          principal = student.principal;
          _class = student._class;
          name = student.name;
          email = student.email;
          password = student.password;
          registrationDate = student.registrationDate;
          form = student.form;
          status = #approved;
        };
        students.add(email, updatedStudent);
      };
    };
  };

  public shared func rejectApplicationForAdmin(email : Text, adminPassword : Text) : async () {
    if (adminPassword != ADMIN_PASSWORD) {
      Runtime.trap("Unauthorized: Invalid admin password");
    };
    switch (students.get(email)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        let updatedStudent : Student = {
          principal = student.principal;
          _class = student._class;
          name = student.name;
          email = student.email;
          password = student.password;
          registrationDate = student.registrationDate;
          form = student.form;
          status = #rejected;
        };
        students.add(email, updatedStudent);
      };
    };
  };

  public query ({ caller }) func getApplicationStatus(email : Text) : async ApplicationStatus {
    switch (students.get(email)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) { student.status };
    };
  };

  public query ({ caller }) func getAllApplications() : async [Student] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all applications");
    };
    students.values().toArray();
  };

  public query ({ caller }) func getAllPendingApplications() : async [Student] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view pending applications");
    };
    students.values().toArray().filter(func(student) { student.status == #pending });
  };

  public query ({ caller }) func getAllApprovedApplications() : async [Student] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view approved applications");
    };
    students.values().toArray().filter(func(student) { student.status == #approved });
  };

  public query ({ caller }) func getAllRejectedApplications() : async [Student] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view rejected applications");
    };
    students.values().toArray().filter(func(student) { student.status == #rejected });
  };

  public query ({ caller }) func getApplicationsSortedByDate() : async [Student] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view applications");
    };
    students.values().toArray().sort(Student.compareByRegistrationDate);
  };

  public query ({ caller }) func getStudent(email : Text) : async Student {
    switch (students.get(email)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) { student };
    };
  };

  public query ({ caller }) func getCallerStudent() : async ?Student {
    switch (principalToEmail.get(caller)) {
      case (null) { null };
      case (?email) { students.get(email) };
    };
  };
};
