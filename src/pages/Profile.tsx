import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Grid, User as UserIcon, PieChart, ShoppingBag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useSalesData, usePurchasesData } from "@/hooks/useSalesData";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileBio } from "@/components/profile/ProfileBio";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileCollections } from "@/components/profile/ProfileCollections";
import { LoadingState } from "@/components/collection/LoadingState";
import { SalesAnalytics } from "@/components/profile/SalesAnalytics";
import { format } from "date-fns";

const Profile = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const { data: profile, isLoading: profileLoading, error } = useProfile();
  const { data: sales = [], isLoading: salesLoading } = useSalesData();
  const { data: purchases = [], isLoading: purchasesLoading } = usePurchasesData();

  if (error?.message === "Unauthorized. Неверный токен.") {
    localStorage.setItem('auth_error', 'true');
    logout();
    navigate("/auth");
    return null;
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const isLoading = profileLoading || salesLoading || purchasesLoading;

  if (isLoading || !profile) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl animate-fade-in">
      <Tabs defaultValue="profile" className="space-y-8">
        <div className="flex items-center justify-between">
          <TabsList className="w-full flex-col sm:flex-row">
            <TabsTrigger value="profile" onClick={() => setActiveTab("profile")} className="flex-1">
              <UserIcon className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            {profile.role === 'partner' && (
              <>
                <TabsTrigger value="collections" onClick={() => setActiveTab("collections")} className="flex-1">
                  <Grid className="w-4 h-4 mr-2" />
                  My Collections
                </TabsTrigger>
                <TabsTrigger value="sales" onClick={() => setActiveTab("sales")} className="flex-1">
                  <PieChart className="w-4 h-4 mr-2" />
                  Sales
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="purchases" onClick={() => setActiveTab("purchases")} className="flex-1">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Purchases
            </TabsTrigger>
            <TabsTrigger value="settings" onClick={() => setActiveTab("settings")} className="flex-1">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-8">
          <div className="glass-card rounded-lg p-6 animate-fade-in">
            <ProfileHeader profile={profile} />
            <ProfileBio profile={profile} />
          </div>
          {profile.role === 'partner' && (
            <div className="glass-card rounded-lg p-6 animate-fade-in">
              <h3 className="text-xl font-semibold mb-6">Recent Collections</h3>
              <ProfileCollections limit={3} />
            </div>
          )}
        </TabsContent>

        {profile.role === 'partner' && (
          <>
            <TabsContent value="collections">
              <div className="glass-card rounded-lg p-6 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">My Collections</h2>
                <ProfileCollections />
              </div>
            </TabsContent>

            <TabsContent value="sales">
              <div className="animate-fade-in space-y-6">
                <SalesAnalytics sales={sales} purchases={purchases} />
                <div className="glass-card rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Sales History</h2>
                  {sales.length > 0 ? (
                    <div className="space-y-4">
                      {sales.map((sale) => (
                        <div key={sale.id} className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                          <div>
                            <p className="font-medium">
                              {sale.metadata?.name || 'Unnamed Token'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Sold on {sale.sold_at ? format(new Date(sale.sold_at), 'PP') : 'Unknown date'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${sale.price || 0}</p>
                            <p className="text-sm text-muted-foreground">{sale.chain}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center">No sales yet</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </>
        )}

        <TabsContent value="purchases">
          <div className="glass-card rounded-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Purchase History</h2>
            {purchases.length > 0 ? (
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {purchase.metadata?.name || 'Unnamed Token'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Purchased on {purchase.purchased_at ? format(new Date(purchase.purchased_at), 'PP') : 'Unknown date'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${purchase.price || 0}</p>
                      <p className="text-sm text-muted-foreground">{purchase.chain}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center">No purchases yet</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="glass-card rounded-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <ProfileForm profile={profile} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
