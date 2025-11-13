<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBusinessRequest extends FormRequest
{
   
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'whatsapp' => 'required|string|max:20',
            'email' => 'required|email|unique:businesses,email',
            'address' => 'nullable|string|max:255',
            'short_note' => 'nullable|string|max:1000',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'country_id' => 'required|exists:countries,id',
        ];
    }


    protected function prepareForValidation(): void
    {
        if ($this->has('whatsapp')) {
            $this->merge([
                'whatsapp' => preg_replace('/[^0-9+\-\s()]/', '', $this->whatsapp)
            ]);
        }

        if ($this->has('email')) {
            $this->merge([
                'email' => strtolower(trim($this->email))
            ]);
        }
    }
}
