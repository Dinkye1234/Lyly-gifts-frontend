// src/pages/user/LoginPage.jsx
import LoginRegister from "./LoginRegister";

const LoginPage = () => {
  return (
    <div className="min-h-screen pt-20 flex items-start sm:items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <LoginRegister />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
