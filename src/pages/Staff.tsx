import { useState } from 'react';
import { Plus, Users, Shield, Ban, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { useBusinessData } from '../context/BusinessDataContext';
import { ROLE_PERMISSIONS, type StaffRole } from '../types';
import Modal from '../components/Modal';
import AddStaffForm from '../components/AddStaffForm';

const roleStyles: Record<StaffRole, string> = {
  admin: 'bg-brand-primary text-brand-bg',
  manager: 'bg-brand-accent text-brand-ink',
  cashier: 'bg-brand-bg/60 text-brand-ink',
};

export default function Staff() {
  const { staff, updateStaffRole, toggleStaffStatus, removeStaffMember } = useBusinessData();
  const [showModal, setShowModal] = useState(false);
  const [viewingPermissionsFor, setViewingPermissionsFor] = useState<string | null>(null);

  const activeCount = staff.filter((s) => s.status === 'active').length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">
            Staff & Permissions
          </h1>
          <p className="font-body text-sm text-brand-ink/60">
            Add team members and control what they can access.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-brand-primary text-brand-bg font-body text-sm font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition"
        >
          <Plus size={16} /> Add Staff
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-brand-bg flex items-center justify-center">
            <Users size={20} className="text-brand-primary" />
          </div>
          <div>
            <p className="font-body text-xs text-brand-ink/60">Total Staff</p>
            <p className="font-headline text-xl font-extrabold text-brand-ink">{staff.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={20} className="text-green-600" />
          </div>
          <div>
            <p className="font-body text-xs text-brand-ink/60">Active</p>
            <p className="font-headline text-xl font-extrabold text-brand-ink">{activeCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-primary/10 overflow-hidden">
        <div className="divide-y divide-brand-primary/5">
          {staff.map((member) => (
            <div key={member.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center font-body text-sm font-bold text-brand-primary shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-body font-bold text-brand-ink">{member.name}</p>
                      <span className={`font-body text-xs font-bold px-2 py-0.5 rounded-full capitalize ${roleStyles[member.role]}`}>
                        {member.role}
                      </span>
                      {member.status === 'pending' && (
                        <span className="flex items-center gap-1 font-body text-xs font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">
                          <Clock size={10} /> Pending
                        </span>
                      )}
                      {member.status === 'suspended' && (
                        <span className="flex items-center gap-1 font-body text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          <Ban size={10} /> Suspended
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-brand-ink/50">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={member.role}
                    onChange={(e) => updateStaffRole(member.id, e.target.value as StaffRole)}
                    disabled={member.role === 'admin' && staff.filter((s) => s.role === 'admin').length === 1}
                    className="font-body text-xs font-bold px-3 py-2 rounded-lg border border-brand-primary/20 bg-white disabled:opacity-50"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="cashier">Cashier</option>
                  </select>

                  <button
                    onClick={() => setViewingPermissionsFor(viewingPermissionsFor === member.id ? null : member.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-brand-bg/40 hover:bg-brand-bg/60 transition"
                    title="View permissions"
                  >
                    <Shield size={15} className="text-brand-ink" />
                  </button>

                  <button
                    onClick={() => toggleStaffStatus(member.id)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition ${
                      member.status === 'suspended' ? 'bg-green-50 hover:bg-green-100' : 'bg-brand-bg/40 hover:bg-brand-bg/60'
                    }`}
                    title={member.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                  >
                    {member.status === 'suspended' ? (
                      <CheckCircle2 size={15} className="text-green-600" />
                    ) : (
                      <Ban size={15} className="text-brand-ink" />
                    )}
                  </button>

                  <button
                    onClick={() => confirm(`Remove ${member.name} from staff?`) && removeStaffMember(member.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 transition"
                  >
                    <Trash2 size={15} className="text-red-500" />
                  </button>
                </div>
              </div>

              {viewingPermissionsFor === member.id && (
                <div className="mt-4 pt-4 border-t border-brand-primary/5 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ROLE_PERMISSIONS[member.role].map((perm) => (
                    <div key={perm} className="flex items-center gap-1.5 font-body text-xs text-brand-ink/70">
                      <CheckCircle2 size={12} className="text-brand-primary shrink-0" />
                      {perm}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Staff Member">
        <AddStaffForm onSuccess={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}