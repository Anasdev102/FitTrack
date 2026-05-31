<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AiReminderController extends Controller
{
    public function __invoke(Request $request)
    {
        $data = $request->validate([
            'member_name' => ['required', 'string', 'max:255'],
            'end_date' => ['required', 'date'],
            'language' => ['required', 'in:arabic,french,english'],
        ]);

        $messages = [
            'english' => "Hello {$data['member_name']}, this is a friendly reminder that your gym subscription ends on {$data['end_date']}. Please renew it to keep enjoying your training sessions.",
            'french' => "Bonjour {$data['member_name']}, votre abonnement a la salle expire le {$data['end_date']}. Merci de le renouveler pour continuer vos seances sans interruption.",
            'arabic' => "مرحبا {$data['member_name']}، نذكركم بأن اشتراككم في النادي سينتهي بتاريخ {$data['end_date']}. يرجى تجديده لمواصلة التمارين بدون انقطاع.",
        ];

        return response()->json(['message' => $messages[$data['language']]]);
    }
}
