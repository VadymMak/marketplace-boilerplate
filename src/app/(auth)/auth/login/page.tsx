import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to your account</p>
        </div>
        <LoginForm />
        <p className="auth-footer">
          Don&apos;t have an account? <a href="/auth/register">Create one</a>
        </p>
      </div>
    </main>
  );
}
