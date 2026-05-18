import { useEffect, useState, type FormEvent } from "react";
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
  Calendar,
  MoreVertical,
  Trash2,
  Edit3,
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

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    isDefault: false,
  });
  const [addressActionStatus, setAddressActionStatus] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);
  const [addressActionLoading, setAddressActionLoading] = useState(false);

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

  const handleAddressMenuToggle = (id: string) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  const handleStartEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode || "",
      isDefault: address.isDefault,
    });
    setActiveMenuId(null);
  };

  const handleDeleteAddress = async (address: Address) => {
    if (!window.confirm("Delete this address? This cannot be undone.")) {
      return;
    }

    setAddressActionLoading(true);
    setAddressActionStatus(null);

    try {
      await apiClient.deleteAddress(address.id);
      await loadAddresses();
      setAddressActionStatus({
        message: "Address deleted successfully.",
        variant: "success",
      });
    } catch (error: any) {
      setAddressActionStatus({
        message:
          error?.response?.data?.message ||
          "Unable to delete address. Please try again.",
        variant: "error",
      });
    } finally {
      setAddressActionLoading(false);
      setActiveMenuId(null);
    }
  };

  const handleAddressFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingAddress) return;

    setAddressActionLoading(true);
    setAddressActionStatus(null);

    try {
      await apiClient.updateAddress(editingAddress.id, {
        street: addressForm.street.trim(),
        city: addressForm.city.trim(),
        state: addressForm.state.trim(),
        country: addressForm.country.trim(),
        zipCode: addressForm.zipCode.trim() || undefined,
        isDefault: addressForm.isDefault,
      });
      await loadAddresses();
      setAddressActionStatus({
        message: "Address updated successfully.",
        variant: "success",
      });
      setEditingAddress(null);
    } catch (error: any) {
      setAddressActionStatus({
        message:
          error?.response?.data?.message ||
          "Unable to update address. Please try again.",
        variant: "error",
      });
    } finally {
      setAddressActionLoading(false);
    }
  };

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
        <div className="pt-6">
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

          {addressActionStatus && (
            <div
              className={`mb-6 rounded-2xl px-4 py-3 text-sm ${
                addressActionStatus.variant === "success"
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-rose-100 text-rose-900"
              }`}
            >
              {addressActionStatus.message}
            </div>
          )}

          {addresses && addresses.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <Card
                  key={address.id}
                  className="relative shadow-card hover:shadow-soft transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="absolute top-4 right-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleAddressMenuToggle(address.id)}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {activeMenuId === address.id && (
                        <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-xl">
                          <button
                            type="button"
                            onClick={() => handleStartEditAddress(address)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-slate-900"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(address)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-slate-900"
                          >
                            <Trash2 className="w-4 h-4 text-rose-400" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 pt-4">
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

        {editingAddress && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Edit Address
                  </h3>
                  <p className="text-sm text-slate-500">
                    Update the selected delivery address.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingAddress(null)}
                  className="text-slate-500 hover:text-slate-900"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <form onSubmit={handleAddressFormSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Street Address
                    </label>
                    <Input
                      name="street"
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        City
                      </label>
                      <Input
                        name="city"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        State / Province
                      </label>
                      <Input
                        name="state"
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Country
                      </label>
                      <Input
                        name="country"
                        value={addressForm.country}
                        onChange={(e) =>
                          setAddressForm((prev) => ({
                            ...prev,
                            country: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        ZIP / Postal Code
                      </label>
                      <Input
                        name="zipCode"
                        value={addressForm.zipCode}
                        onChange={(e) =>
                          setAddressForm((prev) => ({
                            ...prev,
                            zipCode: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="isDefaultEdit"
                      name="isDefault"
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) =>
                        setAddressForm((prev) => ({
                          ...prev,
                          isDefault: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="isDefaultEdit"
                      className="text-sm text-slate-700"
                    >
                      Set as default address
                    </label>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={addressActionLoading}
                    >
                      {addressActionLoading ? "Updating..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => setEditingAddress(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
