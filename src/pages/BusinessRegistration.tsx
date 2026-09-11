import { useState } from 'react';
import {
  Search, FileCheck, CreditCard, CheckCircle2, Circle,
  Loader2, ShieldCheck, Clock, Upload, ExternalLink, Info,
} from 'lucide-react';
import { useBusinessData } from '../context/BusinessDataContext';
import { formatNaira } from '../utils/currency';

const CAC_GOV_FEE = 10000;
const SERVICE_FEE = 3500;

// ⚠️ PLACEHOLDER — replace with Husslewise's real business bank account
// before this goes live. This is who the CUSTOMER pays, not their own account.
const HUSSLEWISE_BANK = {
  bankName: 'GTBank',
  accountName: 'Husslewise Ltd',
  accountNumber: '0123456789',
};

export default function BusinessRegistration() {
  const { registration, submitRegistration } = useBusinessData();
  const [step, setStep] = useState(1);
  const [checkingName, setCheckingName] = useState(false);
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [form, setForm] = useState({
    businessName: '',
    businessType: 'Sole Proprietor',
    ownerFullName: '',
    ownerNIN: '',
    documentsConfirmed: false,
  });

  const [proofFile, setProofFile] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState('');

  const inputClass =
    'w-full font-body text-sm px-4 py-3 rounded-lg border border-brand-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40';
  const labelClass = 'block font-body text-xs font-bold text-brand-ink/70 mb-1.5';

  const handleCheckName = () => {
    if (!form.businessName.trim()) return;
    setCheckingName(true);
    setNameAvailable(null);
    setTimeout(() => {
      setCheckingName(false);
      setNameAvailable(true);
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setProofFile(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!proofFile) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await submitRegistration({
        businessName: form.businessName,
        businessType: form.businessType,
        ownerFullName: form.ownerFullName,
        ownerNIN: form.ownerNIN,
        documentsConfirmed: form.documentsConfirmed,
        paymentProof: proofFile,
      });
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong submitting your registration.');
    } finally {
      setSubmitting(false);
    }
  };

  const EducationSidebar = () => (
    <div className="bg-white rounded-2xl border border-brand-primary/10 p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Info size={16} className="text-brand-primary" />
        <h3 className="font-headline font-bold text-brand-ink text-sm">Understanding CAC Registration</h3>
      </div>

      <div>
        <p className="font-body text-xs font-bold text-brand-ink mb-1">What is CAC?</p>
        <p className="font-body text-xs text-brand-ink/60 leading-relaxed">
          The Corporate Affairs Commission is the Nigerian government body responsible for registering
          and regulating all businesses. Registering gives your business a legal identity — separate
          from you personally — and an official RC or BN number.
        </p>
      </div>

      <div>
        <p className="font-body text-xs font-bold text-brand-ink mb-1">Sole Proprietor</p>
        <p className="font-body text-xs text-brand-ink/60 leading-relaxed">
          The simplest structure — just you, trading under a business name. Fastest and cheapest to
          register, but you're personally liable for business debts.
        </p>
      </div>

      <div>
        <p className="font-body text-xs font-bold text-brand-ink mb-1">Partnership</p>
        <p className="font-body text-xs text-brand-ink/60 leading-relaxed">
          Two or more people running the business together, sharing profits and liability based on
          an agreement between them.
        </p>
      </div>

      <div>
        <p className="font-body text-xs font-bold text-brand-ink mb-1">Limited Liability Company (Ltd)</p>
        <p className="font-body text-xs text-brand-ink/60 leading-relaxed">
          A separate legal entity from its owners — your personal assets are protected if the
          business runs into debt. More paperwork, but the standard choice as a business grows.
        </p>
      </div>

      <div>
        <p className="font-body text-xs font-bold text-brand-ink mb-1">How processing works</p>
        <p className="font-body text-xs text-brand-ink/60 leading-relaxed">
          After you submit, our team manually reviews your documents, files your application with
          CAC, and updates your status here as it progresses. Typical turnaround is 7–10 business days.
        </p>
      </div>

      
        <a href="https://search.cac.gov.ng"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 font-body text-xs font-bold text-brand-primary border border-brand-primary/20 rounded-lg px-4 py-2.5 hover:bg-brand-bg/20 transition"
      >
        Check the free official CAC portal <ExternalLink size={13} />
      </a>
    </div>
  );

  if (registration) {
    const stages: { key: string; label: string; desc: string }[] = [
      { key: 'submitted', label: 'Application Submitted', desc: 'We received your details and payment.' },
      { key: 'in_review', label: 'Document Review', desc: 'Our team verifies your documents (1–2 business days).' },
      { key: 'filed', label: 'Filed with CAC', desc: 'Application submitted to the Corporate Affairs Commission (3–5 business days).' },
      { key: 'approved', label: 'Approved', desc: 'Your business is officially registered.' },
    ];
    const stageOrder = ['submitted', 'in_review', 'filed', 'approved'];
    const currentIndex = stageOrder.indexOf(registration.status);

    return (
      <div>
        <div className="mb-8">
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">Business Registration</h1>
          <p className="font-body text-sm text-brand-ink/60">Tracking your CAC registration for {registration.businessName}.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-primary/10 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center">
                    <ShieldCheck size={22} className="text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-headline font-bold text-brand-ink">{registration.businessName}</p>
                    <p className="font-body text-xs text-brand-ink/50">{registration.businessType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-brand-bg/40 rounded-lg px-4 py-2">
                  <Clock size={14} className="text-brand-primary" />
                  <span className="font-body text-xs font-bold text-brand-ink">
                    Est. completion: {registration.estimatedCompletionDate}
                  </span>
                </div>
              </div>

              <div className="space-y-0">
                {stages.map((stage, i) => {
                  const isDone = i < currentIndex || registration.status === 'approved';
                  const isCurrent = i === currentIndex && registration.status !== 'approved';
                  return (
                    <div key={stage.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        {isDone || (isCurrent && i === 0) ? (
                          <CheckCircle2 size={22} className="text-brand-primary shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 size={22} className="text-brand-primary shrink-0 animate-spin" />
                        ) : (
                          <Circle size={22} className="text-brand-primary/20 shrink-0" />
                        )}
                        {i < stages.length - 1 && (
                          <div className={`w-0.5 flex-1 min-h-[32px] ${isDone ? 'bg-brand-primary' : 'bg-brand-primary/15'}`} />
                        )}
                      </div>
                      <div className="pb-8">
                        <p className={`font-body text-sm font-bold ${isDone || isCurrent ? 'text-brand-ink' : 'text-brand-ink/40'}`}>
                          {stage.label}
                        </p>
                        <p className="font-body text-xs text-brand-ink/50 mt-0.5">{stage.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-brand-bg/30 rounded-2xl p-5 border border-brand-primary/10">
              <p className="font-body text-xs text-brand-ink/60">
                Once approved, you'll receive your CAC certificate and RC/BN number by email, and your business
                will get a <span className="font-bold text-brand-ink">Trusted Badge</span> on your Marketplace listing.
              </p>
            </div>
          </div>

          <EducationSidebar />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">Business Registration</h1>
        <p className="font-body text-sm text-brand-ink/60">
          Register your business with CAC — we handle the paperwork, you focus on your hustle.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-xs font-bold shrink-0 ${
                    s < step ? 'bg-brand-primary text-brand-bg' : s === step ? 'bg-brand-accent text-brand-ink' : 'bg-white text-brand-ink/30 border border-brand-primary/20'
                  }`}
                >
                  {s < step ? <CheckCircle2 size={14} /> : s}
                </div>
                {s < 3 && <div className={`h-0.5 flex-1 ${s < step ? 'bg-brand-primary' : 'bg-brand-primary/15'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-primary/10">
            {step === 1 && (
              <div>
                <div className="w-11 h-11 rounded-xl bg-brand-bg flex items-center justify-center mb-4">
                  <Search size={20} className="text-brand-primary" />
                </div>
                <h2 className="font-headline text-xl font-bold text-brand-ink mb-1">Check Business Name</h2>
                <p className="font-body text-sm text-brand-ink/60 mb-6">
                  We'll do a preliminary check — final availability is confirmed when our team files with CAC.
                </p>

                <label className={labelClass}>Proposed Business Name</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => { setForm({ ...form, businessName: e.target.value }); setNameAvailable(null); }}
                    placeholder="e.g. Nkechi Tomatoes Enterprise"
                    className={inputClass}
                  />
                  <button
                    onClick={handleCheckName}
                    disabled={checkingName}
                    className="shrink-0 bg-brand-primary text-brand-bg font-body text-sm font-bold px-5 rounded-lg hover:opacity-90 transition disabled:opacity-60"
                  >
                    {checkingName ? <Loader2 size={16} className="animate-spin" /> : 'Check'}
                  </button>
                </div>

                {nameAvailable && (
                  <p className="flex items-center gap-1.5 font-body text-xs font-bold text-green-600 mb-2">
                    <CheckCircle2 size={14} /> "{form.businessName}" looks available — final check happens during filing
                  </p>
                )}

                
                  <a href="https://search.cac.gov.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-body text-xs text-brand-primary hover:underline mb-4"
                >
                  Double-check yourself on the free official CAC portal <ExternalLink size={11} />
                </a>

                <label className={`${labelClass} mt-4`}>Business Type</label>
                <select
                  value={form.businessType}
                  onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                  className={inputClass}
                >
                  <option>Sole Proprietor</option>
                  <option>Partnership</option>
                  <option>Limited Liability Company</option>
                </select>

                <button
                  onClick={() => setStep(2)}
                  disabled={!nameAvailable}
                  className="w-full bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="w-11 h-11 rounded-xl bg-brand-bg flex items-center justify-center mb-4">
                  <FileCheck size={20} className="text-brand-primary" />
                </div>
                <h2 className="font-headline text-xl font-bold text-brand-ink mb-1">Owner Information & Documents</h2>
                <p className="font-body text-sm text-brand-ink/60 mb-6">
                  Required for CAC filing — have these ready before continuing.
                </p>

                <div className="space-y-4 mb-5">
                  <div>
                    <label className={labelClass}>Full Name (as on ID)</label>
                    <input
                      type="text"
                      value={form.ownerFullName}
                      onChange={(e) => setForm({ ...form, ownerFullName: e.target.value })}
                      placeholder="e.g. Nkechi Okafor"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>NIN (National Identification Number)</label>
                    <input
                      type="text"
                      value={form.ownerNIN}
                      onChange={(e) => setForm({ ...form, ownerNIN: e.target.value })}
                      placeholder="11-digit NIN"
                      maxLength={11}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="bg-brand-bg/30 rounded-xl p-4 mb-5">
                  <p className="font-body text-xs font-bold text-brand-ink mb-3">Have these documents ready:</p>
                  <ul className="font-body text-xs text-brand-ink/70 space-y-1.5 list-disc list-inside">
                    <li>Valid government-issued ID (NIN, Voter's Card, or Passport)</li>
                    <li>Recent passport photograph</li>
                    <li>Proof of address (utility bill, not older than 3 months)</li>
                  </ul>
                </div>

                <label className="flex items-start gap-2.5 font-body text-sm text-brand-ink/70 mb-6">
                  <input
                    type="checkbox"
                    checked={form.documentsConfirmed}
                    onChange={(e) => setForm({ ...form, documentsConfirmed: e.target.checked })}
                    className="mt-0.5 accent-brand-primary"
                  />
                  I confirm I have these documents ready and will provide them when contacted by our registration team.
                </label>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="font-body text-sm font-bold text-brand-ink/60 px-5 py-3 rounded-lg hover:bg-brand-bg/30 transition">
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!form.ownerFullName || !form.ownerNIN || !form.documentsConfirmed}
                    className="flex-1 bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="w-11 h-11 rounded-xl bg-brand-bg flex items-center justify-center mb-4">
                  <CreditCard size={20} className="text-brand-primary" />
                </div>
                <h2 className="font-headline text-xl font-bold text-brand-ink mb-1">Review & Pay</h2>
                <p className="font-body text-sm text-brand-ink/60 mb-6">
                  Here's exactly what you're paying for — no hidden charges.
                </p>

                <div className="bg-brand-bg/30 rounded-xl p-5 mb-5 space-y-3">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-brand-ink/70">CAC Government Filing Fee</span>
                    <span className="font-bold text-brand-ink">{formatNaira(CAC_GOV_FEE)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-brand-ink/70">Husslewise Service Fee</span>
                    <span className="font-bold text-brand-ink">{formatNaira(SERVICE_FEE)}</span>
                  </div>
                  <div className="border-t border-brand-primary/15 pt-3 flex justify-between font-body text-sm font-bold">
                    <span className="text-brand-primary">Total</span>
                    <span className="text-brand-primary">{formatNaira(CAC_GOV_FEE + SERVICE_FEE)}</span>
                  </div>
                </div>

                <div className="bg-brand-bg/20 rounded-xl p-4 mb-5 space-y-2">
                  <p className="font-body text-xs font-bold text-brand-ink/70">Transfer to:</p>
                  <p className="font-body text-sm text-brand-ink">{HUSSLEWISE_BANK.bankName}</p>
                  <p className="font-headline text-lg font-bold text-brand-primary">{HUSSLEWISE_BANK.accountNumber}</p>
                  <p className="font-body text-sm text-brand-ink/70">{HUSSLEWISE_BANK.accountName}</p>

                  <div className="pt-2">
                    <label className={labelClass}>Upload Proof of Payment</label>
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-brand-primary/30 rounded-lg py-4 cursor-pointer hover:bg-white/50 transition">
                      <Upload size={16} className="text-brand-primary" />
                      <span className="font-body text-xs text-brand-ink/60">{proofFileName || 'Choose screenshot'}</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <p className="font-body text-xs text-brand-ink/50 mb-4">
                  We'll confirm your payment against this transfer, then begin filing. Estimated
                  turnaround is <span className="font-bold text-brand-ink">7–10 business days</span> from submission.
                </p>

                {submitError && (
                  <p className="font-body text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{submitError}</p>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} disabled={submitting} className="font-body text-sm font-bold text-brand-ink/60 px-5 py-3 rounded-lg hover:bg-brand-bg/30 transition disabled:opacity-40">
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !proofFile}
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : `Submit Application`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <EducationSidebar />
      </div>
    </div>
  );
}