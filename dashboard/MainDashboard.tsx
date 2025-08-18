"use client";
import React, { useEffect, useState } from "react";
import { SurveyResponse } from "./DashboardTable";
import { SimpleTable } from "./SimpleTable";
import { InteractiveDashboard } from "./InteractiveDashboard";

export default function MainDashboard() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"responses" | "interactive">("interactive");

  const isDarkTheme = true;

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/responses");
      const data = await res.json();
      if (data.success) setResponses(data.data);
      else setError(data.error || "Failed to fetch data");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkTheme ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className={`mt-3 text-base font-medium ${isDarkTheme ? "text-white" : "text-gray-900"}`}>
            Loading Dashboard…
          </h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkTheme ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className={`p-6 rounded-md shadow-md max-w-md w-full text-center ${isDarkTheme ? "bg-gray-800" : "bg-white"}`}>
          <h3 className={`text-lg font-semibold mb-2 ${isDarkTheme ? "text-red-300" : "text-red-600"}`}>
            Error Loading Data
          </h3>
          <p className={`${isDarkTheme ? "text-gray-300" : "text-gray-600"} mb-4`}>{error}</p>
          <button
            onClick={fetchData}
            className={`px-4 py-2 rounded-md text-sm font-medium 
              ${isDarkTheme ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkTheme ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <header className={`border-b ${isDarkTheme ? "border-gray-800" : "border-gray-200"} bg-transparent`}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Microwave Ablation Therapy</h1>
            <p className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>
              Survey Results Dashboard
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide">Total Responses</p>
            <p className={`text-2xl font-bold ${isDarkTheme ? "text-cyan-300" : "text-blue-600"}`}>
              {responses.length}
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-2 mb-6 bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("interactive")}
            className={`flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 
              ${activeTab === "interactive" 
                ? "bg-[#7ee9fa] text-black shadow-lg transform scale-[1.02]" 
                : "text-gray-300 hover:text-white hover:bg-gray-700/50"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics Dashboard
          </button>
          <button
            onClick={() => setActiveTab("responses")}
            className={`flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 
              ${activeTab === "responses" 
                ? "bg-[#7ee9fa] text-black shadow-lg transform scale-[1.02]" 
                : "text-gray-300 hover:text-white hover:bg-gray-700/50"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Responses Table
          </button>
        </div>

        {/* Active Tab Indicator */}
        <div className={`mb-4 text-center py-2 px-4 rounded-lg ${
          activeTab === "interactive" 
            ? "bg-[#7ee9fa]/10 border border-[#7ee9fa]/30" 
            : "bg-orange-500/10 border border-orange-400/30"
        }`}>
          <p className={`text-sm font-medium ${
            activeTab === "interactive" 
              ? "text-[#7ee9fa]" 
              : "text-orange-400"
          }`}>
            {activeTab === "interactive" 
              ? "📊 Currently viewing: Interactive Analytics Dashboard with Charts & Visualizations" 
              : "📋 Currently viewing: Response Table with Doctor Selection & CSV Export"}
          </p>
        </div>

        {/* Tab Content */}
        {activeTab === "interactive" && (
          <InteractiveDashboard responses={responses} isDarkTheme={isDarkTheme} />
        )}
        {activeTab === "responses" && (
          <SimpleTable responses={responses} isDarkTheme={isDarkTheme} />
        )}
      </div>
    </div>
  );
}
