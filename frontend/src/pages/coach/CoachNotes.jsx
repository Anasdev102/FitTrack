import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import { createCoachNote, fetchCoachNotes } from "../../store/slices/coachNotesSlice";

export default function CoachNotes({ memberId }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.coachNotes);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { dispatch(fetchCoachNotes(memberId)); }, [dispatch, memberId]);

  const submit = async (data) => {
    try {
      await dispatch(createCoachNote({ memberId, note: data.note })).unwrap();
      reset({ note: "" });
      toast.success("Note added.");
    } catch (err) {
      toast.error(err || "Could not add note.");
    }
  };

  return (
    <div className="panel p-7">
      <h2 className="text-lg font-black">Coach Notes</h2>
      <form className="mt-5 grid gap-3" onSubmit={handleSubmit(submit)}>
        <textarea className="min-h-28 rounded border border-line px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15" placeholder="Add private coaching note..." {...register("note", { required: true })} />
        <Button className="justify-self-start" disabled={loading}>Add note</Button>
      </form>
      {error && <p className="mt-4 text-sm font-bold text-red-600">{error}</p>}
      <div className="mt-6 grid gap-3">
        {items.map((note) => (
          <div className="rounded border border-line bg-slate-50 p-4" key={note.id}>
            <p className="text-sm leading-7 text-slate-700">{note.note}</p>
            <p className="mt-2 text-xs font-bold text-muted">{note.created_at}</p>
          </div>
        ))}
        {!items.length && <p className="text-sm font-semibold text-muted">No notes yet.</p>}
      </div>
    </div>
  );
}
