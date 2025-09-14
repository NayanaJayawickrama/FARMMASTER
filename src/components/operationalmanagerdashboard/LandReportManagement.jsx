import React, { useState, useEffect } from "react";
import LandReportReview from "./LandReportReview";

const statusColors = {
  Assigned: "bg-green-100 text-green-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Unassigned: "bg-gray-100 text-gray-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-700",
  "Not Reviewed": "bg-gray-100 text-gray-800",
};

export default function LandReportManagement() {
  const [showReview, setShowReview] = useState(false);
  const [assignmentState, setAssignmentState] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorAssignments, setErrorAssignments] = useState("");
  const [errorReviews, setErrorReviews] = useState("");
  const [supervisors, setSupervisors] = useState([]);
  const [editingAssignIndex, setEditingAssignIndex] = useState(null);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState("");

  useEffect(() => {
    fetch("http://localhost/FM-Backend/get_land_assignments.php")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch assignments");
        return res.json();
      })
      .then((data) => setAssignmentState(data))
      .catch((err) => setErrorAssignments(err.message))
      .finally(() => setLoadingAssignments(false));

    fetch("http://localhost/FM-Backend/get_land_reports.php")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reports");
        return res.json();
      })
      .then((data) => setReviewData(data))
      .catch((err) => setErrorReviews(err.message))
      .finally(() => setLoadingReviews(false));

    fetch("http://localhost/FM-Backend/get_supervisors.php")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch supervisors");
        return res.json();
      })
      .then((data) => setSupervisors(data))
      .catch(() => setSupervisors([]));
  }, []);

  function toggleAssignment(idx) {
    setAssignmentState((prev) => {
      const next = [...prev];
      const cur = next[idx];
      if (!cur) return prev;
      const isAssigned = cur.status === "Assigned" || cur.status === "In Progress";
      next[idx] = {
        ...cur,
        status: isAssigned ? "Unassigned" : "Assigned",
        supervisor: isAssigned ? "Unassigned" : cur.supervisor === "Unassigned" ? "TBD" : cur.supervisor,
      };
      return next;
    });
  }

  function startAssign(idx) {
    setEditingAssignIndex(idx);
    setSelectedSupervisorId(assignmentState[idx]?.supervisorId || "");
  }

  function cancelAssign() {
    setEditingAssignIndex(null);
    setSelectedSupervisorId("");
  }

  function confirmAssign(idx) {
    if (!selectedSupervisorId) return;
    const sup = supervisors.find((s) => s.id === selectedSupervisorId);
    setAssignmentState((prev) => {
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        supervisorId: sup.id,
        supervisor: sup.name,
        status: "Assigned",
      };
      return next;
    });
    cancelAssign();
  }

  if (showReview) {
    return <LandReportReview onBack={() => setShowReview(false)} />;
  }

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">
          Land Report Assignments
        </h2>
        <p className="text-green-600 mb-6 text-sm sm:text-base">
          Manage and assign field supervisors to land report requests.
        </p>
        <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
          {loadingAssignments ? (
            <div className="p-4 text-center text-gray-500">Loading assignments...</div>
          ) : errorAssignments ? (
            <div className="p-4 text-center text-red-500">{errorAssignments}</div>
          ) : Array.isArray(assignmentState) && assignmentState.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No assignments found.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-green-50 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Report ID</th>
                  <th className="py-3 px-4 text-left">Location</th>
                  <th className="py-3 px-4 text-left">Landowner Name</th>
                  <th className="py-3 px-4 text-left">Requested Date</th>
                  <th className="py-3 px-4 text-left">Field Supervisor Name</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(assignmentState) ? assignmentState.map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-200 hover:bg-green-50">
                    <td className="py-3 px-4">{item.id}</td>
                    <td className="py-3 px-4">{item.location}</td>
                    <td className="py-3 px-4 text-green-700">{item.name}</td>
                    <td className="py-3 px-4">{item.date}</td>
                    <td className="py-3 px-4 text-green-700">{item.supervisor || "Unassigned"}</td>
                    <td className="py-3 px-4 flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full inline-block ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                      {item.status === "Unassigned" ? (
                        editingAssignIndex === idx ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={selectedSupervisorId}
                              onChange={(e) => setSelectedSupervisorId(e.target.value)}
                              className="px-2 py-1 border rounded text-sm"
                            >
                              <option value="">Select supervisor</option>
                              {supervisors.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => confirmAssign(idx)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={cancelAssign}
                              className="px-3 py-1 bg-gray-200 text-black rounded text-sm hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startAssign(idx)}
                            className="ml-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Assign
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => toggleAssignment(idx)}
                          className="ml-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Unassign
                        </button>
                      )}
                    </td>
                  </tr>
                )) : null}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">
          Land Report Review & Approval
        </h2>
        <p className="text-green-600 mb-6 text-sm sm:text-base">
          Review the submitted land report data and provide feedback.
        </p>
        <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
          {loadingReviews ? (
            <div className="p-4 text-center text-gray-500">Loading reviews...</div>
          ) : errorReviews ? (
            <div className="p-4 text-center text-red-500">{errorReviews}</div>
          ) : Array.isArray(reviewData) && reviewData.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No reviews found.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-green-50 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Report ID</th>
                  <th className="py-3 px-4 text-left">Location</th>
                  <th className="py-3 px-4 text-left">Landowner Name</th>
                  <th className="py-3 px-4 text-left">Supervisor ID</th>
                  <th className="py-3 px-4 text-left">Supervisor Name</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left text-green-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(reviewData) ? reviewData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-gray-200 hover:bg-green-50"
                  >
                    <td className="py-3 px-4">{item.id}</td>
                    <td className="py-3 px-4">{item.location}</td>
                    <td className="py-3 px-4 text-green-700">{item.name}</td>
                    <td className="py-3 px-4">{item.supervisorId}</td>
                    <td className="py-3 px-4">{item.supervisor}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full inline-block ${statusColors[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td
                      className="py-3 px-4 text-black font-semibold cursor-pointer hover:underline hover:text-green-600"
                      onClick={() => setShowReview(true)}
                    >
                      View Report
                    </td>
                  </tr>
                )) : null}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
