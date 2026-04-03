import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { backendInterface as ExtendedBackend } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { getCanisterErrorMessage } from "../utils/errorHandling";

type Step = 1 | 2 | 3;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { actor: rawActor, isFetching: actorLoading } = useActor();
  // Cast to extended type that includes OTP and resetPassword methods
  const actor = rawActor as unknown as ExtendedBackend | null;

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // The verified OTP to use for password reset
  const [verifiedOtp, setVerifiedOtp] = useState("");

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startCountdown = () => {
    setCountdown(60);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format.");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!validateEmail()) return;
    if (!actor) {
      toast.error("Connecting to server, please wait and try again.");
      return;
    }
    setSendLoading(true);
    setOtpError("");
    try {
      const otp = await actor.generateOtp(email);
      setOtpValue("");
      startCountdown();
      setStep(2);
      toast.info(
        `OTP सत्यापन / Your OTP is: ${otp} — Enter it below to verify your identity.`,
        { duration: 15000 },
      );
    } catch (error: unknown) {
      const msg = getCanisterErrorMessage(error);
      setEmailError(msg);
      toast.error(msg);
    } finally {
      setSendLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP.");
      return;
    }
    if (!actor) {
      toast.error("Connecting to server, please wait and try again.");
      return;
    }
    setVerifyLoading(true);
    setOtpError("");
    try {
      const valid = await actor.verifyOtp(email, otpValue);
      if (valid) {
        setVerifiedOtp(otpValue);
        setStep(3);
        toast.success("OTP verified! / OTP सत्यापित!");
      } else {
        setOtpError("Invalid OTP. Please try again. / गलत OTP, पुनः प्रयास करें।");
      }
    } catch (error: unknown) {
      const msg = getCanisterErrorMessage(error);
      if (msg.toLowerCase().includes("expir")) {
        setOtpError(
          "OTP expired. Please request a new one. / OTP की समय सीमा समाप्त हो गई।",
        );
      } else {
        setOtpError(msg);
      }
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!actor) {
      toast.error("Connecting to server, please wait and try again.");
      return;
    }
    setSendLoading(true);
    setOtpError("");
    setOtpValue("");
    try {
      const otp = await actor.generateOtp(email);
      startCountdown();
      toast.info(`नया OTP / New OTP: ${otp} — Enter it below.`, {
        duration: 15000,
      });
    } catch (error: unknown) {
      const msg = getCanisterErrorMessage(error);
      toast.error(msg);
    } finally {
      setSendLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    let valid = true;
    if (!newPassword) {
      setPasswordError("New password is required.");
      valid = false;
    } else if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }
    if (!valid) return;
    if (!actor) {
      toast.error("Connecting to server, please wait and try again.");
      return;
    }
    setResetLoading(true);
    try {
      await actor.resetPassword(email, verifiedOtp, newPassword);
      toast.success(
        "Password reset successful! / पासवर्ड सफलतापूर्वक रीसेट हो गया!",
      );
      navigate({ to: "/login" });
    } catch (error: unknown) {
      const msg = getCanisterErrorMessage(error);
      toast.error(msg);
    } finally {
      setResetLoading(false);
    }
  };

  const stepTitles: Record<Step, { en: string; hi: string; desc: string }> = {
    1: {
      en: "Forgot Password",
      hi: "पासवर्ड रीसेट",
      desc: "Enter your registered email to receive a verification OTP",
    },
    2: {
      en: "Verify OTP",
      hi: "OTP सत्यापन",
      desc: `OTP sent to: ${email}`,
    },
    3: {
      en: "Set New Password",
      hi: "नया पासवर्ड सेट करें",
      desc: "Choose a strong new password for your account",
    },
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          {/* Step indicator */}
          <div className="flex justify-center gap-2 mb-2">
            {([1, 2, 3] as Step[]).map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? "w-8 bg-primary"
                    : s < step
                      ? "w-4 bg-primary/60"
                      : "w-4 bg-muted"
                }`}
              />
            ))}
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {stepTitles[step].en}
          </CardTitle>
          <p className="text-center text-sm font-medium text-primary/70">
            {stepTitles[step].hi}
          </p>
          <CardDescription className="text-center">
            {stepTitles[step].desc}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {(actorLoading || (!actor && !actorLoading)) && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Connecting to server, please wait...
              </AlertDescription>
            </Alert>
          )}

          {/* Step 1: Email Entry */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address / ईमेल पता</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  className={emailError ? "border-destructive" : ""}
                  data-ocid="forgot_password.email.input"
                />
                {emailError && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <AlertDescription className="text-xs">
                      {emailError}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Button
                type="button"
                className="w-full"
                onClick={handleSendOtp}
                disabled={sendLoading || !actor || actorLoading}
                data-ocid="forgot_password.send_otp.button"
              >
                {sendLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send OTP / OTP भेजें
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <p className="text-sm text-muted-foreground">
                  OTP sent to:{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label>Enter OTP / OTP दर्ज करें</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpValue}
                    onChange={(val) => {
                      setOtpValue(val);
                      if (otpError) setOtpError("");
                    }}
                    data-ocid="forgot_password.otp.input"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {otpError && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <AlertDescription className="text-xs">
                      {otpError}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(1)}
                  data-ocid="forgot_password.back.button"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  Back
                </Button>

                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifyLoading || otpValue.length !== 6}
                  className="flex-1"
                  data-ocid="forgot_password.verify_otp.button"
                >
                  {verifyLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Verify OTP
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={sendLoading || countdown > 0}
                  className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                  data-ocid="forgot_password.resend_otp.button"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {countdown > 0
                    ? `Resend OTP in ${countdown}s`
                    : "Resend OTP / OTP पुनः भेजें"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                <p className="text-sm text-green-700 font-medium">
                  Identity verified! / पहचान सत्यापित!
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password / नया पासवर्ड</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  className={passwordError ? "border-destructive" : ""}
                  data-ocid="forgot_password.new_password.input"
                />
                {passwordError && (
                  <p
                    className="text-sm text-destructive"
                    data-ocid="forgot_password.password.error_state"
                  >
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">
                  Confirm Password / पासवर्ड पुष्टि करें
                </Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) setConfirmPasswordError("");
                  }}
                  className={confirmPasswordError ? "border-destructive" : ""}
                  data-ocid="forgot_password.confirm_password.input"
                />
                {confirmPasswordError && (
                  <p
                    className="text-sm text-destructive"
                    data-ocid="forgot_password.confirm_password.error_state"
                  >
                    {confirmPasswordError}
                  </p>
                )}
              </div>

              <Button
                type="button"
                className="w-full"
                onClick={handleResetPassword}
                disabled={resetLoading || !actor || actorLoading}
                data-ocid="forgot_password.reset_password.button"
              >
                {resetLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password / पासवर्ड रीसेट करें"
                )}
              </Button>
            </div>
          )}

          <div className="text-center pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => navigate({ to: "/login" })}
              className="text-sm text-muted-foreground hover:text-primary hover:underline inline-flex items-center gap-1"
              data-ocid="forgot_password.back_to_login.link"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Login / लॉगिन पर वापस जाएं
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
