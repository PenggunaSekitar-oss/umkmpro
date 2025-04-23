
import React from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ios-ui/Card";
import { ArrowUpRight, ArrowDownRight, Clock, TrendingUp } from "lucide-react";

export default function Dashboard() {
  // Mock data for demo purposes
  const stats = {
    unpaidInvoices: 4,
    paidInvoices: 12,
    totalPending: "Rp 7.850.000",
    totalReceived: "Rp 32.400.000",
  };

  // Mock recent activity
  const recentActivity = [
    { id: 1, client: "PT Maju Jaya", amount: "Rp 2.500.000", status: "Dibayar", date: "23 Apr 2025" },
    { id: 2, client: "CV Sentosa", amount: "Rp 1.750.000", status: "Menunggu", date: "21 Apr 2025" },
    { id: 3, client: "Toko Bahagia", amount: "Rp 3.600.000", status: "Dibayar", date: "18 Apr 2025" },
    { id: 4, client: "PT Sukses Abadi", amount: "Rp 2.100.000", status: "Jatuh Tempo", date: "15 Apr 2025" },
  ];

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
              {recentActivity.map((item) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
