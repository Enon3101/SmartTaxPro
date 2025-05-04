import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowRight, Upload, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StartFiling = () => {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState("quick-start");
  const [formData, setFormData] = useState({
    pan: "",
    name: "",
    dob: "",
    email: "",
    mobile: "",
    assessmentYear: "2024-25",
    incomeSource: [] as string[],
  });
  
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (source: string) => {
    setFormData(prev => {
      const currentSources = [...prev.incomeSource];
      if (currentSources.includes(source)) {
        return {
          ...prev,
          incomeSource: currentSources.filter(item => item !== source)
        };
      } else {
        return {
          ...prev,
          incomeSource: [...currentSources, source]
        };
      }
    });
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          
          toast({
            title: "File uploaded successfully",
            description: "Your Form 16 has been processed",
          });
          
          // Reset progress after completing
          setTimeout(() => setUploadProgress(null), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  const proceedToNextStep = () => {
    if (!formData.pan || !formData.name || !formData.assessmentYear) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Information saved",
      description: "Proceeding to the next step",
    });
    
    // Would normally redirect to the next step in the tax filing process
    console.log(formData);
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Start Your ITR Filing</h1>
      <p className="text-gray-600 text-center mb-10">Choose how you'd like to begin your tax return</p>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
          <TabsTrigger value="upload-form16">Upload Form 16</TabsTrigger>
          <TabsTrigger value="import-data">Import Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quick-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number <span className="text-red-500">*</span></Label>
                    <Input 
                      id="pan" 
                      type="text" 
                      placeholder="e.g., ABCDE1234F"
                      value={formData.pan} 
                      onChange={(e) => handleInputChange("pan", e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="As per PAN card"
                      value={formData.name} 
                      onChange={(e) => handleInputChange("name", e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input 
                      id="dob" 
                      type="date" 
                      value={formData.dob} 
                      onChange={(e) => handleInputChange("dob", e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="assessmentYear">Assessment Year <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.assessmentYear} 
                      onValueChange={(value) => handleInputChange("assessmentYear", value)}
                    >
                      <SelectTrigger id="assessmentYear">
                        <SelectValue placeholder="Select Assessment Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                        <SelectItem value="2022-23">2022-23</SelectItem>
                        <SelectItem value="2021-22">2021-22</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={formData.email} 
                      onChange={(e) => handleInputChange("email", e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input 
                      id="mobile" 
                      type="tel" 
                      placeholder="10-digit mobile number" 
                      value={formData.mobile} 
                      onChange={(e) => handleInputChange("mobile", e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Sources of Income</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { id: "salary", label: "Salary" },
                      { id: "interest", label: "Interest Income" },
                      { id: "house-property", label: "House Property" },
                      { id: "capital-gains", label: "Capital Gains" },
                      { id: "business", label: "Business/Profession" },
                      { id: "other", label: "Other Sources" }
                    ].map(source => (
                      <div key={source.id} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id={source.id} 
                          className="rounded border-gray-300"
                          checked={formData.incomeSource.includes(source.id)}
                          onChange={() => handleCheckboxChange(source.id)}
                        />
                        <Label htmlFor={source.id} className="cursor-pointer">{source.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full md:w-auto md:ml-auto bg-blue-500 hover:bg-blue-600"
                  onClick={proceedToNextStep}
                >
                  Proceed to Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upload-form16">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Upload Your Form 16</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 mb-6">
                <FileText className="h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-1">Upload Form 16</h3>
                <p className="text-sm text-gray-500 text-center mb-4 max-w-xs">
                  Drag and drop your Form 16 PDF here, or click to browse files
                </p>
                
                <div className="relative">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf"
                    onChange={handleFileUpload}
                  />
                  <Button variant="outline" className="relative">
                    <Upload className="mr-2 h-4 w-4" />
                    Browse Files
                  </Button>
                </div>
                
                {uploadProgress !== null && (
                  <div className="w-full max-w-xs mt-4">
                    <div className="text-sm text-gray-500 flex justify-between mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Automatic Data Extraction</h4>
                    <p className="text-sm text-gray-500">We'll automatically extract data from your Form 16</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Pre-Fill Your Return</h4>
                    <p className="text-sm text-gray-500">Your income and TDS details will be pre-filled</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Fast Processing</h4>
                    <p className="text-sm text-gray-500">Complete your tax filing in minutes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import-data">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Import Data from Tax Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-700 mb-2">Why import data from the Tax Department?</h3>
                  <p className="text-sm text-blue-600">
                    Importing your tax data directly from the Income Tax Department ensures accuracy and saves time.
                    The data includes your income details, TDS, and tax payments already available with the tax department.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="import-pan">PAN Number <span className="text-red-500">*</span></Label>
                    <Input id="import-pan" type="text" placeholder="e.g., ABCDE1234F" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="import-assessment-year">Assessment Year <span className="text-red-500">*</span></Label>
                    <Select defaultValue="2024-25">
                      <SelectTrigger id="import-assessment-year">
                        <SelectValue placeholder="Select Assessment Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                        <SelectItem value="2022-23">2022-23</SelectItem>
                        <SelectItem value="2021-22">2021-22</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500">
                  You'll need to authenticate with the Income Tax Department using your PAN and password.
                  We'll securely redirect you to complete this process.
                </p>
                
                <Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600">
                  Connect to Tax Department <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StartFiling;