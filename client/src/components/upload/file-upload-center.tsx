import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Clock, 
  DollarSign, 
  Wifi, 
  Upload, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface UploadType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

const uploadTypes: UploadType[] = [
  {
    id: "employee-master",
    name: "Employee Master Data",
    description: "Upload employee records CSV",
    icon: FileText,
  },
  {
    id: "attendance",
    name: "Attendance Logs",
    description: "Upload attendance records",
    icon: Clock,
  },
  {
    id: "salary",
    name: "Salary History",
    description: "Upload payroll data",
    icon: DollarSign,
  },
  {
    id: "wifi",
    name: "Wi-Fi Session Logs",
    description: "Upload network activity",
    icon: Wifi,
  },
];

export function FileUploadCenter() {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await apiRequest("POST", `/api/upload/${type}`, formData);
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "File uploaded successfully",
        description: `${variables.file.name} is being processed`,
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/file-uploads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/anomalies"] });
    },
    onError: (error, variables) => {
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
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
      
      // Reset progress
      setUploadProgress(prev => ({
        ...prev,
        [variables.type]: 0,
      }));
    },
  });

  const handleFileUpload = (type: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.multiple = false;
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.name.endsWith(".csv")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      // Start upload
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));
      uploadMutation.mutate({ file, type });
    };
    
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {uploadTypes.map((uploadType) => {
          const Icon = uploadType.icon;
          const isUploading = uploadMutation.isPending;
          
          return (
            <Card 
              key={uploadType.id}
              className="border-2 border-dashed border-gray-300 hover:border-primary-500 transition-colors cursor-pointer group"
              onClick={() => !isUploading && handleFileUpload(uploadType.id)}
            >
              <CardContent className="p-6 text-center">
                <Icon className="h-8 w-8 text-gray-400 group-hover:text-primary-500 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {uploadType.name}
                </h3>
                <p className="text-xs text-gray-500">{uploadType.description}</p>
                
                {uploadProgress[uploadType.id] > 0 && (
                  <div className="mt-3">
                    <Progress value={uploadProgress[uploadType.id]} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upload Status */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Processing Status</span>
            <span className="text-sm text-gray-500">Ready for analysis</span>
          </div>
          <Progress value={75} className="mb-2" />
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-success-600 mr-1" />
            Data uploaded and ready for AI analysis
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
