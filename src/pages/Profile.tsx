
import React from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ios-ui/Card";
import { Input } from "@/components/ios-ui/Input";
import { Button } from "@/components/ios-ui/Button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Berhasil keluar",
      description: "Anda telah keluar dari akun"
    });
    navigate("/login");
  };

  return (
    <AppLayout title="Profil" activeRoute="profile">
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-4">
          <div className="h-24 w-24 rounded-full bg-ios-blue flex items-center justify-center text-white text-3xl font-semibold">
            JD
          </div>
          <h2 className="mt-4 text-xl font-semibold">John Doe</h2>
          <p className="text-ios-gray-600">john@example.com</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Bisnis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Bisnis</label>
              <Input defaultValue="John Doe Studio" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Alamat</label>
              <Input defaultValue="Jalan Contoh No. 123, Jakarta" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Bisnis</label>
              <Input defaultValue="contact@johndoestudio.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Telepon</label>
              <Input defaultValue="+62 812 3456 7890" />
            </div>
            <Button>Simpan Perubahan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Bank</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Bank</label>
              <Input defaultValue="Bank ABC" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nomor Rekening</label>
              <Input defaultValue="1234567890" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Atas Nama</label>
              <Input defaultValue="John Doe" />
            </div>
            <Button>Simpan Perubahan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keamanan</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Ubah Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleLogout}
            >
              Keluar
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
