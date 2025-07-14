"use client";

import { Suspense } from "react";
import RegisterForm from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 text-center">
            Loading registration form...
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
