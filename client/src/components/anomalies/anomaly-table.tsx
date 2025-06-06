import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight } from "lucide-react";

interface AnomalyTableProps {
  anomalies: any[];
  loading: boolean;
}

export function AnomalyTable({ anomalies, loading }: AnomalyTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/anomalies/${id}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Anomaly status has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/anomalies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      
      toast({
        title: "Error",
        description: "Failed to update anomaly status",
        variant: "destructive",
      });
    },
  });

  const getAnomalyTypeColor = (type: string) => {
    switch (type) {
      case "wifi_inconsistency":
        return "bg-error-100 text-error-800";
      case "payroll_irregularity":
        return "bg-warning-100 text-warning-800";
      case "attendance_gap":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatAnomalyType = (type: string) => {
    switch (type) {
      case "wifi_inconsistency":
        return "Wi-Fi Inconsistency";
      case "payroll_irregularity":
        return "Payroll Irregularity";
      case "attendance_gap":
        return "Attendance Gap";
      default:
        return type;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-error-600";
    if (score >= 60) return "text-warning-600";
    return "text-success-600";
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 80) return "bg-error-600";
    if (score >= 60) return "bg-warning-600";
    return "bg-success-600";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!anomalies.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No anomalies detected</h3>
        <p className="text-gray-500">Upload employee data to begin anomaly detection</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="wifi_inconsistency">Wi-Fi Inconsistencies</SelectItem>
            <SelectItem value="payroll_irregularity">Payroll Irregularities</SelectItem>
            <SelectItem value="attendance_gap">Attendance Gaps</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Employee</TableHead>
              <TableHead>Anomaly Type</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anomalies.map((anomaly) => (
              <TableRow key={anomaly.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {anomaly.employee?.firstName?.[0]}{anomaly.employee?.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {anomaly.employee?.firstName} {anomaly.employee?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {anomaly.employeeId}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getAnomalyTypeColor(anomaly.type)}>
                    {formatAnomalyType(anomaly.type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getRiskColor(anomaly.riskScore)}`}>
                      {anomaly.riskScore}%
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getRiskBgColor(anomaly.riskScore)}`}
                        style={{ width: `${anomaly.riskScore}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="text-sm text-gray-900 truncate">
                      {anomaly.description}
                    </div>
                    {anomaly.details && (
                      <div className="text-sm text-gray-500">
                        {anomaly.details.attendanceDays && `${anomaly.details.attendanceDays} attendance days`}
                        {anomaly.details.wifiSessions !== undefined && `, ${anomaly.details.wifiSessions} WiFi sessions`}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={anomaly.status}
                    onValueChange={(value) => 
                      updateStatusMutation.mutate({ id: anomaly.id, status: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="false_positive">False Positive</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {anomalies.length > 10 && (
        <div className="flex items-center justify-between py-4">
          <p className="text-sm text-gray-700">
            Showing 1 to {Math.min(10, anomalies.length)} of {anomalies.length} results
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-primary-600 text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
