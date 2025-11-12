import React from 'react';
import SettingsPagesLayout from './Index';
import { useForm } from '@inertiajs/react';
import { Building2, Phone, Mail, MapPin, FileText } from 'lucide-react';
import { FormInput } from "@/Components/TextInput"
import { FormTextarea } from "@/Components/TextAreaInput"
import { FileUpload } from "@/Components/FileUpload"
import { Button } from "@/Components/Button"

export default function BusinessSettings({ business }: { business: any }) {

    console.log({
        business
    })
    const { data, setData, post, processing, errors } = useForm({   
        name: business?.name || "",
        whatsapp: business?.whatsapp || "",
        email: business?.email || "",
        address: business?.address || "",
        short_note: business?.short_note || "",
        logo: null as File | null,
      })


    
      const submit = (e: React.FormEvent) => {
        e.preventDefault()
        // console.log("Submitting form with data:", data);
        post(route("business.update", business.id))
      }

    return (
        <SettingsPagesLayout>
        <div>
           <div className="flex flex-col ">
                <h3 className="text-2xl font-bold pb-5 text-bgray-900 dark:text-white dark:border-darkblack-400 border-b border-bgray-200">
                    Business Information's
                </h3>

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
                preview={business?.logo || ""}
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
                  {processing ? "Updating  Business..." : "Update Business"}
                </Button>
              </div>
            </div>
          </form>
            </div>
        </div>
        </SettingsPagesLayout>
    );
}