
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ios-ui/Card";
import { Search, Filter, Download, Share, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ios-ui/Input";
import { Button } from "@/components/ios-ui/Button";

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [invoices, setInvoices] = useState<any[]>([]);

  // Ambil invoice dari localStorage saat komponen dirender
  useEffect(() => {
    const stored = localStorage.getItem("invoices");
    if (stored) {
      setInvoices(JSON.parse(stored));
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

  return (
    <AppLayout title="Permintaan Pembayaran" activeRoute="invoices">
      <div className="space-y-6">
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
