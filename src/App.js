import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

// Styles
import "./App.css";

// Contexts
import ApiProvider from "./contexts/ApiProvider";
import AuthProvider from "./contexts/AuthProvider";

// Pages
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/UserProfilePage";
import AddachildPage from "./pages/AddachildPage";
import LibraryPage from "./pages/LibraryPage";
import NewStoryPage from "./pages/NewStoryPage";
import ModifyChildPage from "./pages/ModifyChildPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StoryPage from "./pages/StoryPage";
import SelectChildPage from "./pages/SelectChildPage";
import AboutUsPage from "./pages/AboutUsPage";
import TermsPage from "./pages/TermsPage";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <ApiProvider>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/myprofile/:parentid"
                element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/addachild"
                element={
                  <ProtectedRoute>
                    <AddachildPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/modify/:childid"
                element={
                  <ProtectedRoute>
                    <ModifyChildPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/library/:storyId"
                element={
                  <ProtectedRoute>
                    <StoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/library"
                element={
                  <ProtectedRoute>
                    <LibraryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/newstory/:childId"
                element={
                  <ProtectedRoute>
                    <NewStoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/children"
                element={
                  <ProtectedRoute>
                    <SelectChildPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <AuthRoute>
                    <LoginPage />
                  </AuthRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <AuthRoute>
                    <SignupPage />
                  </AuthRoute>
                }
              />
              <Route path="/aboutus" element={<AboutUsPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Routes>
            <Footer />
          </AuthProvider>
        </ApiProvider>
      </BrowserRouter>
    </Container>
  );
}
