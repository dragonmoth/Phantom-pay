import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnomalyTable } from "@/components/anomalies/anomaly-table";
import { AnomalyTrendsChart } from "@/components/charts/anomaly-trends-chart";
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { FileUploadCenter } from "@/components/upload/file-upload-center";
import { 
  Upload, 
  AlertTriangle, 
  Users, 
  Shield, 
  DollarSign, 
  TrendingUp,
  CircleAlert
} from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: isAuthenticated,
  });

  const { data: fileUploads, isLoading: fileUploadsLoading } = useQuery({
    queryKey: ["/api/file-uploads"],
    enabled: isAuthenticated,
  });

  const { data: anomalies, isLoading: anomaliesLoading } = useQuery({
    queryKey: ["/api/anomalies"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-100">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const pendingAnomalies = (anomalies as any)?.filter((a: any) => a.status === "pending") || [];

  return (
    <div className="min-h-screen bg-gray-950">
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-100 font-medium">
              Monitor payroll security and review detected anomalies
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-xl bg-gray-800 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-100">Total Employees</p>
                    <p className="text-2xl font-bold text-white">
                      {statsLoading ? "..." : (stats as any)?.totalEmployees || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-primary-400 to-primary-500 p-3 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gray-800 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-100">Flagged Anomalies</p>
                    <p className="text-2xl font-bold text-warning-400">
                      {statsLoading ? "..." : (stats as any)?.flaggedAnomalies || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-warning-400 to-warning-500 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gray-800 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-100">Potential Savings</p>
                    <p className="text-2xl font-bold text-success-400">
                      {statsLoading ? "..." : `$${((stats as any)?.potentialSavings || 0).toLocaleString()}`}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-success-400 to-success-500 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gray-800 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-100">Data Accuracy</p>
                    <p className="text-2xl font-bold text-primary-400">
                      {statsLoading ? "..." : `${(stats as any)?.dataAccuracy || 0}%`}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-primary-400 to-primary-500 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert Banner */}
          {pendingAnomalies.length > 0 && (
            <Alert className="mb-8 border-warning-600 bg-warning-900/20">
              <CircleAlert className="h-4 w-4 text-warning-400" />
              <AlertDescription className="text-warning-100 font-medium">
                <strong>New Anomalies Detected:</strong> {pendingAnomalies.length} employees have been flagged for suspicious payroll activity. Review recommended within 24 hours.
              </AlertDescription>
            </Alert>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Data Upload Section */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl bg-gray-800 border-0">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Upload className="h-5 w-5 text-primary-400 mr-2" />
                    Data Upload Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploadCenter />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <Card className="shadow-xl bg-gray-800 border-0">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityFeed fileUploads={fileUploads as any} anomalies={anomalies as any} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Anomaly Detection Results */}
          <Card className="shadow-xl bg-gray-800 border-0 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-white">
                  <AlertTriangle className="h-5 w-5 text-primary-400 mr-2" />
                  Detected Anomalies
                </CardTitle>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-100 hover:bg-gray-700">
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AnomalyTable anomalies={(anomalies as any) || []} loading={anomaliesLoading} />
            </CardContent>
          </Card>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="shadow-xl bg-gray-800 border-0">
              <CardHeader>
                <CardTitle className="text-white">Anomaly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <AnomalyTrendsChart anomalies={(anomalies as any) || []} />
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gray-800 border-0">
              <CardHeader>
                <CardTitle className="text-white">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <RiskDistributionChart anomalies={(anomalies as any) || []} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}