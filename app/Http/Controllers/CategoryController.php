<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $business = $request->user()->business;
        $categories = $business->categories()->withCount('products')->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
        ]);

        $business = $request->user()->business;
        $maxOrder = $business->categories()->max('sort_order') ?? 0;

        $business->categories()->create([
            'name' => $data['name'],
            'sort_order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Category created.');
    }

    public function update(Request $request, Category $category)
    {
        $business = $request->user()->business;
        if ($category->business_id !== $business->id) {
            abort(403);
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:100',
            'sort_order' => 'sometimes|integer',
        ]);

        if (isset($data['name'])) {
            $category->name = $data['name'];
            $category->slug = \Illuminate\Support\Str::slug($data['name']);
        }

        if (isset($data['sort_order'])) {
            $category->sort_order = $data['sort_order'];
        }

        $category->save();

        return back()->with('success', 'Category updated.');
    }

    public function destroy(Request $request, Category $category)
    {
        $business = $request->user()->business;
        if ($category->business_id !== $business->id) {
            abort(403);
        }

        $category->delete();

        return back()->with('success', 'Category deleted.');
    }

    public function reorder(Request $request)
    {
        $data = $request->validate([
            'order' => 'required|array',
            'order.*.id' => 'required|exists:categories,id',
            'order.*.sort_order' => 'required|integer',
        ]);

        $business = $request->user()->business;

        foreach ($data['order'] as $item) {
            Category::where('id', $item['id'])
                ->where('business_id', $business->id)
                ->update(['sort_order' => $item['sort_order']]);
        }

        return back()->with('success', 'Categories reordered.');
    }
}
