
import React, { useState } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ios-ui/Card";
import { Input } from "@/components/ios-ui/Input";
import { Button } from "@/components/ios-ui/Button";
import { useToast } from "@/hooks/use-toast";

export default function Generator() {
  const [activeTab, setActiveTab] = useState<'request' | 'receipt'>('request');
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // For demo purposes - simulate creating an invoice/receipt
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: activeTab === 'request' ? 'Nota Permintaan Dibuat' : 'Nota Penerimaan Dibuat',
        description: activeTab === 'request' 
          ? `Permintaan pembayaran untuk ${clientName} telah dibuat` 
          : `Penerimaan pembayaran dari ${clientName} telah dicatat`
      });
      
      // Reset form
      setClientName("");
      setDescription("");
      setAmount("");
      setDueDate("");
      setPaymentMethod("");
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
            <CardTitle>
              {activeTab === 'request' ? 'Buat Permintaan Pembayaran' : 'Catat Penerimaan Pembayaran'}
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
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Deskripsi</label>
                <textarea
                  className="flex min-h-24 w-full rounded-xl bg-ios-gray-100 px-4 py-2 text-base ring-offset-background placeholder:text-ios-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ios-blue focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi layanan atau produk"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Jumlah</label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Rp 1.000.000"
                  required
                />
              </div>
              
              {activeTab === 'request' ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tenggat Waktu</label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tanggal Penerimaan</label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Metode Pembayaran</label>
                <select
                  className="flex h-12 w-full rounded-xl bg-ios-gray-100 px-4 py-2 text-base ring-offset-background placeholder:text-ios-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ios-blue focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="">Pilih metode pembayaran</option>
                  <option value="transfer">Transfer Bank</option>
                  <option value="cash">Tunai</option>
                  <option value="ewallet">E-wallet</option>
                  <option value="other">Lainnya</option>
                </select>
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
