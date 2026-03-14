import { RegisterForm } from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create account</h1>
          <p>Join our marketplace today</p>
        </div>
        <RegisterForm />
        <p className="auth-footer">
          Already have an account? <a href="/auth/login">Sign in</a>
        </p>
      </div>
    </main>
  );
}
