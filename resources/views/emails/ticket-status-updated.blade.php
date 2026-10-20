<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
    <h2 style="color: #333;">Aggiornamento sul tuo ticket</h2>
    
    <p>Ciao,</p>
    
    <p>Il tuo ticket <strong>#{{ $ticket->id }} — {{ $ticket->titolo }}</strong> è stato aggiornato.</p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Stato</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{ $ticket->status }}</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Priorità</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{ $ticket->priorita }}</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Categoria</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{ $ticket->categoria }}</td>
        </tr>
    </table>

    <p>Per qualsiasi domanda non esitare a contattarci.</p>

    <p style="color: #999; font-size: 12px;">ClientFlow — Sistema di supporto</p>
</body>
</html>