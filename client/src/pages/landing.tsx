import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, AlertTriangle, DollarSign, Lock, CheckCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-black">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                <Shield className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              <span className="block">Ghost Employee</span>
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Hunter
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              Detect payroll fraud with AI-powered analysis of employee data, attendance patterns, 
              and Wi-Fi sessions to identify ghost employees and protect your organization
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                className="bg-white text-primary-700 hover:bg-gray-50 px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                onClick={() => window.location.href = "/api/login"}
              >
                <Shield className="h-6 w-6 mr-3" />
                Start Hunting Fraud
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-10 py-6 text-lg font-semibold transition-all duration-300"
              >
                <CheckCircle className="h-6 w-6 mr-3" />
                View Demo
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold text-white mb-2">99.8%</div>
                <div className="text-gray-100 font-medium">Detection Accuracy</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold text-white mb-2">$2.3M</div>
                <div className="text-gray-100 font-medium">Average Fraud Detected</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold text-white mb-2">24hrs</div>
                <div className="text-gray-100 font-medium">Implementation Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Advanced Payroll Fraud Detection
            </h2>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto font-medium">
              Leverage AI-powered analytics to identify suspicious patterns and protect your organization from internal fraud
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-xl bg-gray-800 hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-primary-400 to-primary-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Employee Analysis</h3>
                <p className="text-gray-100 leading-relaxed font-medium">
                  Comprehensive analysis of employee master data, attendance patterns, and payroll records
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gray-800 hover:shadow-2xl hover:shadow-success-500/20 transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-success-400 to-success-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Wi-Fi Correlation</h3>
                <p className="text-gray-100 leading-relaxed font-medium">
                  Cross-reference attendance with Wi-Fi session logs to identify ghost employees
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gray-800 hover:shadow-2xl hover:shadow-warning-500/20 transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-warning-400 to-warning-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Anomaly Detection</h3>
                <p className="text-gray-100 leading-relaxed font-medium">
                  AI-powered detection of suspicious patterns and payroll irregularities
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gray-800 hover:shadow-2xl hover:shadow-error-500/20 transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-error-400 to-error-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Cost Savings</h3>
                <p className="text-gray-100 leading-relaxed font-medium">
                  Calculate potential savings by identifying and eliminating fraudulent payroll entries
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="py-24 bg-gray-950">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <Card className="border-0 shadow-2xl bg-gray-800">
            <CardContent className="p-12">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="bg-gradient-to-br from-primary-400 to-primary-500 p-4 rounded-full">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4">Enterprise Security</h3>
                  <p className="text-lg text-gray-100 mb-6 leading-relaxed font-medium">
                    All data is encrypted and processed according to SOC 2 Type II standards. 
                    Your HR data never leaves your secure environment and is protected with bank-grade security.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-success-400 rounded-full"></div>
                      <span className="text-white font-semibold">End-to-end encryption for all data transfers</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-success-400 rounded-full"></div>
                      <span className="text-white font-semibold">Zero-trust security architecture</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-success-400 rounded-full"></div>
                      <span className="text-white font-semibold">GDPR and CCPA compliant data handling</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-success-400 rounded-full"></div>
                      <span className="text-white font-semibold">Regular security audits and penetration testing</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-primary-800 to-primary-900">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Protect Your Organization?
          </h2>
          <p className="text-xl text-gray-100 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Join leading organizations using Ghost Employee Hunter to secure their payroll systems and eliminate fraud
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary-700 hover:bg-gray-50 px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={() => window.location.href = "/api/login"}
            >
              <Lock className="h-5 w-5 mr-2" />
              Get Started Today
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary-700 px-10 py-6 text-lg font-semibold transition-all duration-300"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}