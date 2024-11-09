import { Route, Routes } from "react-router-dom";
import { Login, MyWorkspace, Onboarding, QuestionPage, Signup, SurveyPage, UserAccount } from "./pages"
import { Hero, Navbar } from "./components";

import api from "./api";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyUser from "./pages/auth/VerifyUser";

function App() {

  return (
    <div className="min-h-screen max-w-full overflow-y-auto">
        <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar api={api} />
                  <Hero api={api} />
                </>
              }
              exact
            />
            <Route
              path="/myworkspace"
              element={
                <>
                  <Navbar api={api} />
                  <MyWorkspace api={api} />
                </>
              }
            />
            <Route
              path="/questionpage"
              element={
                <>
                  <Navbar api={api} />
                  <QuestionPage api={api} />
                </>
              }
            />
            <Route
              path="/survey/:id"
              element={
                <>
                  <Navbar api={api} />
                  <SurveyPage api={api} />
                </>
              }
            />
            <Route
              path="/user/userAccount"
              element={
                <>
                  <Navbar api={api} />
                  <UserAccount api={api} />
                </>
              }
            />
            <Route path="/onboarding" element={<Onboarding />} />
            
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="auth">
            <Route path="signup" element={<Signup api={api} />} />
            <Route path="login" element={<Login api={api} />} />
            <Route path="verifyUser" element={<VerifyUser api={api} />} />
          </Route>
        </Routes>
    </div>
  )
}

export default App
