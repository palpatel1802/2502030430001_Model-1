import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UploadNotes from "./pages/UploadNotes";
import SearchNotes from "./pages/SearchNotes";
import MyNotes from "./pages/MyNotes";
import Profile from "./pages/Profile";
import ReadNote from "./pages/ReadNote";
import EditNote from "./pages/EditNote";
import SavedNotes from "./pages/SavedNotes";
import DownloadedNotes from "./pages/DownloadedNotes";
import Settings from "./pages/Settings";
import HelpSupport from "./pages/HelpSupport";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Services from "./pages/Services";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/readnote" element={<ReadNote />} />
      <Route path="/search" element={<SearchNotes />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/services" element={<Services />} />
      <Route path="/help" element={<HelpSupport />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsConditions />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mynotes"
        element={
          <ProtectedRoute>
            <MyNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editnote/:id"
        element={
          <ProtectedRoute>
            <EditNote />
          </ProtectedRoute>
        }
      />
      <Route
        path="/savednotes"
        element={
          <ProtectedRoute>
            <SavedNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/downloaded"
        element={
          <ProtectedRoute>
            <DownloadedNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
