<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBusinessExists
{

    public function handle(Request $request, Closure $next): Response
    {

        Log::info('EnsureBusinessExists middleware triggered', [
            'user_id' => $request->user()->id,
            'business' => $request->user()->business ,
        ]);

        if (!$request->user()->business) {
            return redirect()->route('business.create');
        }
        return $next($request);
    }
}
