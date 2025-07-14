"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCircle, Mail } from "lucide-react";
import Link from "next/link";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userExists, setUserExists] = useState(false);
  const [existingName, setExistingName] = useState("");
  const router = useRouter();

  const handleEmailCheck = useCallback(async () => {
    if (!email) return;

    setIsCheckingEmail(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/auth/register?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();

      if (data.success && data.exists && !data.alreadyRegistered) {
        setIsEmailValid(true);
        setUserExists(true);
        setExistingName(data.userName || "");
        setName(data.userName || "");
        setSuccess("Email found! You can now set your password.");
      } else if (data.exists && data.alreadyRegistered) {
        setIsEmailValid(false);
        setUserExists(false);
        setError(
          "This user has already set up their password. Please use the sign-in page instead."
        );
      } else {
        setIsEmailValid(false);
        setUserExists(false);
        setError(
          "This email is not registered for an account. Please contact an administrator to get invited."
        );
      }
    } catch {
      setError("Failed to check email. Please try again.");
      setIsEmailValid(false);
      setUserExists(false);
    } finally {
      setIsCheckingEmail(false);
      setIsEmailChecked(true);
    }
  }, [email]);

  // Automatically check email if provided via URL
  useEffect(() => {
    if (initialEmail && !isEmailChecked) {
      handleEmailCheck();
    }
  }, [initialEmail, isEmailChecked, handleEmailCheck]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailValid || !userExists) {
      setError("Please verify your email first.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsRegistering(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
          name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(
          "Registration successful! You can now sign in with your credentials."
        );
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2000);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Complete Registration
        </CardTitle>
        <CardDescription>
          Set up your password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Verification Section */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (isEmailChecked) {
                    setIsEmailChecked(false);
                    setIsEmailValid(false);
                    setUserExists(false);
                    setError(null);
                    setSuccess(null);
                  }
                }}
                required
                disabled={isCheckingEmail || isRegistering}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleEmailCheck}
                disabled={!email || isCheckingEmail || isRegistering}
                className="shrink-0"
              >
                {isCheckingEmail ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
              </Button>
            </div>
            {isEmailChecked && !isEmailValid && (
              <p className="text-sm text-red-600">
                Please verify your email to continue
              </p>
            )}
          </div>

          {/* Registration Form - Only shown when email is verified */}
          {isEmailValid && userExists && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isRegistering}
                />
                {existingName && (
                  <p className="text-sm text-gray-600">
                    Current name: {existingName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min. 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isRegistering}
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isRegistering}
                  minLength={8}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  isRegistering ||
                  !password ||
                  !confirmPassword ||
                  password !== confirmPassword
                }
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up your account...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </>
          )}
        </form>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
