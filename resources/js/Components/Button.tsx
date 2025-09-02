import { ButtonProps } from '@/Types/input.type'

export // Reusable Button Component
const Button: React.FC<ButtonProps> = ({ 
  children, 
  type = "button", 
  variant = "primary", 
  disabled = false, 
  loading = false,
  className = "",
  ...props 
}) => {
  const baseClasses = "font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: `bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
      text-white shadow-lg hover:shadow-xl focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed
      disabled:hover:from-purple-600 disabled:hover:to-indigo-600`,
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500"
  }
  
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : children}
    </button>
  )
}
