import React from 'react';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { authApi } from "../../api/authApi";
import { memberApi } from "../../api/memberApi";

export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  const [profile, setProfile] = useState(user);
  const [summary, setSummary] = useState({ visits: 0, payments: 0, plan: "-" });
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    authApi.me().then((response) => {
      setProfile(response.data.data || response.data);
      reset(response.data.data || response.data);
    });

    memberApi.dashboard().then((response) => {
      setSummary({
        visits: response.data.attendances?.length || 0,
        payments: response.data.payments?.length || 0,
        plan: response.data.subscription?.type || "No active plan",
      });
    });
  }, [reset]);

  const submit = async (data) => {
    try {
      const response = await memberApi.updateProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: data.image,
      });
      const nextProfile = response.data.data || response.data;
      setProfile(nextProfile);
      localStorage.setItem("fitmanager_user", JSON.stringify(nextProfile));
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile.");
    }
  };

  return (
    <div className="page-enter grid gap-7">
      <div><p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Member settings</p><h1 className="mt-2 text-3xl font-black tracking-tight">Profile</h1></div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <form className="panel grid gap-5 p-7" onSubmit={handleSubmit(submit)}>
          <Input label="Name" {...register("name")} />
          <Input label="Email" type="email" {...register("email")} />
          <Input label="Phone" {...register("phone")} />
          <Input label="Profile image URL" {...register("image")} />
          <div className="flex items-center justify-between rounded bg-slate-50 p-4">
            <div><p className="font-black">Password</p><p className="text-sm text-muted">Last changed recently</p></div>
            <button className="text-sm font-black text-primary">Change</button>
          </div>
          <Button variant="secondary" type="submit">Update profile</Button>
        </form>
        <div className="panel grid content-center justify-items-center p-7 text-center">
          <div className="grid h-40 w-40 place-items-center rounded-lg bg-ink text-5xl font-black text-white shadow-2xl">
            {profile?.image ? <img className="h-full w-full rounded-lg object-cover" src={profile.image} alt="Profile" /> : profile?.name?.charAt(0) || "M"}
          </div>
          <h2 className="mt-6 text-xl font-black">{profile?.name || "Member"}</h2>
          <p className="mt-1 text-sm capitalize text-muted">{summary.plan}</p>
          <div className="mt-6 grid w-full grid-cols-2 gap-3">
            <div className="rounded bg-slate-50 p-4"><p className="text-2xl font-black">{summary.visits}</p><p className="text-xs text-muted">Visits</p></div>
            <div className="rounded bg-slate-50 p-4"><p className="text-2xl font-black">{summary.payments}</p><p className="text-xs text-muted">Payments</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
