<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AiReminderRequest;

class AiReminderController extends Controller
{
    public function __invoke(AiReminderRequest $request)
    {
        $data = $request->validated();

        return response()->json([
            'message' => $this->message($data),
        ]);
    }

    private function message(array $data): string
    {
        $language = $data['language'];
        $type = $data['reminder_type'];
        $name = $data['member_name'];
        $plan = $data['plan_name'] ?? 'membership';
        $amount = isset($data['amount']) ? number_format((float) $data['amount'], 0) : null;
        $deadline = isset($data['payment_deadline']) ? date('d/m/Y H:i', strtotime($data['payment_deadline'])) : '';
        $endDate = isset($data['end_date']) ? date('d/m/Y', strtotime($data['end_date'])) : '';

        $templates = [
            'pending_payment' => [
                'en' => "Hello {$name}, your {$plan} subscription request is pending. Please visit the gym reception before {$deadline} to pay {$amount} MAD in cash and activate your membership.",
                'fr' => "Bonjour {$name}, votre demande d'abonnement {$plan} est en attente. Merci de passer a l'accueil avant le {$deadline} pour regler {$amount} MAD en especes et activer votre abonnement.",
                'ar' => "مرحبا {$name}، طلب اشتراكك في خطة {$plan} مازال في انتظار الأداء. المرجو زيارة استقبال القاعة قبل {$deadline} لأداء مبلغ {$amount} درهم نقدا وتفعيل الاشتراك.",
            ],
            'expiring_soon' => [
                'en' => "Hello {$name}, your {$plan} subscription expires on {$endDate}. You can visit the reception to renew it in cash.",
                'fr' => "Bonjour {$name}, votre abonnement {$plan} expire le {$endDate}. Vous pouvez passer a l'accueil pour le renouveler en especes.",
                'ar' => "مرحبا {$name}، اشتراكك في خطة {$plan} سينتهي بتاريخ {$endDate}. يمكنك زيارة استقبال القاعة لتجديد الاشتراك نقدا.",
            ],
            'expired' => [
                'en' => "Hello {$name}, your {$plan} subscription expired on {$endDate}. Please visit the reception to renew it.",
                'fr' => "Bonjour {$name}, votre abonnement {$plan} a expire le {$endDate}. Merci de passer a l'accueil pour le renouveler.",
                'ar' => "مرحبا {$name}، اشتراكك في خطة {$plan} انتهى بتاريخ {$endDate}. المرجو زيارة استقبال القاعة لتجديد الاشتراك.",
            ],
            'renewal' => [
                'en' => "Hello {$name}, you can renew your {$plan} subscription at the gym reception. Payment is accepted in cash only.",
                'fr' => "Bonjour {$name}, vous pouvez renouveler votre abonnement {$plan} a l'accueil de la salle. Le paiement se fait uniquement en especes.",
                'ar' => "مرحبا {$name}، يمكنك تجديد اشتراكك في خطة {$plan} عبر استقبال القاعة. الأداء يتم نقدا فقط.",
            ],
            'cancelled' => [
                'en' => "Hello {$name}, your subscription request was cancelled because the cash payment was not completed within the deadline. You can submit a new request from the platform.",
                'fr' => "Bonjour {$name}, votre demande d'abonnement a ete annulee car le paiement en especes n'a pas ete effectue dans le delai prevu. Vous pouvez creer une nouvelle demande depuis la plateforme.",
                'ar' => "مرحبا {$name}، تم إلغاء طلب اشتراكك لأن الأداء النقدي لم يتم داخل المهلة المحددة. يمكنك إرسال طلب جديد من المنصة.",
            ],
            'rejected' => [
                'en' => "Hello {$name}, your subscription request was rejected. Please contact the gym reception for more information or submit a new request from the platform.",
                'fr' => "Bonjour {$name}, votre demande d'abonnement a ete refusee. Merci de contacter l'accueil de la salle pour plus d'informations ou de soumettre une nouvelle demande depuis la plateforme.",
                'ar' => "مرحبا {$name}، تم رفض طلب اشتراكك. المرجو التواصل مع استقبال القاعة لمزيد من المعلومات أو إرسال طلب جديد من المنصة.",
            ],
        ];

        return $templates[$type][$language];
    }
}
