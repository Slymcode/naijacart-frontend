import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth, useFetch, useForm } from "@/hooks";
import { apiClient } from "@/api/client";
import type { User, Address } from "@/types";
import {
  Mail,
  MapPin,
  Edit2,
  User as UserIcon,
  Phone,
  Calendar,
} from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, hasCheckedAuth } = useAuth();
  const { data: addresses, execute: loadAddresses } = useFetch<Address[]>(
    () => apiClient.getUserAddresses(),
    { immediate: false },
  );
  const {
    data: profile,
    execute: loadProfile,
    isLoading: profileLoading,
  } = useFetch<User>(() => apiClient.getUserProfile(), { immediate: false });

  const { values, handleChange, handleSubmit, isSubmitting, setValues } =
    useForm(
      {
        firstName: "",
        lastName: "",
        phone: "",
      },
      async (values) => {
        await apiClient.updateProfile(values);
        await loadProfile();
      },
    );

  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated) {
      window.location.href =
        "/signin?redirect=" +
        encodeURIComponent(window.location.pathname + window.location.search);
      return;
    }
    if (isAuthenticated) {
      loadProfile();
      loadAddresses();
    }
  }, [hasCheckedAuth, isAuthenticated, loadProfile, loadAddresses]);

  useEffect(() => {
    if (profile) {
      setValues({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  if (!hasCheckedAuth || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md shadow-card text-center">
          <CardContent className="pt-8 pb-8">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
          <p className="text-slate-600">Manage your account information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <Edit2 className="w-5 h-5 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First Name
                      </label>
                      <Input
                        type="text"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{user?.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-base"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* User Status Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Account Type</p>
                  <Badge variant="secondary" className="text-sm capitalize">
                    {user?.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </p>
                  <p className="font-medium text-slate-900">Today</p>
                </div>
                {user?.role === "CUSTOMER" && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      (window.location.href = "/affiliate/register")
                    }
                  >
                    Become an Affiliate
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Addresses */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                My Addresses
              </h2>
              <p className="text-slate-600 mt-1">
                Manage your delivery addresses
              </p>
            </div>
            <Button
              onClick={() => (window.location.href = "/profile/add-address")}
              className="h-11"
            >
              Add Address
            </Button>
          </div>

          {addresses && addresses.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <Card
                  key={address.id}
                  className="shadow-card hover:shadow-soft transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 mb-1">
                          {address.street}
                        </p>
                        <p className="text-slate-600 text-sm">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-slate-600 text-sm">
                          {address.country}
                        </p>
                        {address.isDefault && (
                          <Badge variant="default" className="mt-3 text-xs">
                            Default Address
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-card">
              <CardContent className="pt-12 pb-12 text-center">
                <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No addresses added yet
                </h3>
                <p className="text-slate-600 mb-6">
                  Add your delivery addresses to make checkout faster
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    (window.location.href = "/profile/add-address")
                  }
                >
                  Add Your First Address
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
