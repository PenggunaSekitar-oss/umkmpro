
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ios-ui/Card";
import { Input } from "@/components/ios-ui/Input";
import { Button } from "@/components/ios-ui/Button";
import { useToast } from "@/hooks/use-toast";
import { FileText, FilePlus } from "lucide-react";

// Utility untuk menambah nota ke localStorage
function addNoteToLocalStorage(type: 'request' | 'receipt', note: any) {
  const key = type === 'request' ? 'invoices' : 'receipts';
  const current = JSON.parse(localStorage.getItem(key) || '[]');
  current.unshift(note); // urutan terbaru di atas
  localStorage.setItem(key, JSON.stringify(current));
}

export default function Generator() {
  const [activeTab, setActiveTab] = useState<'request' | 'receipt'>('request');
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [savedPaymentMethod, setSavedPaymentMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    clientName?: string;
    description?: string;
    amount?: string;
    dueDate?: string;
    paymentMethod?: string;
  }>({});
  const { toast } = useToast();

  // Load saved payment method from localStorage
  useEffect(() => {
    const storedPaymentData = localStorage.getItem("paymentData");
    if (storedPaymentData) {
      setSavedPaymentMethod(JSON.parse(storedPaymentData));
    }
  }, []);

  const validateForm = () => {
    let errors: {
      clientName?: string;
      description?: string;
      amount?: string;
      dueDate?: string;
      paymentMethod?: string;
    } = {};
    let isValid = true;

    if (!clientName.trim()) {
      errors.clientName = "Nama klien wajib diisi";
      isValid = false;
    }

    if (!description.trim()) {
      errors.description = "Deskripsi wajib diisi";
      isValid = false;
    }

    if (!amount.trim() || amount === "Rp ") {
      errors.amount = "Jumlah wajib diisi";
      isValid = false;
    } else if (isNaN(Number(amount.replace(/[^0-9]/g, "")))) {
      errors.amount = "Jumlah harus berupa angka";
      isValid = false;
    } else if (Number(amount.replace(/[^0-9]/g, "")) <= 0) {
      errors.amount = "Jumlah harus lebih dari 0";
      isValid = false;
    }

    if (!dueDate) {
      errors.dueDate = activeTab === 'request' ? "Tenggat waktu wajib diisi" : "Tanggal penerimaan wajib diisi";
      isValid = false;
    }

    if (!paymentMethod) {
      errors.paymentMethod = "Metode pembayaran wajib diisi";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const formatCurrency = (value: string) => {
    // Remove all non-numeric characters
    const numeric = value.replace(/[^0-9]/g, "");
    
    // Format with thousand separator
    if (numeric) {
      return `Rp ${numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    }
    return "Rp ";
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Handle empty input
    if (!value || value === "") {
      setAmount("Rp ");
      return;
    }
    
    // If input is just "R" or "Rp" or "Rp ", set to "Rp "
    if (value === "R" || value === "Rp" || value === "Rp ") {
      setAmount("Rp ");
      return;
    }
    
    // Otherwise format the currency
    setAmount(formatCurrency(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    // STRUKTUR DATA NOTA (bisa di-extend sesuai kebutuhan)
    const noteData =
      activeTab === "request"
        ? {
            id: Date.now(),
            client: clientName,
            description,
            amount,
            dueDate,
            status: "menunggu", // default status untuk permintaan
            paymentMethod: savedPaymentMethod ? savedPaymentMethod.method : paymentMethod,
            paymentDetails: savedPaymentMethod ? {
              bankOption: savedPaymentMethod.bankOption,
              walletOption: savedPaymentMethod.walletOption,
              details: savedPaymentMethod.details
            } : null,
            issuedDate: new Date().toLocaleDateString("id-ID"),
          }
        : {
            id: Date.now(),
            client: clientName,
            description,
            amount,
            receiptDate: dueDate,
            paymentMethod: savedPaymentMethod ? savedPaymentMethod.method : paymentMethod,
            paymentDetails: savedPaymentMethod ? {
              bankOption: savedPaymentMethod.bankOption,
              walletOption: savedPaymentMethod.walletOption,
              details: savedPaymentMethod.details
            } : null,
          };

    setTimeout(() => {
      setIsLoading(false);

      // Simpan ke localStorage
      addNoteToLocalStorage(activeTab, noteData);

      // Success message
      toast({
        title: activeTab === 'request' ? 'Nota Permintaan Dibuat' : 'Nota Penerimaan Dibuat',
        description: activeTab === 'request' 
          ? `Permintaan pembayaran untuk ${clientName} telah dibuat` 
          : `Penerimaan pembayaran dari ${clientName} telah dicatat`,
        variant: "default",
      });

      // Reset form
      setClientName("");
      setDescription("");
      setAmount("");
      setDueDate("");
      setPaymentMethod("");
      setFormErrors({});
    }, 1000);
  };

  return (
    <AppLayout title="Generator Nota" activeRoute="generator">
      <div className="space-y-6">
        {/* Tab selection */}
        <div className="flex rounded-xl bg-ios-gray-100 p-0.5">
          <button
            className={`flex-1 rounded-lg py-3 text-center text-sm font-medium transition ${
              activeTab === 'request' 
                ? 'bg-white text-ios-blue shadow-sm' 
                : 'text-ios-gray-600 hover:text-ios-gray-900'
            }`}
            onClick={() => setActiveTab('request')}
          >
            Permintaan Pembayaran
          </button>
          <button
            className={`flex-1 rounded-lg py-3 text-center text-sm font-medium transition ${
              activeTab === 'receipt' 
                ? 'bg-white text-ios-blue shadow-sm' 
                : 'text-ios-gray-600 hover:text-ios-gray-900'
            }`}
            onClick={() => setActiveTab('receipt')}
          >
            Nota Penerimaan
          </button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {activeTab === 'request' ? 
                <><FilePlus className="h-5 w-5" /> Buat Permintaan Pembayaran</> : 
                <><FileText className="h-5 w-5" /> Catat Penerimaan Pembayaran</>
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Klien / Perusahaan</label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="PT Example atau John Doe"
                />
                {formErrors.clientName && (
                  <p className="text-ios-red text-sm mt-1">{formErrors.clientName}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Deskripsi</label>
                <textarea
                  className={`flex min-h-24 w-full rounded-xl ${
                    formErrors.description ? "border border-ios-red" : "bg-ios-gray-100"
                  } px-4 py-2 text-base ring-offset-background placeholder:text-ios-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ios-blue focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi layanan atau produk"
                />
                {formErrors.description && (
                  <p className="text-ios-red text-sm mt-1">{formErrors.description}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Jumlah</label>
                <Input
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Rp 1.000.000"
                  className={formErrors.amount ? "border border-ios-red" : ""}
                />
                {formErrors.amount && (
                  <p className="text-ios-red text-sm mt-1">{formErrors.amount}</p>
                )}
              </div>
              
              {activeTab === 'request' ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tenggat Waktu</label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={formErrors.dueDate ? "border border-ios-red" : ""}
                  />
                  {formErrors.dueDate && (
                    <p className="text-ios-red text-sm mt-1">{formErrors.dueDate}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tanggal Penerimaan</label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={formErrors.dueDate ? "border border-ios-red" : ""}
                  />
                  {formErrors.dueDate && (
                    <p className="text-ios-red text-sm mt-1">{formErrors.dueDate}</p>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Metode Pembayaran</label>
                {savedPaymentMethod ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-ios-gray-100 rounded-xl">
                      <h3 className="font-medium mb-2">Metode Pembayaran Tersimpan</h3>
                      {savedPaymentMethod.method === "transfer" && (
                        <div>
                          <p><span className="font-medium">Jenis:</span> Transfer Bank</p>
                          <p><span className="font-medium">Bank:</span> {savedPaymentMethod.bankOption === "mandiri" ? "Bank Mandiri" : 
                                                                        savedPaymentMethod.bankOption === "bri" ? "Bank Rakyat Indonesia (BRI)" : 
                                                                        savedPaymentMethod.bankOption === "bca" ? "Bank Central Asia (BCA)" : 
                                                                        savedPaymentMethod.bankOption === "bni" ? "Bank Negara Indonesia (BNI)" : 
                                                                        savedPaymentMethod.bankOption === "btn" ? "Bank Tabungan Negara (BTN)" : 
                                                                        savedPaymentMethod.bankOption === "cimb" ? "Bank CIMB Niaga" : 
                                                                        savedPaymentMethod.bankOption === "bsi" ? "Bank Syariah Indonesia (BSI)" : 
                                                                        savedPaymentMethod.bankOption === "ocbc" ? "Bank OCBC NISP" : 
                                                                        savedPaymentMethod.bankOption === "panin" ? "Bank Pan Indonesia (Bank Panin)" : 
                                                                        savedPaymentMethod.bankOption === "danamon" ? "Bank Danamon Indonesia" : 
                                                                        "Bank Lainnya"}</p>
                          <p><span className="font-medium">Nama Bank:</span> {savedPaymentMethod.details.bankName}</p>
                          <p><span className="font-medium">Atas Nama:</span> {savedPaymentMethod.details.accountHolder}</p>
                          <p><span className="font-medium">Nomor Rekening:</span> {savedPaymentMethod.details.accountNumber}</p>
                        </div>
                      )}
                      {savedPaymentMethod.method === "ewallet" && (
                        <div>
                          <p><span className="font-medium">Jenis:</span> Dompet Digital</p>
                          <p><span className="font-medium">E-Wallet:</span> {savedPaymentMethod.walletOption === "dana" ? "Dana" : 
                                                                            savedPaymentMethod.walletOption === "ovo" ? "OVO" : 
                                                                            savedPaymentMethod.walletOption === "gopay" ? "Gopay" : 
                                                                            savedPaymentMethod.walletOption === "shopeepay" ? "Shopee Pay" : 
                                                                            "E-Wallet Lainnya"}</p>
                          <p><span className="font-medium">Nama E-Wallet:</span> {savedPaymentMethod.details.walletName}</p>
                          <p><span className="font-medium">Atas Nama:</span> {savedPaymentMethod.details.accountHolder}</p>
                          <p><span className="font-medium">Nomor Telepon:</span> {savedPaymentMethod.details.phoneNumber}</p>
                        </div>
                      )}
                      {savedPaymentMethod.method === "cash" && (
                        <div>
                          <p><span className="font-medium">Jenis:</span> Tunai</p>
                          <p>Pembayaran tunai akan dilakukan secara langsung.</p>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          // Gunakan metode pembayaran tersimpan
                          setPaymentMethod(savedPaymentMethod.method);
                        }}
                      >
                        Gunakan Metode Ini
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          // Pilih metode pembayaran lain
                          setPaymentMethod("");
                        }}
                      >
                        Pilih Metode Lain
                      </Button>
                    </div>
                  </div>
                ) : (
                  <select
                    className={`flex h-12 w-full rounded-xl ${
                      formErrors.paymentMethod ? "border border-ios-red" : "bg-ios-gray-100"
                    } px-4 py-2 text-base ring-offset-background placeholder:text-ios-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ios-blue focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50`}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="">Pilih metode pembayaran</option>
                    <option value="transfer">Transfer Bank</option>
                    <option value="cash">Tunai</option>
                    <option value="ewallet">E-wallet</option>
                    <option value="other">Lainnya</option>
                  </select>
                )}
                {formErrors.paymentMethod && (
                  <p className="text-ios-red text-sm mt-1">{formErrors.paymentMethod}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : activeTab === 'request' ? "Buat Permintaan" : "Catat Penerimaan"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
