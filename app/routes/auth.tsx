import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => {
  return [
    { title: "Login" },
    { name: "description", content: "Login To Check Your Score" },
  ];
};

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Better way to get the 'next' parameter safely
  const params = new URLSearchParams(location.search);
  const next = params.get('next');

  useEffect(() => {
    /** * THE FIX: Only redirect IF:
     * 1. Loading is finished (!isLoading)
     * 2. The user is logged in (auth.isAuthenticated)
     * 3. There is actually a 'next' destination 
     * OR you want to force them away from login if they are already logged in.
     */
    if (!isLoading && auth.isAuthenticated && next) {
      navigate(next);
    }
  }, [auth.isAuthenticated, isLoading, navigate, next]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Sign in to check your score</h2>
          </div>
          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse" disabled>
                <p>Signing You In....</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <div className="flex flex-col gap-4 items-center">
                    <p className="text-green-600 font-medium">You are logged in!</p>
                    <button className="auth-button" onClick={() => auth.signOut()}>
                      <p>Log Out</p>
                    </button>
                  </div>
                ) : (
                  <button className="auth-button" onClick={() => auth.signIn()}>
                    <p>Log In</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;