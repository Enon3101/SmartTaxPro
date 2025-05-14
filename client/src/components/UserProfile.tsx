import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxForm, User } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User as UserIcon, FileText, Phone, Mail, Calendar, AlertCircle } from "lucide-react";
import { formatDate } from '@/lib/formatters';

interface UserProfileProps {
  userId: number;
  token?: string;
}

export default function UserProfile({ userId, token }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [taxForms, setTaxForms] = useState<TaxForm[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(`/api/auth/user/${userId}`, {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();
        setUser(userData);

        // Fetch user's tax forms
        const formsResponse = await fetch(`/api/users/${userId}/tax-forms`, {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
        });

        if (!formsResponse.ok) {
          throw new Error("Failed to fetch tax forms");
        }

        const formsData = await formsResponse.json();
        setTaxForms(formsData);
      } catch (error) {
        console.error("Error fetching user profile data:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load user profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, token, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">User not found</h3>
        <p className="text-muted-foreground">The requested user profile could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="tax-forms">Tax Forms ({taxForms.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Personal and account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserIcon size={32} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.username}</p>
                </div>
              </div>

              <div className="grid gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email || "No email provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.phone || "No phone provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined {formatDate(user.createdAt || new Date())}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-forms" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Forms</CardTitle>
              <CardDescription>All tax forms created by this user</CardDescription>
            </CardHeader>
            <CardContent>
              {taxForms.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No tax forms found</h3>
                  <p className="text-sm text-muted-foreground">
                    This user hasn't created any tax forms yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {taxForms.map((form) => (
                    <Card key={form.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {form.formType || "Not specified"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {form.assessmentYear || "No assessment year"}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                form.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : form.status === "filed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {form.status}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(form.updatedAt || new Date())}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}