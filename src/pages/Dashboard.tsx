import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ios-ui/Card";
import { ArrowUpRight, ArrowDownRight, Clock, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    unpaidInvoices: 0,
    paidInvoices: 0,
    totalPending: "Rp 0",
    totalReceived: "Rp 0",
  });

  const [recentActivity, setRecentActivity] = useState([]);

  // Format currency function
  const formatCurrency = (amount) => {
    if (!amount) return "Rp 0";
    
    // If amount is already formatted (starts with Rp), return as is
    if (typeof amount === 'string' && amount.startsWith('Rp')) {
      return amount;
    }
    
    // Otherwise format the number
    const numeric = Number(amount);
    return `Rp ${numeric.toLocaleString('id-ID').replace(/,/g, '.')}`;
  };

  // Load real data from localStorage
  useEffect(() => {
    // Get invoices and receipts from localStorage
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    const receipts = JSON.parse(localStorage.getItem("receipts") || "[]");
    
    // Calculate statistics
    const unpaidInvoices = invoices.filter(inv => inv.status !== "dibayar").length;
    const paidInvoices = invoices.filter(inv => inv.status === "dibayar").length + receipts.length;
    
    // Calculate total amounts
    let totalPending = 0;
    let totalReceived = 0;
    
    invoices.forEach(inv => {
      const amount = Number(inv.amount.replace(/[^0-9]/g, ""));
      if (inv.status !== "dibayar") {
        totalPending += amount;
      } else {
        totalReceived += amount;
      }
    });
    
    receipts.forEach(rec => {
      const amount = Number(rec.amount.replace(/[^0-9]/g, ""));
      totalReceived += amount;
    });
    
    // Update stats
    setStats({
      unpaidInvoices,
      paidInvoices,
      totalPending: formatCurrency(totalPending),
      totalReceived: formatCurrency(totalReceived),
    });
    
    // Combine and sort recent activity
    const combinedActivity = [
      ...invoices.map(inv => ({
        id: inv.id,
        client: inv.client,
        amount: inv.amount,
        status: inv.status === "menunggu" ? "Menunggu" : 
                inv.status === "jatuhTempo" ? "Jatuh Tempo" : "Dibayar",
        date: inv.issuedDate || new Date(inv.id).toLocaleDateString('id-ID'),
        timestamp: inv.id
      })),
      ...receipts.map(rec => ({
        id: rec.id,
        client: rec.client,
        amount: rec.amount,
        status: "Dibayar",
        date: rec.receiptDate || new Date(rec.id).toLocaleDateString('id-ID'),
        timestamp: rec.id
      }))
    ];
    
    // Sort by timestamp (newest first) and take the first 5
    const sortedActivity = combinedActivity
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
    
    setRecentActivity(sortedActivity);
  }, []);

  return (
    <AppLayout title="Dashboard" activeRoute="dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-ios-gray-600">Permintaan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-ios-blue/10 p-2">
                  <ArrowUpRight className="h-4 w-4 text-ios-blue" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">{stats.unpaidInvoices}</div>
                  <div className="text-xs text-ios-gray-600">belum dibayar</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-ios-gray-600">Penerimaan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-ios-green/10 p-2">
                  <ArrowDownRight className="h-4 w-4 text-ios-green" />
                </div>
                <div>
                  <div className="text-2xl font-semibold">{stats.paidInvoices}</div>
                  <div className="text-xs text-ios-gray-600">telah dibayar</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-ios-gray-600">Menunggu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-ios-yellow/10 p-2">
                  <Clock className="h-4 w-4 text-ios-yellow" />
                </div>
                <div>
                  <div className="text-lg font-semibold">{stats.totalPending}</div>
                  <div className="text-xs text-ios-gray-600">total tagihan</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-ios-gray-600">Diterima</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-ios-green/10 p-2">
                  <TrendingUp className="h-4 w-4 text-ios-green" />
                </div>
                <div>
                  <div className="text-lg font-semibold">{stats.totalReceived}</div>
                  <div className="text-xs text-ios-gray-600">total penerimaan</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-ios-gray-200 pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{item.client}</div>
                      <div className="text-sm text-ios-gray-600">{item.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.amount}</div>
                      <div className={`text-sm ${
                        item.status === "Dibayar" 
                          ? "text-ios-green" 
                          : item.status === "Jatuh Tempo" 
                            ? "text-ios-red" 
                            : "text-ios-yellow"
                      }`}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-ios-gray-600">Belum ada aktivitas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
