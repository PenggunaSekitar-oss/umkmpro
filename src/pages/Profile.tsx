
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ios-ui/Card";
import { Input } from "@/components/ios-ui/Input";
import { Button } from "@/components/ios-ui/Button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    registeredAt: ""
  });
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    address: "",
    email: "",
    phone: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [bankOption, setBankOption] = useState("");
  const [walletOption, setWalletOption] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    walletName: "",
    phoneNumber: ""
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Load user data, business info, and payment data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    
    // Load saved business info if exists
    const storedBusinessInfo = localStorage.getItem("businessInfo");
    if (storedBusinessInfo) {
      setBusinessInfo(JSON.parse(storedBusinessInfo));
    } else if (storedUserData) {
      // Initialize with user data if available
      const userData = JSON.parse(storedUserData);
      setBusinessInfo({
        businessName: userData.name ? `${userData.name} Studio` : "Bisnis Saya",
        address: "",
        email: userData.email || "",
        phone: ""
      });
    }
    
    // Load saved payment method data if exists
    const storedPaymentData = localStorage.getItem("paymentData");
    if (storedPaymentData) {
      const paymentData = JSON.parse(storedPaymentData);
      setPaymentMethod(paymentData.method || "");
      setBankOption(paymentData.bankOption || "");
      setWalletOption(paymentData.walletOption || "");
      setPaymentDetails(paymentData.details || {
        bankName: "",
        accountNumber: "",
        accountHolder: "",
        walletName: "",
        phoneNumber: ""
      });
      // Don't show payment form if data already exists
      setShowPaymentForm(false);
    }
    
    // Load profile photo if exists
    const storedProfilePhoto = localStorage.getItem("profilePhoto");
    if (storedProfilePhoto) {
      setProfilePhoto(storedProfilePhoto);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    // We don't remove userData to persist it for next login
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
          {profilePhoto ? (
            <div className="relative">
              <img 
                src={profilePhoto} 
                alt="Foto Profil" 
                className="h-24 w-24 rounded-full object-cover"
              />
              <button 
                onClick={() => document.getElementById('profile-photo-input').click()}
                className="absolute bottom-0 right-0 bg-ios-blue text-white p-1 rounded-full"
                title="Ubah foto profil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-ios-blue flex items-center justify-center text-white text-3xl font-semibold">
                {getInitials(userData.name)}
              </div>
              <button 
                onClick={() => document.getElementById('profile-photo-input').click()}
                className="absolute bottom-0 right-0 bg-ios-blue text-white p-1 rounded-full"
                title="Tambah foto profil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
              </button>
            </div>
          )}
          <input 
            type="file" 
            id="profile-photo-input" 
            accept="image/*" 
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64String = reader.result as string;
                  setProfilePhoto(base64String);
                  localStorage.setItem("profilePhoto", base64String);
                  toast({
                    title: "Foto profil diperbarui",
                    description: "Foto profil Anda telah berhasil diperbarui"
                  });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <h2 className="mt-4 text-xl font-semibold">{userData.name || "Pengguna"}</h2>
          <p className="text-ios-gray-600">{userData.email || "Email belum diatur"}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Bisnis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Bisnis</label>
              <Input 
                value={businessInfo.businessName}
                onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
                placeholder="Masukkan nama bisnis Anda" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Alamat</label>
              <Input 
                value={businessInfo.address}
                onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                placeholder="Masukkan alamat bisnis Anda" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Bisnis</label>
              <Input 
                value={businessInfo.email}
                onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                placeholder="Masukkan email bisnis Anda" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Telepon</label>
              <Input 
                value={businessInfo.phone}
                onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                placeholder="Masukkan nomor telepon bisnis Anda" 
              />
            </div>
            <Button
              onClick={() => {
                // Save business info to localStorage
                localStorage.setItem("businessInfo", JSON.stringify(businessInfo));
                
                toast({
                  title: "Informasi bisnis disimpan",
                  description: "Informasi bisnis Anda telah berhasil disimpan"
                });
              }}
            >
              Simpan Perubahan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showPaymentForm && paymentMethod ? (
              <div className="space-y-4">
                <div className="p-4 bg-ios-gray-100 rounded-xl">
                  <h3 className="font-medium mb-2">Metode Pembayaran Tersimpan</h3>
                  {paymentMethod === "transfer" && (
                    <div>
                      <p><span className="font-medium">Jenis:</span> Transfer Bank</p>
                      <p><span className="font-medium">Bank:</span> {bankOption === "mandiri" ? "Bank Mandiri" : 
                                                                    bankOption === "bri" ? "Bank Rakyat Indonesia (BRI)" : 
                                                                    bankOption === "bca" ? "Bank Central Asia (BCA)" : 
                                                                    bankOption === "bni" ? "Bank Negara Indonesia (BNI)" : 
                                                                    bankOption === "btn" ? "Bank Tabungan Negara (BTN)" : 
                                                                    bankOption === "cimb" ? "Bank CIMB Niaga" : 
                                                                    bankOption === "bsi" ? "Bank Syariah Indonesia (BSI)" : 
                                                                    bankOption === "ocbc" ? "Bank OCBC NISP" : 
                                                                    bankOption === "panin" ? "Bank Pan Indonesia (Bank Panin)" : 
                                                                    bankOption === "danamon" ? "Bank Danamon Indonesia" : 
                                                                    "Bank Lainnya"}</p>
                      <p><span className="font-medium">Nama Bank:</span> {paymentDetails.bankName}</p>
                      <p><span className="font-medium">Atas Nama:</span> {paymentDetails.accountHolder}</p>
                      <p><span className="font-medium">Nomor Rekening:</span> {paymentDetails.accountNumber}</p>
                    </div>
                  )}
                  {paymentMethod === "ewallet" && (
                    <div>
                      <p><span className="font-medium">Jenis:</span> Dompet Digital</p>
                      <p><span className="font-medium">E-Wallet:</span> {walletOption === "dana" ? "Dana" : 
                                                                        walletOption === "ovo" ? "OVO" : 
                                                                        walletOption === "gopay" ? "Gopay" : 
                                                                        walletOption === "shopeepay" ? "Shopee Pay" : 
                                                                        "E-Wallet Lainnya"}</p>
                      <p><span className="font-medium">Nama E-Wallet:</span> {paymentDetails.walletName}</p>
                      <p><span className="font-medium">Atas Nama:</span> {paymentDetails.accountHolder}</p>
                      <p><span className="font-medium">Nomor Telepon:</span> {paymentDetails.phoneNumber}</p>
                    </div>
                  )}
                  {paymentMethod === "cash" && (
                    <div>
                      <p><span className="font-medium">Jenis:</span> Tunai</p>
                      <p>Pembayaran tunai akan dilakukan secara langsung.</p>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => setShowPaymentForm(true)}
                >
                  Ubah Metode Pembayaran
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pilih Metode Pembayaran</label>
                  <select
                    className="flex h-12 w-full rounded-xl bg-ios-gray-100 px-4 py-2 text-base ring-offset-background placeholder:text-ios-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ios-blue focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="">Pilih metode pembayaran</option>
                    <option value="transfer">Transfer Bank</option>
                    <option value="ewallet">Dompet Digital</option>
                    <option value="cash">Tunai</option>
                  </select>
                </div>
                
                {/* Transfer Bank Options */}
                {paymentMethod === "transfer" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pilih Bank</label>
                      <select
                        className="flex h-12 w-full rounded-xl bg-ios-gray-100 px-4 py-2 text-base ring-offset-background placeholder:text-ios-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ios-blue focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                        value={bankOption}
                        onChange={(e) => setBankOption(e.target.value)}
                      >
                        <option value="">Pilih bank</option>
                        <option value="mandiri">Bank Mandiri</option>
                        <option value="bri">Bank Rakyat Indonesia (BRI)</option>
                        <option value="bca">Bank Central Asia (BCA)</option>
                        <option value="bni">Bank Negara Indonesia (BNI)</option>
                        <option value="btn">Bank Tabungan Negara (BTN)</option>
                        <option value="cimb">Bank CIMB Niaga</option>
                        <option value="bsi">Bank Syariah Indonesia (BSI)</option>
                        <option value="ocbc">Bank OCBC NISP</option>
                        <option value="panin">Bank Pan Indonesia (Bank Panin)</option>
                        <option value="danamon">Bank Danamon Indonesia</option>
                      </select>
                    </div>
                    
                    {bankOption && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nama Bank</label>
                          <Input 
                            value={paymentDetails.bankName}
                            onChange={(e) => setPaymentDetails({...paymentDetails, bankName: e.target.value})}
                            placeholder="Masukkan nama bank" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nama Lengkap</label>
                          <Input 
                            value={paymentDetails.accountHolder}
                            onChange={(e) => setPaymentDetails({...paymentDetails, accountHolder: e.target.value})}
                            placeholder="Masukkan nama pemilik rekening" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nomor Rekening</label>
                          <Input 
                            value={paymentDetails.accountNumber}
                            onChange={(e) => setPaymentDetails({...paymentDetails, accountNumber: e.target.value})}
                            placeholder="Masukkan nomor rekening" 
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {/* Dompet Digital Options */}
                {paymentMethod === "ewallet" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pilih Dompet Digital</label>
                      <select
                        className="flex h-12 w-full rounded-xl bg-ios-gray-100 px-4 py-2 text-base ring-offset-background placeholder:text-ios-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ios-blue focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                        value={walletOption}
                        onChange={(e) => setWalletOption(e.target.value)}
                      >
                        <option value="">Pilih dompet digital</option>
                        <option value="dana">Dana</option>
                        <option value="ovo">OVO</option>
                        <option value="gopay">Gopay</option>
                        <option value="shopeepay">Shopee Pay</option>
                      </select>
                    </div>
                    
                    {walletOption && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nama E-WALLET</label>
                          <Input 
                            value={paymentDetails.walletName}
                            onChange={(e) => setPaymentDetails({...paymentDetails, walletName: e.target.value})}
                            placeholder="Masukkan nama e-wallet" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nama Lengkap</label>
                          <Input 
                            value={paymentDetails.accountHolder}
                            onChange={(e) => setPaymentDetails({...paymentDetails, accountHolder: e.target.value})}
                            placeholder="Masukkan nama pemilik akun" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nomor Telepon Terdaftar</label>
                          <Input 
                            value={paymentDetails.phoneNumber}
                            onChange={(e) => setPaymentDetails({...paymentDetails, phoneNumber: e.target.value})}
                            placeholder="Masukkan nomor telepon terdaftar" 
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {/* Cash Option */}
                {paymentMethod === "cash" && (
                  <div className="p-4 bg-ios-gray-100 rounded-xl">
                    <p className="text-ios-gray-600">Pembayaran tunai akan dilakukan secara langsung. Tidak ada informasi tambahan yang diperlukan.</p>
                  </div>
                )}
                
                <Button 
                  onClick={() => {
                    // Save payment method to localStorage
                    const paymentData = {
                      method: paymentMethod,
                      bankOption,
                      walletOption,
                      details: paymentDetails
                    };
                    
                    localStorage.setItem("paymentData", JSON.stringify(paymentData));
                    
                    // Hide payment form after saving
                    setShowPaymentForm(false);
                    
                    toast({
                      title: "Metode pembayaran disimpan",
                      description: "Informasi metode pembayaran Anda telah berhasil disimpan"
                    });
                  }}
                >
                  Simpan Perubahan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keamanan</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowPasswordModal(true)}
            >
              Ubah Password
            </Button>
          </CardContent>
        </Card>
        
        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Ubah Password</h2>
                  <button 
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      });
                    }}
                    className="text-ios-gray-600 hover:text-ios-gray-900"
                  >
                    &times;
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password Saat Ini</label>
                    <Input 
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      placeholder="Masukkan password saat ini" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password Baru</label>
                    <Input 
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      placeholder="Masukkan password baru" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Konfirmasi Password Baru</label>
                    <Input 
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      placeholder="Masukkan kembali password baru" 
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowPasswordModal(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: ""
                        });
                      }}
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={() => {
                        // Validate passwords
                        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                          toast({
                            title: "Error",
                            description: "Semua field harus diisi",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        if (passwordData.newPassword !== passwordData.confirmPassword) {
                          toast({
                            title: "Error",
                            description: "Password baru dan konfirmasi password tidak cocok",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        // In a real app, we would verify the current password and update it
                        // For this demo, we'll just simulate success
                        
                        // Close modal and reset form
                        setShowPasswordModal(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: ""
                        });
                        
                        toast({
                          title: "Password diperbarui",
                          description: "Password Anda telah berhasil diperbarui"
                        });
                      }}
                    >
                      Simpan Perubahan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
