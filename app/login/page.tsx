import LoginForm from "@/app/ui/login/login-form";

const comments = [
  { top: "8%", colour: "text-blue-300", duration: 14, delay: -3 },
  { top: "20%", colour: "text-pink-300", duration: 18, delay: -12 },
  { top: "34%", colour: "text-purple-300", duration: 12, delay: -6 },
  { top: "48%", colour: "text-teal-300", duration: 20, delay: -2 },
  { top: "62%", colour: "text-orange-300", duration: 16, delay: -10 },
  { top: "76%", colour: "text-indigo-300", duration: 13, delay: -5 },
  { top: "88%", colour: "text-rose-300", duration: 17, delay: -14 },
];

export default function LoginPage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#f2eadf] px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {comments.map((comment, index) => (
          <span
            key={index}
            className={`danmaku absolute whitespace-nowrap text-5xl font-bold opacity-50 ${comment.colour}`}
            style={{
              top: comment.top,
              animationDuration: `${comment.duration}s`,
              animationDelay: `${comment.delay}s`,
            }}
          >
            TutorFlow
          </span>
        ))}
      </div>

      <div >
        <LoginForm />
      </div>
    </main>
  );
}