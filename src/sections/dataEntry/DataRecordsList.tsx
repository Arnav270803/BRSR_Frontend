import { Trash2 } from "lucide-react";
import type { WorkspaceRole } from "../workspace/workspaceData";
import { canDeleteRecord, type DataRecord } from "./dataEntryData";
import {
  formatDate,
  formatNumber,
  getRecordActivityName,
} from "./dataEntryUtils";

export function DataRecordsList({
  currentUserId,
  onDeleteRecord,
  records,
  viewerRole,
}: {
  currentUserId: string;
  onDeleteRecord: (recordId: string) => void;
  records: DataRecord[];
  viewerRole: WorkspaceRole;
}) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Submitted records</p>
          <h2 className="mt-1 text-xl font-semibold text-[#142019]">Activity log</h2>
        </div>
        <span className="w-fit rounded-md border border-[#d5dfd8] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#5f6f66]">
          {records.length} records
        </span>
      </div>

      {records.length > 0 ? (
        <>
          <div className="mt-5 grid gap-3 lg:hidden">
            {records.map((record) => (
              <RecordCard
                key={record.id}
                currentUserId={currentUserId}
                onDeleteRecord={onDeleteRecord}
                record={record}
                viewerRole={viewerRole}
              />
            ))}
          </div>

          <div className="mt-5 hidden overflow-hidden rounded-lg border border-[#d9e2dc] bg-white/55 lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#d9e2dc] bg-[#f3f7f4]/80 text-xs font-semibold tracking-[0.12em] text-[#65716a] uppercase">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Activity</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Factor</th>
                    <th className="px-4 py-3">kg CO2e</th>
                    <th className="px-4 py-3">Origin</th>
                    <th className="px-4 py-3">Created by</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e8e2] text-sm">
                  {records.map((record) => (
                    <tr className="text-[#253229]" key={record.id}>
                      <td className="px-4 py-4 font-semibold">{formatDate(record.recordDate)}</td>
                      <td className="px-4 py-4">
                        <p className="font-semibold">{getRecordActivityName(record)}</p>
                        <p className="mt-1 text-xs text-[#65716a]">
                          {record.ghgActivity?.category.name} / {record.ghgActivity?.scope}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-[#5f6d65]">
                        {formatNumber(record.quantity)} {record.unit}
                      </td>
                      <td className="px-4 py-4 text-[#5f6d65]">
                        {record.factorKgCo2e ?? "Not set"}
                      </td>
                      <td className="px-4 py-4 font-semibold text-[#142019]">
                        {formatNumber(record.calculatedKgCo2e)}
                      </td>
                      <td className="px-4 py-4">
                        <OriginBadge record={record} />
                      </td>
                      <td className="px-4 py-4 text-[#5f6d65]">
                        {record.createdBy?.name ?? record.createdBy?.email ?? "Unknown"}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <DeleteButton
                          canDelete={canDeleteRecord(viewerRole, record, currentUserId)}
                          onClick={() => onDeleteRecord(record.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-[#c8d6cd] bg-white/45 p-6 text-sm text-[#617069]">
          No records have been added for this reporting year yet. Add the first record from the
          activity data panel.
        </div>
      )}
    </section>
  );
}

function RecordCard({
  currentUserId,
  onDeleteRecord,
  record,
  viewerRole,
}: {
  currentUserId: string;
  onDeleteRecord: (recordId: string) => void;
  record: DataRecord;
  viewerRole: WorkspaceRole;
}) {
  return (
    <article className="rounded-lg border border-[#d9e2dc] bg-white/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[#142019]">
            {getRecordActivityName(record)}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#647169]">
            {formatDate(record.recordDate)} / {record.ghgActivity?.category.name}
          </p>
        </div>
        <span className="w-fit rounded-md border border-[#bdd3c3] bg-[#edf6ef] px-2.5 py-1 text-xs font-semibold text-[#2f6b45]">
          {record.ghgActivity?.scope ?? "Scope not set"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <RecordMeta label="Quantity" value={`${formatNumber(record.quantity)} ${record.unit}`} />
        <RecordMeta label="kg CO2e" value={formatNumber(record.calculatedKgCo2e)} />
        <RecordMeta label="Factor" value={record.factorKgCo2e ?? "Not set"} />
        <RecordMeta
          label="Origin"
          value={
            record.dataOrigin === "VENDOR"
              ? `Vendor: ${record.vendor?.displayName ?? "Supplier"}`
              : record.vendor
                ? `Internal: ${record.vendor.displayName}`
                : "Internal"
          }
        />
        <RecordMeta
          label="Created by"
          value={record.createdBy?.name ?? record.createdBy?.email ?? "Unknown"}
        />
      </div>

      {record.notes ? (
        <p className="mt-4 rounded-md border border-[#e0e8e2] bg-[#f7faf7] p-3 text-sm leading-6 text-[#65716a]">
          {record.notes}
        </p>
      ) : null}

      <div className="mt-4">
        <DeleteButton
          canDelete={canDeleteRecord(viewerRole, record, currentUserId)}
          onClick={() => onDeleteRecord(record.id)}
        />
      </div>
    </article>
  );
}

function OriginBadge({ record }: { record: DataRecord }) {
  const isVendorSubmission = record.dataOrigin === "VENDOR";

  return (
    <div>
      <span
        className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${
          isVendorSubmission
            ? "border-[#b9cde0] bg-[#edf5fb] text-[#315f83]"
            : "border-[#cddbd2] bg-[#f3f7f4] text-[#52645a]"
        }`}
      >
        {isVendorSubmission ? "Vendor submission" : "Internal"}
      </span>
      {record.vendor ? (
        <p className="mt-1 max-w-36 truncate text-xs text-[#65716a]">
          {record.vendor.displayName}
        </p>
      ) : null}
    </div>
  );
}

function RecordMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#e0e8e2] bg-[#f7faf7] p-3">
      <p className="text-[11px] font-semibold tracking-[0.08em] text-[#69756e] uppercase">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-[#16211b]">{value}</p>
    </div>
  );
}

function DeleteButton({
  canDelete,
  onClick,
}: {
  canDelete: boolean;
  onClick: () => void;
}) {
  function confirmDelete() {
    if (!window.confirm("Delete this data record? This action will remove it from the active record list.")) {
      return;
    }

    onClick();
  }

  return (
    <button
      className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-[#d7c6c1] bg-white/70 px-3 text-sm font-semibold text-[#713c34] transition hover:border-[#c99990] hover:bg-white focus:ring-3 focus:ring-[#9b3a32]/15 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      disabled={!canDelete}
      onClick={confirmDelete}
      title={canDelete ? "Delete record" : "You can delete only your own records"}
      type="button"
    >
      <Trash2 className="size-4" strokeWidth={1.8} />
      Delete
    </button>
  );
}
