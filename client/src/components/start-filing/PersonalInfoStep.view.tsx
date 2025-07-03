import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";

// PAN validation schema
const panSchema = z.object({
  pan: z.string()
    .length(10, "PAN must be exactly 10 characters")
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
});

// Personal info schema
const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^(\+?91)?[6-9]\d{9}$/, "Invalid Indian phone number"),
  pan: z.string()
    .length(10, "PAN must be exactly 10 characters")
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoStepProps {
  initialData?: Partial<PersonalInfoFormData>;
  onNext: (data: PersonalInfoFormData) => void;
  onBack?: () => void;
}

// PAN validation utilities
const PAN_ENTITY_TYPES: Record<string, string> = {
  'P': 'Individual',
  'F': 'Firm (Partnership)',
  'C': 'Company',
  'H': 'HUF (Hindu Undivided Family)',
  'A': 'AOP (Association of Persons)',
  'T': 'Trust',
  'B': 'Body of Individuals',
  'L': 'Local Authority',
  'J': 'Artificial Juridical Person',
  'G': 'Government'
};

function validatePAN(pan: string): boolean {
  if (!pan || pan.length !== 10) return false;
  const pattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return pattern.test(pan);
}

function getPANEntityType(pan: string): string | null {
  if (!validatePAN(pan) || pan.length < 4) return null;
  const entityCode = pan.charAt(3);
  return PAN_ENTITY_TYPES[entityCode] || null;
}

export function PersonalInfoStep({ initialData, onNext, onBack }: PersonalInfoStepProps) {
  const [panValidation, setPanValidation] = useState<{
    isValid: boolean;
    entityType: string | null;
    message: string;
  }>({ isValid: false, entityType: null, message: "" });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  const watchedPAN = watch("pan");

  // Validate PAN on change
  React.useEffect(() => {
    if (watchedPAN && watchedPAN.length === 10) {
      const isValidPAN = validatePAN(watchedPAN);
      const entityType = getPANEntityType(watchedPAN);
      
      setPanValidation({
        isValid: isValidPAN,
        entityType,
        message: isValidPAN 
          ? `Valid PAN for ${entityType || 'Unknown entity type'}`
          : "Invalid PAN format"
      });
    } else {
      setPanValidation({ isValid: false, entityType: null, message: "" });
    }
  }, [watchedPAN]);

  const onSubmit = (data: PersonalInfoFormData) => {
    if (panValidation.isValid) {
      onNext(data);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-blue-800">
          Personal Information
        </CardTitle>
        <p className="text-gray-600">
          Please provide your basic personal details for tax filing
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                {...register("fullName")}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* PAN Card Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pan">PAN Number *</Label>
              <Input
                id="pan"
                placeholder="ABCDE1234F"
                {...register("pan")}
                className={`uppercase ${errors.pan ? "border-red-500" : ""}`}
                maxLength={10}
              />
              {errors.pan && (
                <p className="text-sm text-red-500">{errors.pan.message}</p>
              )}
              
              {/* PAN Validation Alert */}
              {watchedPAN && watchedPAN.length === 10 && (
                <Alert className={panValidation.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  {panValidation.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={panValidation.isValid ? "text-green-700" : "text-red-700"}>
                    {panValidation.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Contact & Demographics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="9876543210"
                {...register("phone")}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                {...register("dob")}
                className={errors.dob ? "border-red-500" : ""}
              />
              {errors.dob && (
                <p className="text-sm text-red-500">{errors.dob.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select onValueChange={(value) => register("gender").onChange({ target: { value } })}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="Enter your complete address"
                {...register("address")}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Enter city name"
                  {...register("city")}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="Enter state name"
                  {...register("state")}
                  className={errors.state ? "border-red-500" : ""}
                />
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  placeholder="123456"
                  {...register("pincode")}
                  maxLength={6}
                  className={errors.pincode ? "border-red-500" : ""}
                />
                {errors.pincode && (
                  <p className="text-sm text-red-500">{errors.pincode.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
            )}
            <Button
              type="submit"
              disabled={!isValid || !panValidation.isValid}
              className="ml-auto"
            >
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 
