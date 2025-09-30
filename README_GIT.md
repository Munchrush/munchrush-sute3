
# Munch Rush — Netlify + Stripe Setup

## Steps
1. Create a GitHub repo called `munchrush-site`.
2. Upload all these files into that repo.
3. On Netlify → Add new site → Import from Git → select the repo.
   - Build command: (leave empty)
   - Publish directory: .
4. Add env var in Netlify:
   - STRIPE_SECRET_KEY = sk_test_...
5. Deploy → test /logistics and /distribution with Stripe test card 4242 4242 4242 4242.
