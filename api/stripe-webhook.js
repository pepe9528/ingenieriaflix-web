import Stripe from 'stripe';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"|"$/g, ''),
    })
  });
}

const db = getFirestore();

// Es crucial deshabilitar el bodyParser en Vercel para procesar firmas de webhooks
export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(Buffer.from(data)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Firma de webhook inválida:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Escuchamos el evento de pago completado en Stripe Checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const itemId = session.metadata?.itemId;

    if (userId && itemId) {
      // Escribimos de forma definitiva el acceso premium del alumno
      await db.collection('compras').doc(`${userId}_${itemId}`).set({

        usuarioId: userId,  // Sincronizado con el estándar del frontend
        recursoId: itemId,  // Sincronizado con el estándar del frontend
        activo: true,
        sessionId: session.id,
        idTransaccion: session.payment_intent || session.id,
        fechaCompra: FieldValue.serverTimestamp() // Marca de tiempo oficial del servidor
      });
      console.log(`✅ ¡Compra procesada e indexada con éxito!: ${userId} → ${itemId}`);
    }
  }

  // Respuesta obligatoria para que Stripe no intente reenviar el evento
  res.status(200).json({ received: true });
}