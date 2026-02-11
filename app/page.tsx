export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-indigo-deep text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight">
              IndiGo <span className="text-blue-300">6E</span>
            </span>
            <span className="text-xs font-mono bg-white/10 rounded px-2 py-0.5">
              support&middot;bot
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#architecture" className="hover:text-blue-300 transition-colors">
              Architecture
            </a>
            <a href="#scenarios" className="hover:text-blue-300 transition-colors">
              Scenarios
            </a>
            <a href="#examples" className="hover:text-blue-300 transition-colors">
              Examples
            </a>
            <a href="#deeplink" className="hover:text-blue-300 transition-colors">
              Deep-Linked DMs
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="bg-indigo-deep text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col gap-6">
          <p className="text-sm font-mono text-blue-300 tracking-widest uppercase">
            X (Twitter) Customer Support Automation
          </p>
          <h1 className="text-5xl font-bold leading-tight max-w-3xl">
            Automated complaint resolution for{" "}
            <span className="text-blue-300">@IndiGo6E</span> on X
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
            An AI agent that monitors Twitter mentions in real-time, classifies
            customer complaints, and resolves them autonomously &mdash; from
            flight delays and PNR lookups to lost baggage tracking and medical
            refund processing &mdash; all while keeping passengers informed via
            deep-linked DMs.
          </p>
          <div className="flex gap-3 mt-4">
            <span className="bg-white/10 border border-white/20 text-xs font-mono rounded-full px-3 py-1">
              Convex Backend
            </span>
            <span className="bg-white/10 border border-white/20 text-xs font-mono rounded-full px-3 py-1">
              Edge Functions
            </span>
            <span className="bg-white/10 border border-white/20 text-xs font-mono rounded-full px-3 py-1">
              Unofficial XAPI &rarr; Scrape
            </span>
            <span className="bg-white/10 border border-white/20 text-xs font-mono rounded-full px-3 py-1">
              Official XAPI &rarr; Respond
            </span>
          </div>
        </div>
      </header>

      {/* ── Architecture ── */}
      <section id="architecture" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-indigo-deep mb-2">
          System Architecture
        </h2>
        <p className="text-slate-500 mb-12 max-w-2xl">
          How the <code className="bg-slate-100 text-indigo-blue px-1.5 py-0.5 rounded text-sm font-mono">backend/</code> directory,
          edge functions, and the X API work together.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm flex flex-col gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-deep text-white flex items-center justify-center text-lg font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold text-indigo-deep">
              Scraping via Unofficial XAPI
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              A Convex <strong>action</strong> (housed in{" "}
              <code className="text-xs bg-slate-100 rounded px-1 py-0.5 font-mono">
                backend/convex/
              </code>
              ) runs on a cron schedule and invokes an <strong>edge function</strong> that
              calls the <em>unofficial</em> X API endpoint to scrape the latest
              mentions and replies to <strong>@IndiGo6E</strong>. Because the unofficial
              API mirrors internal Twitter endpoints, it returns full tweet
              objects (text, author, conversation thread, media attachments)
              without consuming official rate limits.
            </p>
            <div className="mt-auto bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs font-mono text-slate-500 leading-relaxed">
                <span className="text-indigo-blue">convex/actions</span>{" "}
                &rarr; edge fn &rarr; <span className="text-indigo-blue">unofficial XAPI</span>{" "}
                &rarr; raw tweet JSON &rarr; Convex DB
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm flex flex-col gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-deep text-white flex items-center justify-center text-lg font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold text-indigo-deep">
              Classification &amp; Resolution in Convex
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Scraped tweets are stored in the Convex database via{" "}
              <strong>mutations</strong>. A downstream action classifies each
              tweet using an LLM into a handling category (delay, passenger
              record, baggage, refund, etc.) and extracts structured data
              (PNR, PIR numbers, flight numbers). The Convex{" "}
              <strong>query</strong> layer provides a real-time dashboard of
              open cases, resolution status, and agent activity.
            </p>
            <div className="mt-auto bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs font-mono text-slate-500 leading-relaxed">
                <span className="text-indigo-blue">mutation</span>{" "}
                (store tweet) &rarr;{" "}
                <span className="text-indigo-blue">action</span>{" "}
                (classify + resolve) &rarr;{" "}
                <span className="text-indigo-blue">query</span>{" "}
                (dashboard)
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm flex flex-col gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-deep text-white flex items-center justify-center text-lg font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold text-indigo-deep">
              Responding via Official X API
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Once a resolution is computed, a Convex action calls the{" "}
              <strong>official X API v2</strong> (OAuth 2.0, write scopes) to
              post the public reply or send a Direct Message. The official API
              is used exclusively for <em>outbound</em> communication &mdash;
              posting tweets, sending DMs, and uploading media &mdash; ensuring
              full compliance with X&rsquo;s Terms of Service for bot accounts.
            </p>
            <div className="mt-auto bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs font-mono text-slate-500 leading-relaxed">
                resolution &rarr;{" "}
                <span className="text-indigo-blue">convex/action</span>{" "}
                &rarr; <span className="text-indigo-blue">Official X API v2</span>{" "}
                &rarr; tweet / DM sent
              </p>
            </div>
          </div>
        </div>

        {/* Edge function detail */}
        <div className="mt-10 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-indigo-deep mb-3">
            Edge Functions &amp; the Backend Directory
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
            The <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">backend/</code> directory
            is a Next.js + Convex application. Convex functions
            (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">convex/myFunctions.ts</code>
            ) act as serverless edge functions that execute at the edge with
            zero cold-start. <strong>Actions</strong> handle all third-party
            HTTP calls (unofficial XAPI scraping, official XAPI posting,
            airline internal API lookups for PNR/PIR data).{" "}
            <strong>Mutations</strong> persist state (tweets, case records,
            resolution logs) into the Convex database.{" "}
            <strong>Queries</strong> power a real-time operator dashboard via
            Convex&rsquo;s reactive subscriptions. The Next.js frontend in{" "}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">app/</code> renders
            the dashboard and this landing page.
          </p>
        </div>
      </section>

      {/* ── Scenarios ── */}
      <section id="scenarios" className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-indigo-deep mb-2">
            Handling Scenarios
          </h2>
          <p className="text-slate-500 mb-12 max-w-2xl">
            Four core complaint categories the bot resolves autonomously.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Scenario 1 */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-indigo-deep text-white px-6 py-4 flex items-center gap-3">
                <span className="font-mono text-blue-300 text-sm">01</span>
                <h3 className="font-semibold text-lg">Delay Handling</h3>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-indigo-accent text-indigo-blue px-2 py-0.5 rounded">
                    Input: PNR
                  </span>
                  <span className="text-xs font-mono bg-indigo-accent text-indigo-blue px-2 py-0.5 rounded">
                    Context: PNR Lookup
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  When a passenger tweets about a delayed flight, the bot
                  extracts the <strong>PNR</strong> from the tweet text. A
                  Convex action performs a PNR lookup against the airline&rsquo;s
                  internal reservation system to pull real-time flight status,
                  updated ETD/ETA, gate changes, and rebooking options.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-500 leading-relaxed">
                  <p className="text-slate-400 mb-1"># Flow</p>
                  <p>tweet &rarr; extract PNR (e.g. &quot;J2PW3F&quot;)</p>
                  <p>&rarr; convex action: lookupPNR(pnr)</p>
                  <p>&rarr; fetch flight status from airline ops API</p>
                  <p>&rarr; compose delay update message</p>
                  <p>&rarr; reply via Official X API v2</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Auto-reply example:</strong> &ldquo;Hi! Your flight
                    6E-2834 (DEL&rarr;BOM) is currently delayed by ~45 min. New
                    ETD: 18:15 IST. Gate B12. We apologize for the
                    inconvenience. For rebooking options, send us a DM.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-indigo-deep text-white px-6 py-4 flex items-center gap-3">
                <span className="font-mono text-blue-300 text-sm">02</span>
                <h3 className="font-semibold text-lg">Passenger Information</h3>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-indigo-accent text-indigo-blue px-2 py-0.5 rounded">
                    Input: Mention
                  </span>
                  <span className="text-xs font-mono bg-indigo-accent text-indigo-blue px-2 py-0.5 rounded">
                    Context: General Inquiry
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  General passenger queries &mdash; baggage allowances, check-in
                  procedures, special assistance requests, wheelchair needs,
                  unaccompanied minor policies, or pet travel rules. The bot
                  classifies the intent and responds with the relevant policy
                  pulled from an IndiGo knowledge base indexed in Convex.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-500 leading-relaxed">
                  <p className="text-slate-400 mb-1"># Flow</p>
                  <p>tweet &rarr; classify intent (NLP / LLM)</p>
                  <p>&rarr; convex query: searchKnowledgeBase(intent)</p>
                  <p>&rarr; compose informational reply</p>
                  <p>&rarr; reply via Official X API v2</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Auto-reply example:</strong> &ldquo;Hi! IndiGo
                    allows 15kg check-in + 7kg cabin baggage on domestic flights.
                    For extra baggage, you can pre-book up to 30kg at a
                    discounted rate via the IndiGo app. Need help with something
                    specific? DM us!&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Scenario 3 */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-indigo-deep text-white px-6 py-4 flex items-center gap-3">
                <span className="font-mono text-blue-300 text-sm">03</span>
                <h3 className="font-semibold text-lg">Passenger Changes</h3>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-indigo-accent text-indigo-blue px-2 py-0.5 rounded">
                    Input: PNR
                  </span>
                  <span className="text-xs font-mono bg-indigo-accent text-indigo-blue px-2 py-0.5 rounded">
                    Context: Record Modification
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  When a passenger needs to modify their booking &mdash; name
                  corrections, date changes, flight swaps, seat upgrades, or
                  adding meals &mdash; the bot extracts the PNR and requested
                  change. A Convex action authenticates against the airline
                  PSS (Passenger Service System) and applies the modification
                  directly to the passenger record.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-500 leading-relaxed">
                  <p className="text-slate-400 mb-1"># Flow</p>
                  <p>tweet &rarr; extract PNR + requested change</p>
                  <p>&rarr; convex action: modifyPassengerRecord(pnr, change)</p>
                  <p>&rarr; authenticate against PSS API</p>
                  <p>&rarr; apply change to PNR record</p>
                  <p>&rarr; confirm via Official X API v2 reply + DM</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Auto-reply example:</strong> &ldquo;Hi! We&rsquo;ve
                    updated PNR Q5SHKM &mdash; your flight is now rescheduled to
                    Jan 18 (6E-834 DEL&rarr;BLR, 06:30). Confirmation details
                    sent to your DM. Any issues, just reply here.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Scenario 4 */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-indigo-deep text-white px-6 py-4 flex items-center gap-3">
                <span className="font-mono text-blue-300 text-sm">04</span>
                <h3 className="font-semibold text-lg">Lost Baggage Handling</h3>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-indigo-accent text-indigo-blue px-2 py-0.5 rounded">
                    Input: PIR Number
                  </span>
                  <span className="text-xs font-mono bg-indigo-accent text-indigo-blue px-2 py-0.5 rounded">
                    Context: BMS Integration
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Lost or delayed baggage complaints include a{" "}
                  <strong>PIR (Property Irregularity Report)</strong> number,
                  either extracted from the tweet or collected in the DM flow.
                  The bot injects the PIR into the airline&rsquo;s{" "}
                  <strong>Baggage Management System (BMS)</strong> via a Convex
                  action, retrieves the current tracking status, last-seen
                  location, and estimated delivery window.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-500 leading-relaxed">
                  <p className="text-slate-400 mb-1"># Flow</p>
                  <p>tweet &rarr; extract PIR (e.g. &quot;DELBMS12345&quot;)</p>
                  <p>&rarr; convex action: queryBMS(pir)</p>
                  <p>&rarr; inject PIR into Baggage Management System</p>
                  <p>&rarr; retrieve tracking status + ETA</p>
                  <p>&rarr; reply via Official X API v2 + DM with details</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Auto-reply example:</strong> &ldquo;Hi! Your bag
                    (PIR: DELBMS12345) was last scanned at DEL Terminal 2 and is
                    currently in transit to BLR. Estimated delivery: today by
                    20:00 IST. We&rsquo;ll DM you the courier tracking
                    link.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Refund Example ── */}
      <section id="examples" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-indigo-deep mb-2">
          Example: Medical Refund Issuance
        </h2>
        <p className="text-slate-500 mb-12 max-w-2xl">
          End-to-end flow for processing a refund when a passenger can&rsquo;t
          travel due to medical reasons. Demonstrates PNR injection and medical
          document ingestion via DM.
        </p>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200"></div>

          {/* Step 1 */}
          <div className="relative pl-16 pb-10">
            <div className="absolute left-3.5 w-5 h-5 rounded-full bg-indigo-deep border-4 border-white shadow"></div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-mono text-slate-400 mb-2">
                STEP 1 &mdash; Tweet Detected
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3">
                <p className="text-sm text-slate-700">
                  <strong className="text-indigo-blue">@passenger:</strong>{" "}
                  &ldquo;@IndiGo6E my mother was supposed to fly on 15th Jan
                  from Lucknow to Bengaluru. Due to a medical procedure she
                  can&rsquo;t travel. PNR: O1NNFY. Requesting full refund on
                  medical grounds. @DGCAIndia&rdquo;
                </p>
              </div>
              <p className="text-xs text-slate-500">
                The unofficial XAPI scraper picks up this mention. The Convex
                mutation stores the raw tweet with extracted entities:{" "}
                <code className="bg-slate-100 rounded px-1 py-0.5 font-mono">
                  PNR: O1NNFY
                </code>
                ,{" "}
                <code className="bg-slate-100 rounded px-1 py-0.5 font-mono">
                  category: medical_refund
                </code>
                ,{" "}
                <code className="bg-slate-100 rounded px-1 py-0.5 font-mono">
                  sentiment: urgent
                </code>
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative pl-16 pb-10">
            <div className="absolute left-3.5 w-5 h-5 rounded-full bg-indigo-deep border-4 border-white shadow"></div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-mono text-slate-400 mb-2">
                STEP 2 &mdash; PNR Injection &amp; Public Reply with Deep-Linked DM
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                A Convex action injects the PNR into the reservation system to
                verify the booking (flight 6E-2201, LKO&rarr;BLR, Jan 15,
                passenger: Mrs. Sharma). The bot then replies publicly via the{" "}
                <strong>Official X API v2</strong> with a{" "}
                <strong>deep-linked DM prompt</strong>:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3">
                <p className="text-sm text-slate-700">
                  <strong className="text-indigo-blue">@IndiGo6E:</strong>{" "}
                  &ldquo;Hi, we&rsquo;re sorry to hear about this. We&rsquo;ve
                  located your booking (PNR: O1NNFY). To process your medical
                  refund, we&rsquo;ll need a &lsquo;Not Fit to Fly&rsquo;
                  certificate.{" "}
                  <span className="underline text-indigo-blue font-medium">
                    Please send us a personal DM
                  </span>{" "}
                  with the required documents so we can fast-track this for
                  you.&rdquo;
                </p>
              </div>
              <p className="text-xs text-slate-500">
                The reply includes a{" "}
                <code className="bg-slate-100 rounded px-1 py-0.5 font-mono">
                  deep link
                </code>{" "}
                URL that opens a pre-filled DM conversation with @IndiGo6E. See
                the Deep-Linked DM section below for technical details.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative pl-16 pb-10">
            <div className="absolute left-3.5 w-5 h-5 rounded-full bg-indigo-deep border-4 border-white shadow"></div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-mono text-slate-400 mb-2">
                STEP 3 &mdash; Medical Document Ingestion via DM
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                The passenger opens the deep link and sends a DM containing
                their medical certificate (image/PDF). The unofficial XAPI
                scraper picks up the DM media attachment. A Convex action:
              </p>
              <ul className="text-sm text-slate-600 leading-relaxed list-disc list-inside mb-3 space-y-1">
                <li>
                  Downloads the attached document from the DM media URL
                </li>
                <li>
                  Runs OCR / document parsing to extract key fields (doctor
                  name, hospital, diagnosis, &ldquo;Not Fit to Fly&rdquo;
                  attestation, date)
                </li>
                <li>
                  Validates the document against IndiGo&rsquo;s medical waiver
                  policy (must be signed by treating doctor, must state
                  unfitness for air travel, must be dated within 7 days)
                </li>
                <li>
                  Stores the parsed document in Convex DB linked to the case
                  record
                </li>
              </ul>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-500 leading-relaxed">
                <p className="text-slate-400 mb-1"># Convex Action</p>
                <p>ingestMedicalDocument(caseId, dmMediaUrl)</p>
                <p>&nbsp;&nbsp;&rarr; fetch media from X CDN</p>
                <p>&nbsp;&nbsp;&rarr; OCR / parse PDF</p>
                <p>&nbsp;&nbsp;&rarr; validate against medical waiver policy</p>
                <p>&nbsp;&nbsp;&rarr; store parsed result in cases table</p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative pl-16 pb-10">
            <div className="absolute left-3.5 w-5 h-5 rounded-full bg-indigo-deep border-4 border-white shadow"></div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-mono text-slate-400 mb-2">
                STEP 4 &mdash; Refund Processing
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Once the medical document passes validation, the Convex action
                calls the airline&rsquo;s refund API with the PNR to initiate a
                full refund (medical waiver &mdash; cancellation fee waived per
                DGCA guidelines).
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-500 leading-relaxed">
                <p className="text-slate-400 mb-1"># Convex Action</p>
                <p>processRefund(pnr: &quot;O1NNFY&quot;, type: &quot;medical_waiver&quot;)</p>
                <p>&nbsp;&nbsp;&rarr; airline refund API: initiate full refund</p>
                <p>&nbsp;&nbsp;&rarr; receive refund reference number</p>
                <p>&nbsp;&nbsp;&rarr; update case status in Convex DB</p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative pl-16">
            <div className="absolute left-3.5 w-5 h-5 rounded-full bg-green-600 border-4 border-white shadow"></div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-mono text-slate-400 mb-2">
                STEP 5 &mdash; Confirmation via DM + Public Reply
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3">
                <p className="text-sm text-slate-700 mb-2">
                  <strong className="text-indigo-blue">DM to passenger:</strong>{" "}
                  &ldquo;Your medical documents have been verified and approved.
                  A full refund of INR 4,850 for PNR O1NNFY has been initiated.
                  Refund Ref: RF-20260115-O1NNFY. Expected in your account
                  within 5&ndash;7 business days. We wish your mother a speedy
                  recovery.&rdquo;
                </p>
                <p className="text-sm text-slate-700">
                  <strong className="text-indigo-blue">
                    Public reply:
                  </strong>{" "}
                  &ldquo;Hi, your medical refund request has been processed
                  successfully. Details have been sent to your DM. We hope your
                  mother feels better soon.&rdquo;
                </p>
              </div>
              <p className="text-xs text-slate-500">
                Both messages sent via the Official X API v2. The case is marked{" "}
                <code className="bg-green-100 text-green-800 rounded px-1 py-0.5 font-mono">
                  resolved
                </code>{" "}
                in the Convex dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Deep-Linked DMs ── */}
      <section
        id="deeplink"
        className="bg-indigo-deep text-white"
      >
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-2">
            Deep-Linked DMs
          </h2>
          <p className="text-slate-300 mb-10 max-w-2xl">
            How the &ldquo;send us a personal DM&rdquo; call-to-action works
            technically.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-5">
              <h3 className="font-semibold text-lg text-blue-300">
                How It Works
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                When the bot replies to a public tweet, it includes a{" "}
                <strong className="text-white">deep link URL</strong> that,
                when tapped on mobile or clicked on web, opens the X app / site
                directly into a DM conversation with @IndiGo6E. The URL can
                optionally pre-fill a message.
              </p>
              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <p className="text-xs font-mono text-blue-200 mb-2">
                  # Deep link URL format
                </p>
                <p className="text-sm font-mono text-white break-all">
                  https://twitter.com/messages/compose?recipient_id=&#123;indigo6e_user_id&#125;&amp;text=&#123;prefilled_text&#125;
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                The <code className="bg-white/10 rounded px-1.5 py-0.5 text-xs font-mono">
                  recipient_id
                </code>{" "}
                is @IndiGo6E&rsquo;s numeric X user ID. The optional{" "}
                <code className="bg-white/10 rounded px-1.5 py-0.5 text-xs font-mono">
                  text
                </code>{" "}
                parameter pre-fills the compose box with context like the PNR
                and case type, so the passenger doesn&rsquo;t have to retype
                anything.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <h3 className="font-semibold text-lg text-blue-300">
                Technical Details
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-3">
                <div>
                  <p className="text-xs font-mono text-slate-400 mb-1">
                    Public Reply (via Official X API v2)
                  </p>
                  <p className="text-sm text-slate-200">
                    &ldquo;We&rsquo;re looking into PNR O1NNFY for you. To share
                    your medical documents securely, please{" "}
                    <span className="underline text-blue-300">
                      send us a personal DM
                    </span>
                    .&rdquo;
                  </p>
                </div>
                <div className="h-px bg-white/10"></div>
                <div>
                  <p className="text-xs font-mono text-slate-400 mb-1">
                    What the link resolves to
                  </p>
                  <p className="text-xs font-mono text-blue-200 break-all">
                    https://twitter.com/messages/compose?recipient_id=2444390358&amp;text=Re%3A%20PNR%20O1NNFY%20%E2%80%93%20Medical%20Refund
                  </p>
                </div>
                <div className="h-px bg-white/10"></div>
                <div>
                  <p className="text-xs font-mono text-slate-400 mb-1">
                    What the passenger sees in DM compose
                  </p>
                  <p className="text-sm text-slate-200 bg-white/10 rounded p-2">
                    Re: PNR O1NNFY &mdash; Medical Refund
                  </p>
                </div>
                <div className="h-px bg-white/10"></div>
                <div>
                  <p className="text-xs font-mono text-slate-400 mb-1">
                    Why this matters
                  </p>
                  <p className="text-xs text-slate-300">
                    PNRs and medical documents are sensitive PII. Deep-linked DMs
                    move the conversation to a private channel automatically,
                    without requiring the passenger to figure out how to DM the
                    airline. The pre-filled text also links the DM to the
                    original case in the Convex backend for seamless context
                    continuity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tweet embed mockup */}
          <div className="mt-12 max-w-lg mx-auto">
            <p className="text-xs text-slate-400 text-center mb-3 font-mono">
              Example public reply with deep-linked DM CTA
            </p>
            <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-deep flex items-center justify-center">
                  <span className="text-white text-xs font-bold">6E</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    IndiGo{" "}
                    <span className="text-slate-400 font-normal">
                      @IndiGo6E
                    </span>
                  </p>
                  <p className="text-xs text-slate-400">Replying to @passenger</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-3">
                Hi, we&rsquo;re sorry to hear about this. We&rsquo;ve located
                your booking and want to help process your medical refund as
                quickly as possible.
              </p>
              <p className="text-sm leading-relaxed mb-3">
                Please{" "}
                <span className="text-indigo-blue font-semibold underline">
                  send us a personal DM
                </span>{" "}
                with your &ldquo;Not Fit to Fly&rdquo; certificate so we can
                fast-track this.
              </p>
              <p className="text-xs text-slate-400">
                3:42 PM &middot; Jan 15, 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-indigo-deep">
              IndiGo <span className="text-indigo-blue">6E</span>
            </span>
            <span className="text-xs text-slate-400">
              &middot; X Support Bot
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>
              Powered by{" "}
              <strong className="text-slate-600">Convex</strong> +{" "}
              <strong className="text-slate-600">Next.js</strong>
            </span>
            <span>&middot;</span>
            <span>Unofficial XAPI for ingestion</span>
            <span>&middot;</span>
            <span>Official X API v2 for responses</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
