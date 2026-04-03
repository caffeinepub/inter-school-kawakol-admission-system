import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Nat "mo:core/Nat";


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

  type OtpRecord = {
    otp : Text;
    expiry : Int; // nanoseconds timestamp
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

  // Stable admission number storage (separate from Student type to avoid migration issues)
  var admissionCounter : Nat = 0;
  var admissionNumbersStable : [(Text, Text)] = []; // (email, admissionNumber)

  let students = Map.empty<Text, Student>();
  let principalToEmail = Map.empty<Principal, Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // OTP storage: email -> OtpRecord (in-memory, short-lived)
  let otpStore = Map.empty<Text, OtpRecord>();

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

  // --- Admission Number Helpers ---

  private func classNumText(_class : Class) : Text {
    switch (_class) {
      case (#class09th) { "9" };
      case (#class10th) { "10" };
      case (#class11th) { "11" };
      case (#class12th) { "12" };
    }
  };

  // Pad a natural number with leading zeros to reach the desired width
  private func padNat(n : Nat, width : Nat) : Text {
    let s = n.toText();
    let len = s.size();
    if (len >= width) { return s };
    var pad = "";
    var i = len;
    while (i < width) {
      pad := "0" # pad;
      i += 1;
    };
    pad # s
  };

  // Returns academic year string like "2025-26" based on current timestamp
  private func currentAcademicYear() : Text {
    let ns : Int = Time.now();
    let seconds : Int = ns / 1_000_000_000;
    // Reference: Jan 1, 2024 = 1704067200 Unix seconds
    let JAN1_2024 : Int = 1_704_067_200;
    let SECS_PER_YEAR : Int = 31_536_000;
    let years : Int = (seconds - JAN1_2024) / SECS_PER_YEAR;
    let year : Int = 2024 + years;
    let yearStart : Int = JAN1_2024 + years * SECS_PER_YEAR;
    let dayOfYear : Int = (seconds - yearStart) / 86_400;
    let month : Int = dayOfYear / 30 + 1;
    // Academic year starts April (month 4)
    let startY : Int = if (month >= 4) { year } else { year - 1 };
    let endY : Int = startY + 1;
    let endShort : Int = endY - (endY / 100 * 100);
    let endStr = if (endShort < 10) { "0" # endShort.toText() } else { endShort.toText() };
    startY.toText() # "-" # endStr
  };

  // Append a single element to an immutable array
  private func arrayAppend<T>(arr : [T], elem : T) : [T] {
    let n = arr.size();
    Array.tabulate<T>(n + 1, func(i : Nat) : T {
      if (i < n) { arr[i] } else { elem }
    })
  };

  // --- OTP Helpers ---

  // Generate a pseudo-random 6-digit OTP based on time
  private func generateOtpCode() : Text {
    let t : Int = Time.now();
    let raw : Int = (t / 1_000_000) % 1_000_000;
    let n : Nat = if (raw < 0) { 0 } else { Int.abs(raw) };
    // ensure 6 digits
    padNat(100_000 + (n % 900_000), 6)
  };

  // OTP valid for 10 minutes (in nanoseconds)
  let OTP_EXPIRY_NS : Int = 10 * 60 * 1_000_000_000;

  // Generate and store OTP for given email; returns the OTP string (for simulation display)
  public shared func generateOtp(email : Text) : async Text {
    let otp = generateOtpCode();
    let expiry : Int = Time.now() + OTP_EXPIRY_NS;
    let record : OtpRecord = { otp; expiry };
    otpStore.add(email, record);
    otp // returned so frontend can display it (since email sending is not available)
  };

  // Verify OTP for given email; returns true if valid and not expired
  public query func verifyOtp(email : Text, otp : Text) : async Bool {
    switch (otpStore.get(email)) {
      case (null) { false };
      case (?record) {
        if (Time.now() > record.expiry) { false }
        else { record.otp == otp }
      };
    };
  };

  // Reset password: verify OTP then update password
  public shared func resetPassword(email : Text, otp : Text, newPassword : Text) : async () {
    switch (otpStore.get(email)) {
      case (null) { Runtime.trap("OTP not found or expired") };
      case (?record) {
        if (Time.now() > record.expiry) {
          Runtime.trap("OTP has expired. Please request a new OTP.");
        };
        if (record.otp != otp) {
          Runtime.trap("Invalid OTP");
        };
        // OTP valid — update student password
        switch (students.get(email)) {
          case (null) { Runtime.trap("No account found with this email") };
          case (?student) {
            let updatedStudent : Student = {
              principal = student.principal;
              _class = student._class;
              name = student.name;
              email = student.email;
              password = newPassword;
              registrationDate = student.registrationDate;
              form = student.form;
              status = student.status;
            };
            students.add(email, updatedStudent);
            // Remove used OTP
            ignore otpStore.remove(email);
          };
        };
      };
    };
  };

  // --- Registration ---

  private func isRegisteredStudent(caller : Principal) : Bool {
    switch (principalToEmail.get(caller)) {
      case (null) { false };
      case (?email) {
        switch (students.get(email)) {
          case (null) { false };
          case (?_student) { true };
        };
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller)
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user)
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
    // Generate and store unique admission number
    admissionCounter += 1;
    let admNo = "ISK/" # classNumText(_class) # "/" # currentAcademicYear() # "/-" # padNat(admissionCounter, 5);
    admissionNumbersStable := arrayAppend(admissionNumbersStable, (email, admNo));
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
    students.values().toArray()
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

  // Admission Number Queries
  public query func getAdmissionNumber(email : Text) : async Text {
    for ((e, admNo) in admissionNumbersStable.vals()) {
      if (e == email) { return admNo };
    };
    ""
  };

  public query func getAllAdmissionNumbers() : async [(Text, Text)] {
    admissionNumbersStable
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
    students.values().toArray()
  };

  public query ({ caller }) func getAllPendingApplications() : async [Student] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view pending applications");
    };
    students.values().toArray().filter(func(student : Student) : Bool { student.status == #pending })
  };

  public query ({ caller }) func getAllApprovedApplications() : async [Student] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view approved applications");
    };
    students.values().toArray().filter(func(student : Student) : Bool { student.status == #approved })
  };

  public query ({ caller }) func getAllRejectedApplications() : async [Student] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view rejected applications");
    };
    students.values().toArray().filter(func(student : Student) : Bool { student.status == #rejected })
  };

  public query ({ caller }) func getApplicationsSortedByDate() : async [Student] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view applications");
    };
    students.values().toArray().sort(Student.compareByRegistrationDate)
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
