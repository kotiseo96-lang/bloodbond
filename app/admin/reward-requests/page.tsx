"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/src/integrations/supabase/client"

export default function AdminRewardsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // MODAL STATE
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [giftCode, setGiftCode] = useState("")
  const [provider, setProvider] = useState("")

  const [showRejectModal, setShowRejectModal] = useState(false)

  const fetchRequests = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("reward_requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) setRequests(data || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // OPEN APPROVE MODAL
  const openApprove = (id: string) => {
    setSelectedId(id)
    setGiftCode("")
    setProvider("")
    setShowApproveModal(true)
  }

  // OPEN REJECT MODAL
  const openReject = (id: string) => {
    setSelectedId(id)
    setShowRejectModal(true)
  }

  // CONFIRM APPROVE
  const confirmApprove = async () => {
    if (!selectedId || !giftCode) return

    setProcessingId(selectedId)

    const { error } = await supabase.rpc("process_reward_request", {
      p_request_id: selectedId,
      p_action: "approve",
      p_gift_code: giftCode,
      p_provider: provider,
    })

    setProcessingId(null)
    setShowApproveModal(false)

    if (!error) fetchRequests()
  }

  // CONFIRM REJECT
  const confirmReject = async () => {
    if (!selectedId) return

    setProcessingId(selectedId)

    const { error } = await supabase.rpc("process_reward_request", {
      p_request_id: selectedId,
      p_action: "reject",
      p_gift_code: null,
      p_provider: null,
    })

    setProcessingId(null)
    setShowRejectModal(false)

    if (!error) fetchRequests()
  }

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-2xl font-bold">
        Admin Reward Requests
      </h1>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="border rounded overflow-hidden">
          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">Coins</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Gift Code</th>
                <th className="p-2 text-left">Provider</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((r) => {
                const disabled =
                  r.status !== "pending" || processingId === r.id

                return (
                  <tr key={r.id} className="border-t">

                    <td className="p-2">{r.user_id}</td>
                    <td className="p-2">{r.coins_spent}</td>

                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        r.status === "pending"
                          ? "bg-yellow-100"
                          : r.status === "approved"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}>
                        {r.status}
                      </span>
                    </td>

                    <td className="p-2">{r.gift_code || "-"}</td>
                    <td className="p-2">{r.provider || "-"}</td>

                    <td className="p-2 flex gap-2">

                      <button
                        disabled={disabled}
                        onClick={() => openApprove(r.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                      >
                        Approve
                      </button>

                      <button
                        disabled={disabled}
                        onClick={() => openReject(r.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
                      >
                        Reject
                      </button>

                    </td>

                  </tr>
                )
              })}
            </tbody>

          </table>
        </div>
      )}

      {/* ================= APPROVE MODAL ================= */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px] space-y-3">

            <h2 className="text-lg font-bold">Approve Reward</h2>

            <input
              className="border p-2 w-full"
              placeholder="Gift Code"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
            />

<input
  className="border p-2 w-full"
  placeholder="Enter Provider Name (e.g. Amazon, Flipkart)"
  value={provider}
  onChange={(e) => setProvider(e.target.value)}
/>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-3 py-1 border"
              >
                Cancel
              </button>

              <button
                onClick={confirmApprove}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= REJECT MODAL ================= */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[350px] space-y-3">

            <h2 className="text-lg font-bold text-red-600">
              Reject Request?
            </h2>

            <p className="text-sm text-gray-500">
              Coins will be refunded to donor wallet.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1 border"
              >
                Cancel
              </button>

              <button
                onClick={confirmReject}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Reject
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}