import { useForm } from "@inertiajs/react"
import { Building2, Mail, Phone, MapPin, FileText } from "lucide-react"
import React from "react"
import { FormInput } from "@/Components/TextInput"
import { FormTextarea } from "@/Components/TextAreaInput"
import { FileUpload } from "@/Components/FileUpload"
import { Button } from "@/Components/Button"


export default function CreateBusiness(): JSX.Element {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    whatsapp: "",
    email: "",
    address: "",
    short_note: "",
    logo: null as File | null,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route("business.store"))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="border-b px-8 py-4 ">
          <div className="w-full items-center justify-center flex mb-4">
              <img
                src="/images/logo.svg"
                alt="Business Setup"
                className="w-60 h-20 "
              />
            </div>
            <div className="text-center">
            <h2 className="text-2xl font-bold text-purple-700 mb-2">Create Your Business</h2>
            <p className="text-black">Set up your business profile to get started</p>
            </div>

           
          </div>

          {/* Form Content */}
          <form className="px-8 py-8" onSubmit={submit}  >
            <div className="space-y-6">
              <FormInput
                label="Business Name"
                type="text"
                value={data.name}
                onChange={(e: { target: { value: string } }) => setData("name", e.target.value)}
                error={errors.name}
                icon={Building2}
                placeholder="Enter your business name"
                required
              />

              <FormInput
                label="WhatsApp Number"
                type="text"
                value={data.whatsapp}
                onChange={(e: { target: { value: string } }) => setData("whatsapp", e.target.value)}
                error={errors.whatsapp}
                icon={Phone}
                placeholder="+1 (555) 123-4567"
                required
              />

              <FormInput
                label="Email Address"
                type="email"
                value={data.email}
                onChange={(e: { target: { value: string } }) => setData("email", e.target.value)}
                error={errors.email}
                icon={Mail}
                placeholder="business@example.com"
                required
              />

              <FormInput
                label="Business Address"
                type="text"
                value={data.address || ""}
                onChange={(e: { target: { value: string } }) => setData("address", e.target.value)}
                icon={MapPin}
                placeholder="123 Business St, City, State"
              />

              <FormTextarea
                label="Short Description"
                value={data.short_note || ""}
                onChange={(e: { target: { value: string } }) => setData("short_note", e.target.value)}
                icon={FileText}
                placeholder="Tell us about your business in a few words..."
              />

              <FileUpload
                label="Business Logo"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("logo", e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                error={errors.logo}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={processing}
                  className="w-full text-lg py-4"
                >
                  {processing ? "Creating Business..." : "Create Business"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}