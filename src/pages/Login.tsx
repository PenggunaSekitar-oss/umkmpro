
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Input } from "@/components/ios-ui/Input";
import { Button } from "@/components/ios-ui/Button";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For demo purposes - simulate login
    // In production, you would make an API call to authenticate
    setTimeout(() => {
      setIsLoading(false);
      // For demo, we'll just accept any login
      localStorage.setItem("isAuthenticated", "true");
      toast({
        title: "Login berhasil",
        description: "Selamat datang kembali!"
      });
      navigate("/");
    }, 1000);
  };

  return (
    <AuthLayout 
      title="Masuk ke Akun Anda" 
      subtitle="Masukkan email dan password anda untuk melanjutkan"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-ios-blue hover:underline">
                Lupa password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Memproses..." : "Masuk"}
        </Button>
      </form>
      <div className="mt-6 text-center text-sm">
        <span className="text-ios-gray-600">Belum punya akun? </span>
        <Link to="/signup" className="text-ios-blue hover:underline">
          Daftar
        </Link>
      </div>
    </AuthLayout>
  );
}
