import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/signup/SignUp";
import Home from "./components/home/home.jsx";
import SignIn from "./components/login/SignIn";
import Projects from "./components/projects/Projects.jsx";
import Tasks from "./components/tasks/tasks.jsx";
import ForgetPassword from "./components/forgetpass/Forgetpass.jsx";
import Layout from "./components/layout/Layout.jsx";
import Projectview from "./components/projects/ProjectView.jsx";
import CreateProject from "./components/projects/CreateProject.jsx";
import CreateTask from "./components/tasks/CreateTask.jsx";
import TaskView from "./components/tasks/TaskView.jsx";
import Calender from "./components/calender/Calender.jsx";
import MyTasks from "./components/tasks/MyTasks.jsx";
import Team from "./components/team/Team.jsx";
import UserView from "./components/users/UserView.jsx";
import EditUser from "./components/users/EditUser.jsx";
import LandingPage from "./components/landing/LandingPage.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="create-project" element={<CreateProject />} />
            <Route path="view-project" element={<Projectview />} />
            <Route path="create-task" element={<CreateTask />} />
            <Route path="view-task" element={<TaskView />} />
            <Route path="my-tasks" element={<MyTasks />} />
            <Route path="calendar" element={<Calender />} />
            <Route path="team" element={<Team />} />
            <Route path="teams" element={<Team />} />
            <Route path="settings" element={<UserView />} />
            <Route path="view-user" element={<UserView />} />
            <Route path="edit-user" element={<EditUser />} />
            <Route path="settings/edit" element={<EditUser />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
