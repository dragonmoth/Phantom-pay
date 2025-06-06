import { Upload, AlertTriangle, CheckCircle, Brain } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityFeedProps {
  fileUploads?: any[];
  anomalies?: any[];
}

export function ActivityFeed({ fileUploads = [], anomalies = [] }: ActivityFeedProps) {
  // Combine and sort activities by timestamp
  const activities = [
    ...fileUploads.map((upload) => ({
      id: `upload-${upload.id}`,
      type: "upload",
      title: "Data Upload Complete",
      description: `${upload.fileName} processed successfully`,
      icon: upload.status === "completed" ? CheckCircle : Upload,
      iconColor: upload.status === "completed" ? "text-success-600" : "text-primary-600",
      iconBg: upload.status === "completed" ? "bg-success-50" : "bg-primary-50",
      timestamp: new Date(upload.createdAt),
    })),
    ...anomalies.slice(0, 3).map((anomaly) => ({
      id: `anomaly-${anomaly.id}`,
      type: "anomaly",
      title: "Anomaly Detected",
      description: `Employee ID: ${anomaly.employeeId} flagged for review`,
      icon: AlertTriangle,
      iconColor: "text-error-600",
      iconBg: "bg-error-50",
      timestamp: new Date(anomaly.createdAt),
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  // Add a mock AI analysis activity if we have data
  if (activities.length > 0) {
    activities.unshift({
      id: "ai-analysis",
      type: "analysis",
      title: "AI Analysis Started",
      description: `Processing ${fileUploads.length} files with anomaly detection`,
      icon: Brain,
      iconColor: "text-primary-600",
      iconBg: "bg-primary-50",
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    });
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No recent activity</p>
        <p className="text-xs text-gray-400 mt-1">Upload data to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activity.icon;
        return (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`${activity.iconBg} p-2 rounded-full`}>
              <Icon className={`h-4 w-4 ${activity.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.title}
              </p>
              <p className="text-sm text-gray-500">
                {activity.description}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(activity.timestamp)} ago
              </p>
            </div>
          </div>
        );
      })}
      
      <button className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
        View All Activity →
      </button>
    </div>
  );
}
