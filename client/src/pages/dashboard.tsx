import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Navbar } from "@/components/navigation/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileUploadCenter } from "@/components/upload/file-upload-center";
import { AnomalyTable } from "@/components/anomalies/anomaly-table";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { AnomalyTrendsChart } from "@/components/charts/anomaly-trends-chart";
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart";
import { 
  Users, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp,
  CircleAlert,
  Upload
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
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
    retry: false,
  });

  const { data: anomalies, isLoading: anomaliesLoading } = useQuery({
    queryKey: ["/api/anomalies"],
    retry: false,
  });

  const { data: fileUploads } = useQuery({
    queryKey: ["/api/file-uploads"],
    retry: false,
  });

  if (isLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingAnomalies = anomalies?.filter((a: any) => a.status === "pending") || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Payroll Anomaly Detection Dashboard
            </h1>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
              Identify ghost employees and payroll fraud through advanced data analysis and machine learning
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 relative overflow-y-auto">
        {/* Quick Stats */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats?.totalEmployees || 0}
                    </p>
                  </div>
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-success-600 text-sm font-medium">Active</span>
                  <span className="text-gray-600 text-sm ml-2">employees</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Flagged Anomalies</p>
                    <p className="text-3xl font-bold text-error-600">
                      {stats?.flaggedAnomalies || 0}
                    </p>
                  </div>
                  <div className="bg-error-50 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-error-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-error-600 text-sm font-medium">High Priority</span>
                  <span className="text-gray-600 text-sm ml-2">Requires review</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Potential Savings</p>
                    <p className="text-3xl font-bold text-success-600">
                      ${((stats?.potentialSavings || 0) / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="bg-success-50 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-success-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-success-600 text-sm font-medium">Annual</span>
                  <span className="text-gray-600 text-sm ml-2">estimated</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Data Accuracy</p>
                    <p className="text-3xl font-bold text-primary-600">
                      {stats?.dataAccuracy || 0}%
                    </p>
                  </div>
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-success-600 text-sm font-medium">Excellent</span>
                  <span className="text-gray-600 text-sm ml-2">confidence level</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert Banner */}
          {pendingAnomalies.length > 0 && (
            <Alert className="mb-8 border-warning-200 bg-warning-50">
              <CircleAlert className="h-4 w-4 text-warning-600" />
              <AlertDescription className="text-warning-800">
                <strong>New Anomalies Detected:</strong> {pendingAnomalies.length} employees have been flagged for suspicious payroll activity. Review recommended within 24 hours.
              </AlertDescription>
            </Alert>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Data Upload Section */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 text-primary-600 mr-2" />
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
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityFeed fileUploads={fileUploads} anomalies={anomalies} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Anomaly Detection Results */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-primary-600 mr-2" />
                  Detected Anomalies
                </CardTitle>
                <Button variant="outline" size="sm">
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AnomalyTable anomalies={anomalies || []} loading={anomaliesLoading} />
            </CardContent>
          </Card>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Anomaly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <AnomalyTrendsChart anomalies={anomalies || []} />
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <RiskDistributionChart anomalies={anomalies || []} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
