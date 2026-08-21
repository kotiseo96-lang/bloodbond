"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "@/lib/next-router-compat";
import { useAuth } from "@/src/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Modal } from "@/src/components/ui/modal";
import { z } from "zod";

/* ---------------- VALIDATION ---------------- */

const donorSignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10),
  city: z.string().min(1),
  area: z.string().min(1),
  blood_group: z.string().min(1),
  last_donation_date: z.string().optional(),
  occupation: z.string().min(1),
  mode_of_transport: z.string().min(1),
});

/* ---------------- COMPONENT ---------------- */

const DonorSignup: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    area: "",
    blood_group: "",
    last_donation_date: "",
    occupation: "",
    mode_of_transport: "",
  });

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = donorSignupSchema.safeParse(form);

      if (!validation.success) {
        throw new Error(validation.error.errors[0].message);
      }

      /* STEP 1: SIGNUP */
      const { error: signUpError } = await signUp(
        form.email,
        form.password,
        form.name,
        "donor",
      );

      if (signUpError) throw signUpError;

      /* STEP 2: GET AUTH USER (FIXED) */
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      const user = authData?.user;

      if (authError || !user) {
        throw new Error("User creation failed or session not ready");
      }

      // handle_new_user() already made profiles, user_wallets,
      // user_roles('donor') and the donors row — only fill in the rest.
      await supabase
        .from("donors")
        .update({
          name,
          phone,
          city,
          area,
          blood_group,
          last_donation_date: form.last_donation_date || null,
          occupation,
          mode_of_transport,
        })
        .eq("user_id", user.id);

      /* STEP 5: PROFILE */
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: form.email,
          full_name: form.name,
          phone: form.phone,
        },
        {
          onConflict: "id",
        },
      );

      if (profileError) throw profileError;

      setModal({
        isOpen: true,
        title: "Success",
        message: "Account created successfully",
        type: "success",
      });

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err: any) {
      setModal({
        isOpen: true,
        title: "Error",
        message: err.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-xl">
        {/* FORM */}
        <Card>
          <CardHeader>
            <CardTitle>Create Donor Account</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              {step === 1 && (
                <>
                  <Input
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />

                  <Input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />

                  <Input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <Input
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />

                  <Input
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />

                  <Input
                    placeholder="Area"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <select
                    value={form.blood_group}
                    onChange={(e) =>
                      setForm({ ...form, blood_group: e.target.value })
                    }
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Last Donation Date
                    </label>

                    <Input
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      value={form.last_donation_date}
                      onChange={(e) =>
                        setForm({ ...form, last_donation_date: e.target.value })
                      }
                    />
                  </div>

                  <Input
                    placeholder="Occupation"
                    value={form.occupation}
                    onChange={(e) =>
                      setForm({ ...form, occupation: e.target.value })
                    }
                  />
                  <select
                    value={form.mode_of_transport}
                    onChange={(e) =>
                      setForm({ ...form, mode_of_transport: e.target.value })
                    }
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select Mode of Transport</option>
                    <option value="two_wheeler">Two Wheeler</option>
                    <option value="four_wheeler">Four Wheeler</option>
                    <option value="public_transport">Public Transport</option>
                  </select>
                </>
              )}

              <div className="grid grid-cols-2 gap-2">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="w-full col-span-1"
                  >
                    Back
                  </Button>
                )}

                {step < 3 ? (
                  <Button
                    type="button"
                    className={`w-full ${step === 1 ? "col-start-2 col-span-1" : "col-span-1"}`}
                    onClick={() => {
                      try {
                        if (step === 1) {
                          z.object({
                            name: z
                              .string()
                              .min(2, "Name must be at least 2 characters"),
                            email: z.string().email("Invalid email"),
                            password: z
                              .string()
                              .min(6, "Password must be at least 6 characters"),
                          }).parse(form);
                        }

                        if (step === 2) {
                          z.object({
                            phone: z
                              .string()
                              .min(10, "Enter a Valid Phone Number"),
                            city: z
                              .string()
                              .min(
                                2,
                                "City Name must have atleast 2 Characters",
                              ),
                            area: z
                              .string()
                              .min(
                                2,
                                "Area Name must have atleast 2 Characters",
                              ),
                          }).parse(form);
                        }

                        setStep(step + 1);
                      } catch (err: any) {
                        setModal({
                          isOpen: true,
                          title: "Error",
                          message:
                            err.errors?.[0]?.message ||
                            "Please fill required fields",
                          type: "error",
                        });
                      }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="w-full col-span-1"
                    disabled={loading}
                    onClick={() => {
                      try {
                        z.object({
                          blood_group: z
                            .string()
                            .min(1, "Blood group is required"),
                          occupation: z
                            .string()
                            .min(1, "Occupation is required"),
                          mode_of_transport: z
                            .string()
                            .min(1, "Mode of transport is required"),
                        }).parse(form);

                        // if validation passes → manually trigger submit
                        handleSubmit(new Event("submit") as any);
                      } catch (err: any) {
                        setModal({
                          isOpen: true,
                          title: "Error",
                          message:
                            err.errors?.[0]?.message ||
                            "Please fill required fields",
                          type: "error",
                        });
                      }
                    }}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Create Donor Account"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* MODAL */}
        <Modal
          {...modal}
          onClose={() => setModal({ ...modal, isOpen: false })}
        />
      </div>

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Already a Donor?{" "}
          <Button
            variant="link"
            className="p-0"
            onClick={() => navigate("/auth")}
          >
            Go to login
          </Button>
        </p>
      </div>
    </div>
  );
};

export default DonorSignup;
