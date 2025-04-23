
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ios-ui/Card";
import { Search, Filter, Download, Share, Eye } from "lucide-react";
import { Input } from "@/components/ios-ui/Input";
import { Button } from "@/components/ios-ui/Button";

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    address: "",
    email: "",
    phone: ""
  });

  // Ambil invoice dari localStorage saat komponen dirender
  useEffect(() => {
    // Load business info from localStorage
    const storedBusinessInfo = localStorage.getItem("businessInfo");
    if (storedBusinessInfo) {
      setBusinessInfo(JSON.parse(storedBusinessInfo));
    }
    
    const stored = localStorage.getItem("invoices");
    if (stored) {
      const parsedInvoices = JSON.parse(stored);
      
      // Periksa invoice yang sudah jatuh tempo
      const updatedInvoices = parsedInvoices.map(invoice => {
        if (invoice.status === "menunggu" && invoice.dueDate) {
          const dueDate = new Date(invoice.dueDate);
          const today = new Date();
          
          // Jika tanggal jatuh tempo sudah lewat, ubah status menjadi "jatuhTempo"
          if (dueDate < today) {
            return { ...invoice, status: "jatuhTempo" };
          }
        }
        return invoice;
      });
      
      // Jika ada perubahan status, simpan kembali ke localStorage
      if (JSON.stringify(updatedInvoices) !== stored) {
        localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
      }
      
      setInvoices(updatedInvoices);
    } else {
      setInvoices([]);
    }
  }, []);

  // Filter invoices berdasarkan search dan status
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      (invoice.client || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (invoice.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "menunggu" && invoice.status === "menunggu") ||
      (filter === "jatuhTempo" && invoice.status === "jatuhTempo") ||
      (filter === "dibayar" && invoice.status === "dibayar");

    return matchesSearch && matchesFilter;
  });

  // Styling badge status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "menunggu":
        return "bg-ios-yellow/10 text-ios-yellow";
      case "jatuhTempo":
        return "bg-ios-red/10 text-ios-red";
      case "dibayar":
        return "bg-ios-green/10 text-ios-green";
      default:
        return "bg-ios-gray-200 text-ios-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case "menunggu":
        return "Menunggu";
      case "jatuhTempo":
        return "Jatuh Tempo";
      case "dibayar":
        return "Dibayar";
      default:
        return status;
    }
  };

  // Format tanggal ke format Indonesia
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Tutup modal
  const closeModal = () => {
    setShowInvoiceModal(false);
    setSelectedInvoice(null);
  };

  return (
    <AppLayout title="Permintaan Pembayaran" activeRoute="invoices">
      <div className="space-y-6">
        {/* Modal Detail Invoice */}
        {showInvoiceModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full h-[80vh] overflow-y-auto">
              <div className="relative p-6 min-h-full">
                {/* Watermark untuk invoice yang belum dibayar */}
                {selectedInvoice.status !== "dibayar" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-6xl font-bold text-red-200 opacity-20 rotate-[-30deg]">
                      BELUM TERBAYAR
                    </div>
                  </div>
                )}
                
                {/* Header Invoice */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-ios-blue">INVOICE</h2>
                    <p className="text-ios-gray-600">#{selectedInvoice.id}</p>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="text-ios-blue hover:text-ios-blue-dark text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-ios-blue/10 hover:bg-ios-blue/20 transition-colors"
                  >
                    &times;
                  </button>
                </div>
                
                {/* Info Perusahaan dan Klien */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold mb-2">Dari</h3>
                    {businessInfo.businessName ? (
                      <>
                        <p className="font-medium">{businessInfo.businessName}</p>
                        <p className="text-ios-gray-600">{businessInfo.address || "Alamat tidak tersedia"}</p>
                        <p className="text-ios-gray-600">{businessInfo.email || "Email tidak tersedia"}</p>
                        <p className="text-ios-gray-600">{businessInfo.phone || "Telepon tidak tersedia"}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">Bisnis Anda</p>
                        <p className="text-ios-gray-600 italic">Atur data anda di bagian profil</p>
                      </>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Untuk</h3>
                    <p className="font-medium">{selectedInvoice.client}</p>
                    <p className="text-ios-gray-600">{selectedInvoice.description}</p>
                  </div>
                </div>
                
                {/* Info Invoice */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <div className="mb-4">
                      <h3 className="font-semibold mb-1">Nomor Invoice</h3>
                      <p>INV-{selectedInvoice.id}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Metode Pembayaran</h3>
                      {selectedInvoice.paymentMethod === "transfer" && (
                        <p>Transfer Bank</p>
                      )}
                      {selectedInvoice.paymentMethod === "ewallet" && (
                        <p>Dompet Digital</p>
                      )}
                      {selectedInvoice.paymentMethod === "cash" && (
                        <p>Tunai</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <h3 className="font-semibold mb-1">Tanggal Penerbitan</h3>
                      <p>{formatDate(selectedInvoice.issuedDate)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Jatuh Tempo</h3>
                      <p>{formatDate(selectedInvoice.dueDate)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Detail Item */}
                <div className="mb-8">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-ios-gray-200">
                        <th className="py-2 text-left">Deskripsi</th>
                        <th className="py-2 text-right">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-ios-gray-200">
                        <td className="py-4">{selectedInvoice.description}</td>
                        <td className="py-4 text-right">{selectedInvoice.amount}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="py-4 text-right font-semibold">Total</td>
                        <td className="py-4 text-right font-bold">{selectedInvoice.amount}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                {/* Status */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-2">Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedInvoice.status === "menunggu" 
                      ? "bg-ios-yellow/10 text-ios-yellow" 
                      : selectedInvoice.status === "jatuhTempo" 
                        ? "bg-ios-red/10 text-ios-red" 
                        : "bg-ios-green/10 text-ios-green"
                  }`}>
                    {getStatusText(selectedInvoice.status)}
                  </span>
                  
                  {/* Instruksi pembayaran untuk invoice yang belum dibayar */}
                  {(selectedInvoice.status === "menunggu" || selectedInvoice.status === "jatuhTempo") && selectedInvoice.paymentDetails && (
                    <div className="mt-4 p-4 bg-ios-blue/5 rounded-lg border border-ios-blue/20">
                      <p className="font-medium text-ios-blue mb-2">Harap lakukan pembayaran segera ke:</p>
                      {selectedInvoice.paymentMethod === "transfer" && (
                        <div className="space-y-1">
                          <p><span className="font-medium">Bank:</span> {selectedInvoice.paymentDetails.bankOption === "mandiri" ? "Bank Mandiri" : 
                                                                      selectedInvoice.paymentDetails.bankOption === "bri" ? "Bank Rakyat Indonesia (BRI)" : 
                                                                      selectedInvoice.paymentDetails.bankOption === "bca" ? "Bank Central Asia (BCA)" : 
                                                                      selectedInvoice.paymentDetails.bankOption === "bni" ? "Bank Negara Indonesia (BNI)" : 
                                                                      selectedInvoice.paymentDetails.bankOption === "btn" ? "Bank Tabungan Negara (BTN)" : 
                                                                      selectedInvoice.paymentDetails.bankOption === "cimb" ? "Bank CIMB Niaga" : 
                                                                      selectedInvoice.paymentDetails.bankOption === "bsi" ? "Bank Syariah Indonesia (BSI)" : 
                                                                      selectedInvoice.paymentDetails.bankOption === "ocbc" ? "Bank OCBC NISP" : 
                                                                      selectedInvoice.paymentDetails.bankOption === "panin" ? "Bank Pan Indonesia (Bank Panin)" : 
                                                                      selectedInvoice.paymentDetails.bankOption === "danamon" ? "Bank Danamon Indonesia" : 
                                                                      "Bank Lainnya"}</p>
                          <p><span className="font-medium">Nama Bank:</span> {selectedInvoice.paymentDetails.details.bankName}</p>
                          <p><span className="font-medium">Atas Nama:</span> {selectedInvoice.paymentDetails.details.accountHolder}</p>
                          <p><span className="font-medium">Nomor Rekening:</span> {selectedInvoice.paymentDetails.details.accountNumber}</p>
                        </div>
                      )}
                      {selectedInvoice.paymentMethod === "ewallet" && (
                        <div className="space-y-1">
                          <p><span className="font-medium">E-Wallet:</span> {selectedInvoice.paymentDetails.walletOption === "dana" ? "Dana" : 
                                                                          selectedInvoice.paymentDetails.walletOption === "ovo" ? "OVO" : 
                                                                          selectedInvoice.paymentDetails.walletOption === "gopay" ? "Gopay" : 
                                                                          selectedInvoice.paymentDetails.walletOption === "shopeepay" ? "Shopee Pay" : 
                                                                          "E-Wallet Lainnya"}</p>
                          <p><span className="font-medium">Nama E-Wallet:</span> {selectedInvoice.paymentDetails.details.walletName}</p>
                          <p><span className="font-medium">Atas Nama:</span> {selectedInvoice.paymentDetails.details.accountHolder}</p>
                          <p><span className="font-medium">Nomor Telepon:</span> {selectedInvoice.paymentDetails.details.phoneNumber}</p>
                        </div>
                      )}
                      {selectedInvoice.paymentMethod === "cash" && (
                        <p>Pembayaran tunai akan dilakukan secara langsung.</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Catatan */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-2">Catatan</h3>
                  <p className="text-ios-gray-600">Terima kasih atas kerjasamanya. Mohon lakukan pembayaran sesuai dengan tenggat waktu yang telah ditentukan.</p>
                </div>
                
                {/* Tombol Aksi */}
                <div className="flex justify-end gap-4">
                  <Button 
                    variant="outline"
                    onClick={closeModal}
                  >
                    Tutup
                  </Button>
                  <Button
                    onClick={() => {
                      // Download invoice
                      const invoiceData = `
INVOICE #${selectedInvoice.id}
--------------------
Klien: ${selectedInvoice.client}
Deskripsi: ${selectedInvoice.description}
Jumlah: ${selectedInvoice.amount}
Jatuh Tempo: ${formatDate(selectedInvoice.dueDate)}
Status: ${getStatusText(selectedInvoice.status)}
Metode Pembayaran: ${selectedInvoice.paymentMethod || "Transfer Bank"}
Tanggal Penerbitan: ${formatDate(selectedInvoice.issuedDate)}
                      `;
                      
                      const blob = new Blob([invoiceData], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `invoice-${selectedInvoice.id}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Unduh Invoice
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Search dan Filter */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-ios-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari permintaan..."
              className="pl-10"
            />
          </div>
          <div className="flex overflow-x-auto pb-2 gap-2">
            <Button
              size="sm"
              variant={filter === "all" ? "primary" : "outline"}
              onClick={() => setFilter("all")}
            >
              Semua
            </Button>
            <Button
              size="sm"
              variant={filter === "menunggu" ? "primary" : "outline"}
              onClick={() => setFilter("menunggu")}
            >
              Menunggu
            </Button>
            <Button
              size="sm"
              variant={filter === "jatuhTempo" ? "primary" : "outline"}
              onClick={() => setFilter("jatuhTempo")}
            >
              Jatuh Tempo
            </Button>
            <Button
              size="sm"
              variant={filter === "dibayar" ? "primary" : "outline"}
              onClick={() => setFilter("dibayar")}
            >
              Dibayar
            </Button>
          </div>
        </div>

        {/* Invoices List */}
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-ios-gray-600">Tidak ada permintaan ditemukan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="overflow-hidden">
                <div className={`h-1 w-full ${
                  invoice.status === "menunggu" ? "bg-ios-yellow" :
                  invoice.status === "jatuhTempo" ? "bg-ios-red" :
                  invoice.status === "dibayar" ? "bg-ios-green" :
                  "bg-ios-gray-300"
                }`} />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{invoice.client}</h3>
                      <p className="text-sm text-ios-gray-600">{invoice.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(invoice.status)}`}>
                          {getStatusText(invoice.status)}
                        </span>
                        <span className="text-xs text-ios-gray-600">
                          Jatuh tempo: {invoice.dueDate || "-"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{invoice.amount}</p>
                      <div className="flex mt-2 justify-end gap-1">
                        <button 
                          className="p-1.5 rounded-full text-ios-gray-600 hover:bg-ios-gray-100"
                          onClick={() => {
                            // Implementasi download invoice
                            const invoiceData = `
Permintaan Pembayaran
--------------------
Klien: ${invoice.client}
Deskripsi: ${invoice.description}
Jumlah: ${invoice.amount}
Jatuh Tempo: ${invoice.dueDate || "-"}
Status: ${getStatusText(invoice.status)}
Metode Pembayaran: ${invoice.paymentMethod}
Tanggal Penerbitan: ${invoice.issuedDate}
                            `;
                            
                            const blob = new Blob([invoiceData], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `invoice-${invoice.id}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          title="Unduh invoice"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1.5 rounded-full text-ios-gray-600 hover:bg-ios-gray-100"
                          onClick={() => {
                            // Implementasi share invoice
                            if (navigator.share) {
                              navigator.share({
                                title: `Invoice untuk ${invoice.client}`,
                                text: `Permintaan pembayaran untuk ${invoice.client} sebesar ${invoice.amount}`,
                                url: window.location.href,
                              })
                              .catch((error) => console.log('Error sharing', error));
                            } else {
                              alert('Fitur berbagi tidak didukung di browser ini');
                            }
                          }}
                          title="Bagikan invoice"
                        >
                          <Share className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1.5 rounded-full text-ios-gray-600 hover:bg-ios-gray-100"
                          onClick={() => {
                            // Implementasi preview invoice detail
                            setSelectedInvoice(invoice);
                            setShowInvoiceModal(true);
                          }}
                          title="Lihat detail invoice"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
