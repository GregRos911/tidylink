
import React from 'react';
import { useUser } from "@clerk/clerk-react";
import { Navigate } from 'react-router-dom';
import Nav from '@/components/Nav';
import CreateLinkForm from '@/components/CreateLinkForm';

const CreateLink: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="container py-8 flex-1">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Create New Link</h1>
          <CreateLinkForm />
        </div>
      </main>
    </div>
  );
};

export default CreateLink;
