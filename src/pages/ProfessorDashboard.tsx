import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Chatbot } from "../components/Chatbot";

export default function ProfessorDashboard() {
  const [validatedDocs, setValidatedDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role !== 'professor') {
      navigate("/login");
      return;
    }
    fetchValidated();
  }, []);

  const fetchValidated = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("documents")
      .select("*, users!inner(first_name, major)")
      .eq("status", "validated");
    
    if (error) toast.error("Error fetching documents");
    else setValidatedDocs(data || []);
    setLoading(false);
  };

  const handleSign = async (docId: string) => {
    const { error } = await supabase
      .from("documents")
      .update({ 
        status: "signed", 
        signed_by: localStorage.getItem("user_id"),
        signed_at: new Date().toISOString()
      })
      .eq("id", docId);

    if (error) toast.error("Signing failed");
    else {
      toast.success("Document signed with PAdES-LTV certificate");
      fetchValidated();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="border-b bg-white px-8 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">P</div>
            <h1 className="text-xl font-bold tracking-tight">GNU Professor Workspace</h1>
          </div>
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="text-sm font-medium text-slate-500 hover:text-emerald-600">Logout</button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-8 py-10">
        <header className="mb-10">
          <h2 className="text-3xl font-bold">Digital Signature Vault</h2>
          <p className="mt-2 text-slate-500">Sign validated documents using your university-issued digital certificate.</p>
        </header>

        <div className="grid gap-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading documents...</div>
          ) : validatedDocs.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
              <p className="text-slate-400 font-medium">No documents awaiting signature.</p>
            </div>
          ) : (
            validatedDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-5">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{doc.name}</h3>
                    <p className="text-sm text-slate-500">Student: <span className="font-semibold text-slate-700">{doc.users?.first_name}</span> | Validated by Admin</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleSign(doc.id)}
                    className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
                  >
                    Apply Digital Signature
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Chatbot />
    </div>
  );
}
