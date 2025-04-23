
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Input } from "@/components/ios-ui/Input";
import { Button } from "@/components/ios-ui/Button";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For demo purposes - simulate signup
    // In production, you would make an API call to create an account
    setTimeout(() => {
      setIsLoading(false);
      
      // Store user data in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userData", JSON.stringify({
        name,
        email,
        registeredAt: new Date().toISOString()
      }));
      
      toast({
        title: "Akun berhasil dibuat",
        description: "Selamat bergabung!"
      });
      navigate("/");
    }, 1000);
  };

  return (
    <AuthLayout 
      title="Buat Akun Baru" 
      subtitle="Daftar untuk memulai mengelola nota pembayaran Anda"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none">
              Nama Lengkap
            </label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
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
            <label htmlFor="password" className="text-sm font-medium leading-none">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <p className="text-xs text-ios-gray-600">
              Password harus memiliki minimal 8 karakter
            </p>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Memproses..." : "Daftar"}
        </Button>
      </form>
      <div className="mt-6 text-center text-sm">
        <span className="text-ios-gray-600">Sudah punya akun? </span>
        <Link to="/login" className="text-ios-blue hover:underline">
          Masuk
        </Link>
      </div>
    </AuthLayout>
  );
}
