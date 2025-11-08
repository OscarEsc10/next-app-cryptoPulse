"use client";

import React from "react";
import OverviewStats from "./components/overViewStats";

export default function OverviewPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="mt-2 text-gray-600">Market summary and portfolio snapshot.</p>
      <OverviewStats />
    </section>
  );
}
