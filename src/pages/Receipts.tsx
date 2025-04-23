
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent } from "@/components/ios-ui/Card";
import { Search, Download, Share, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ios-ui/Input";

export default function Receipts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [receipts, setReceipts] = useState<any[]>([]);

  // Ambil receipts dari localStorage ketika komponen dirender
  useEffect(() => {
    const stored = localStorage.getItem("receipts");
    if (stored) {
      setReceipts(JSON.parse(stored));
    } else {
      setReceipts([]);
    }
  }, []);

  // Filter receipts berdasarkan search
  const filteredReceipts = receipts.filter((receipt) => {
    return (receipt.client || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (receipt.description || "").toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <AppLayout title="Penerimaan Pembayaran" activeRoute="receipts">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-ios-gray-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari penerimaan..."
            className="pl-10"
          />
        </div>

        {/* Receipts List */}
        {filteredReceipts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-ios-gray-600">Tidak ada penerimaan ditemukan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReceipts.map((receipt) => (
              <Card key={receipt.id} className="overflow-hidden">
                <div className="h-1 w-full bg-ios-green" />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{receipt.client}</h3>
                      <p className="text-sm text-ios-gray-600">{receipt.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-ios-green/10 text-ios-green">
                          Lunas
                        </span>
                        <span className="text-xs text-ios-gray-600">
                          Tanggal: {receipt.receiptDate || "-"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{receipt.amount}</p>
                      <p className="text-xs text-ios-gray-600 mt-1">{receipt.paymentMethod}</p>
                      <div className="flex mt-2 justify-end gap-1">
                        <button className="p-1.5 rounded-full text-ios-gray-600 hover:bg-ios-gray-100">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded-full text-ios-gray-600 hover:bg-ios-gray-100">
                          <Share className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded-full text-ios-gray-600 hover:bg-ios-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
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
