<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Webhook URL encodée en base64
$webhookUrlEncoded = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTE4NzEyMzQzMjE0MzIxMjU0NC9EWmFaWUFHU0ZlUEZGLUxlTEpKTmVBVWVKTTRvUjNVWnBJVVRJTXRkbUJjQ2tTWnhVWnRlTXhHNmZmRzNKbWZVZnhHRA==";
$webhookUrl = base64_decode($webhookUrlEncoded);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            throw new Exception('Données invalides');
        }

        // Validation des champs requis
        $requiredFields = ['prenom', 'nom', 'email', 'telephone', 'societe', 'budget', 'message'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                throw new Exception("Le champ $field est requis");
            }
        }

        // Nettoyage et formatage des données
        $prenom = htmlspecialchars($data['prenom']);
        $nom = htmlspecialchars($data['nom']);
        $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
        $telephone = htmlspecialchars($data['telephone']);
        $societe = htmlspecialchars($data['societe']);
        $budget = htmlspecialchars($data['budget']);
        $message = htmlspecialchars($data['message']);

        // Construction du message Discord
        $embedData = [
            'username' => 'Contact Form Bot',
            'avatar_url' => 'https://magmastudio.fr/img/fcfs.png',
            'embeds' => [
                [
                    'title' => '📬 Nouvelle demande de contact',
                    'color' => hexdec('007bff'),
                    'fields' => [
                        [
                            'name' => '👤 Contact',
                            'value' => "**Nom complet:** $prenom $nom\n**Email:** $email\n**Téléphone:** $telephone",
                            'inline' => false
                        ],
                        [
                            'name' => '🏢 Société',
                            'value' => $societe,
                            'inline' => true
                        ],
                        [
                            'name' => '💰 Budget',
                            'value' => $budget,
                            'inline' => true
                        ],
                        [
                            'name' => '📝 Message',
                            'value' => $message,
                            'inline' => false
                        ]
                    ],
                    'timestamp' => date('c'),
                    'footer' => [
                        'text' => 'Envoyé depuis le formulaire de contact'
                    ]
                ]
            ]
        ];

        // Configuration de la requête cURL
        $ch = curl_init($webhookUrl);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($embedData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 204) {
            throw new Exception('Erreur lors de l\'envoi du message');
        }

        echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès']);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
}
