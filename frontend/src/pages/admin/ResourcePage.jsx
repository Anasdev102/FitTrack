import React from 'react';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";

export default function ResourcePage({ title, slice, fetchAction, createAction, updateAction, deleteAction, columns, actionLabel, fields = [] }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state[slice]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    dispatch(fetchAction());
  }, [dispatch, fetchAction]);

  const openModal = (item = null) => {
    const defaults = Object.fromEntries(fields.map((field) => [field.name, field.defaultValue || ""]));
    const itemValues = item ? Object.fromEntries(fields.map((field) => {
      const value = field.name === "user_id" ? (item.user_id || item.member?.id) : field.type === "password" ? "" : item[field.name];
      return [field.name, value ?? field.defaultValue ?? ""];
    })) : {};
    reset({ ...defaults, ...itemValues });
    setEditingItem(item);
    setSubmitError("");
    setModalOpen(true);
  };

  const submit = async (data) => {
    if (!createAction && !updateAction) return;
    setSubmitError("");
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value === "" ? null : value])
    );

    try {
      if (editingItem && updateAction) {
        await dispatch(updateAction({ id: editingItem.id, data: cleanedData })).unwrap();
      } else {
        await dispatch(createAction(cleanedData)).unwrap();
      }
      await dispatch(fetchAction());
      toast.success(`${title.slice(0, -1)} saved`);
      setModalOpen(false);
    } catch (err) {
      const message = typeof err === "string" ? err : "Could not save. Check the form fields.";
      setSubmitError(message);
      toast.error(message);
    }
  };

  const removeItem = async (item) => {
    if (!deleteAction) return;
    if (!window.confirm(`Delete this ${title.slice(0, -1).toLowerCase()}?`)) return;
    try {
      await dispatch(deleteAction(item.id)).unwrap();
      await dispatch(fetchAction());
      toast.success(`${title.slice(0, -1)} deleted`);
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not delete.");
    }
  };

  const filteredItems = (items || []).filter((item) => {
    const searchMatch = !search || JSON.stringify(item).toLowerCase().includes(search.toLowerCase());
    const itemStatus = item.status || item.active_subscription?.status;
    const statusMatch = status === "all" || itemStatus === status;
    return searchMatch && statusMatch;
  });

  return (
    <div className="page-enter grid gap-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="section-kicker">Management</p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">{title}</h1>
        </div>
        <Button onClick={() => openModal()}><Plus className="h-4 w-4 " />{actionLabel || `Add ${title.slice(0, -1)}`}</Button>
      </div>
      {error && <div className="rounded border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      <div className="panel flex flex-wrap items-center gap-3 p-4">
        <div className="flex w-full max-w-md items-center gap-2 rounded border border-line bg-white px-4 py-3">
          <Search className="h-4 w-4 text-muted" />
          <input className="w-full bg-transparent text-sm outline-none" placeholder={`Search ${title.toLowerCase()}...`} value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <select className="rounded border border-line bg-white px-4 py-3 text-sm font-bold text-slate-600" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
        {(search || status !== "all") && <button className="rounded px-4 py-3 text-sm font-black uppercase tracking-wide text-primary" type="button" onClick={() => { setSearch(""); setStatus("all"); }}>Clear</button>}
      </div>
      <Table columns={[
        ...columns.filter((column) => column.key !== "actions"),
        {
          key: "actions",
          label: "Actions",
          render: (row) => (
            <div className="flex gap-3">
              {updateAction && <button className="font-black text-primary" type="button" onClick={() => openModal(row)}>Edit</button>}
              {deleteAction && <button className="font-black text-red-600" type="button" onClick={() => removeItem(row)}>Delete</button>}
            </div>
          ),
        },
      ]} rows={filteredItems} />
      {loading && <p className="text-center text-sm font-bold text-muted">Loading...</p>}
      <div className="flex justify-center gap-2">
        {[1, 2, 3].map((page) => <button className={`h-9 w-9 rounded text-sm font-bold ${page === 1 ? "bg-primary text-white" : "border border-line bg-white text-muted"}`} key={page}>{page}</button>)}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-4">
          <form className="panel flex max-h-[90vh] w-[95vw] max-w-4xl flex-col overflow-hidden sm:w-[90vw] lg:w-full" onSubmit={handleSubmit(submit)}>
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line p-5 sm:p-7">
              <div>
                <p className="section-kicker">Create record</p>
                <h2 className="mt-2 text-2xl font-black uppercase">{editingItem ? `Edit ${title.slice(0, -1)}` : actionLabel || `Add ${title.slice(0, -1)}`}</h2>
              </div>
              <button className="grid h-10 w-10 place-items-center rounded bg-slate-100 text-slate-500" type="button" onClick={() => setModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:max-h-[70vh] sm:p-7">
              {submitError && <div className="mb-5 rounded border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{submitError}</div>}
              <div className="grid gap-4 md:grid-cols-2">
                {fields.map((field) => (
                  <label className="grid gap-2 text-xs font-bold text-slate-700" key={field.name}>
                    {field.label}
                    {field.type === "select" ? (
                      <select className="premium-input rounded px-3.5 py-3 text-sm" {...register(field.name)}>
                        {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea className="min-h-28 rounded border border-line px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15" {...register(field.name)} />
                    ) : (
                      <input className="premium-input rounded px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15" type={field.type || "text"} {...register(field.name)} />
                    )}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 justify-end gap-3 border-t border-line bg-white p-4 sm:p-5">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
