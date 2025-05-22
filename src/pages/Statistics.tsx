
import React from 'react';
import Navbar from '@/components/Navbar';

const Statistics = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Statistics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Statistics Content</h2>
            <p className="text-muted-foreground">Your statistics will be displayed here.</p>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Statistics;
