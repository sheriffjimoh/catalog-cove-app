import { PropsWithChildren } from "react";

interface GuestProps extends PropsWithChildren {
  name: 'login' | 'register' | 'create-business';
}

const getHeaderContent = (name: string) => {
  switch (name) {
    case 'login':
      return {
        title: 'Welcome Back',
        subtitle: 'Sign in to your account to continue'
      };
    case 'register':
      return {
        title: 'Join Us Today',
        subtitle: 'Create your account and start your journey'
      };
    case 'create-business':
      return {
        title: 'Create Your Business',
        subtitle: 'Set up your business profile to get started'
      };
    default:
      return {
        title: 'Welcome',
        subtitle: 'Get started with your account'
      };
  }
};

export default function Guest({ children, name }: GuestProps) {
  const { title, subtitle } = getHeaderContent(name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="border-b px-8 py-4">
            <div className="w-full items-center justify-center flex mb-4">
              <img
                src="/images/logo.svg"
                alt="Catalog Cove"
                className="w-60 h-20"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-700 mb-2">
                {title}
              </h2>
              <p className="text-black">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="p-8 space-y-6">{children}</div>
        </div>
      </main>
    </div>
  );
}