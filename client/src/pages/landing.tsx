import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Shield, Users, DollarSign, AlertTriangle, Sparkles, Lock, BarChart3 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Ghost Employee Hunter
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 py-24 pt-32">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Shield className="h-20 w-20 text-white drop-shadow-lg" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-300 animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
            Ghost Employee
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Hunter
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-primary-100 dark:text-primary-200 mb-8 max-w-4xl mx-auto font-light">
            AI-Powered Payroll Fraud Detection
          </p>
          <p className="text-lg text-primary-200 dark:text-primary-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Identify ghost employees and payroll fraud through advanced data analysis and machine learning. 
            Protect your organization from internal payroll fraud with enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary-700 hover:bg-gray-50 dark:bg-gray-100 dark:text-primary-800 dark:hover:bg-white px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => window.location.href = "/api/login"}
            >
              <Lock className="h-5 w-5 mr-2" />
              Sign In Securely
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              className="border-white/20 text-white hover:bg-white/10 dark:border-gray-300/20 dark:text-gray-100 dark:hover:bg-white/10 px-10 py-6 text-lg font-semibold backdrop-blur-sm"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              View Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Payroll Fraud Detection
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Leverage AI-powered analytics to identify suspicious patterns and protect your organization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-primary-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Employee Analysis</h3>
                <p className="text-gray-600">
                  Comprehensive analysis of employee master data, attendance patterns, and payroll records
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-success-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-success-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Wi-Fi Correlation</h3>
                <p className="text-gray-600">
                  Cross-reference attendance with Wi-Fi session logs to identify ghost employees
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-warning-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-warning-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Anomaly Detection</h3>
                <p className="text-gray-600">
                  AI-powered detection of suspicious patterns and payroll irregularities
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-error-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-error-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cost Savings</h3>
                <p className="text-gray-600">
                  Calculate potential savings by identifying and eliminating fraudulent payroll entries
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <Shield className="h-8 w-8 text-primary-600 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Enterprise Security</h3>
                  <p className="text-gray-600 mb-4">
                    All data is encrypted and processed according to SOC 2 Type II standards. 
                    Your HR data never leaves your secure environment and is protected with bank-grade security.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• End-to-end encryption for all data transfers</li>
                    <li>• Zero-trust security architecture</li>
                    <li>• GDPR and CCPA compliant data handling</li>
                    <li>• Regular security audits and penetration testing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Protect Your Organization?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join leading organizations using Ghost Employee Hunter to secure their payroll systems
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
            onClick={() => window.location.href = "/api/login"}
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
}
