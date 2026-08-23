/* Āfāq — what getting better actually looks like, per craft.
 *
 * The app's own charge sheet against every other hobby tracker is that it
 * "counts streaks instead of skill". A session count is not progress: fifty
 * hours of the same mistake is fifty hours of the same mistake. So none of the
 * rungs below is reached by accumulating anything. Each one names a thing you
 * can either do or not do, and you claim it when you can.
 *
 * Sessions still matter — as EVIDENCE, not as achievement. `need` is the number
 * of logged sessions before a rung can be claimed at all, and it exists to stop
 * the one failure this design is exposed to: reading a description, recognising
 * it, and ticking it. Recognising is not the same as being able to.
 *
 * THE TRIAL COMES FIRST. Every craft opens with a fixed number of sessions in
 * which nothing is graded, because grading yourself before you know whether you
 * like the thing is how people quit a craft they would have loved. The trial
 * length is not a constant — it is what the domain itself says: ten lessons for
 * horse riding, six weeks of shooting twice a week for archery, four one-to-one
 * lessons for swimming. Those numbers come from the practice, not from a rule.
 *
 * `fail` is the trap AT THAT RUNG, not a general warning. A trap you have
 * already walked past is not useful, and the one waiting three rungs ahead is
 * noise until you are near it.
 */

export const LADDERS = {

  /* Motorcycling has a real curriculum already — DRILLS in the Ride tab, with
     evidence attached to actual rides. A second ladder here would be a second
     version of the same truth, which is the thing this ecosystem exists to
     avoid. So this one only says where the real one is. */
  moto: {
    trial: 0,
    trialSay: 'Already yours. The ladder for this one lives in the Ride tab, where the drills are graded against logged rides rather than claimed.',
    defer: 'ride',
    rungs: []
  },

  khatt: {
    trial: 8,
    trialSay: 'Eight sheets, one letter form a week. You are finding out whether twenty quiet minutes with a pen is something you want, not whether you are any good.',
    rungs: [
      { k:'hand', n:'The hand', need:8,
        is:'You can hold the qalam at a fixed angle for a whole sheet without the nib drifting.',
        do:'All 28 Ruq‘ah forms in isolation, photographed. One a week.',
        fail:'Judging your sheet against a master’s finished page. Judge it against your own sheet from a month ago — that is the only comparison that contains information.' },
      { k:'join', n:'Joins', need:20,
        is:'Letters connect without the join being the ugliest part of the word.',
        do:'The join classes, then whole words. Slowly.',
        fail:'Speeding up because the letters are right. The join is the first thing speed destroys.' },
      { k:'line', n:'The line', need:40,
        is:'A whole line sits on its baseline with even spacing. The composition is the unit now, not the letter.',
        do:'Short phrases from a mashq sheet, whole lines only, never a fragment.',
        fail:'Repairing a bad letter mid-line. Finish the line, then start a new one — a repaired letter is visible forever.' },
      { k:'naskh', n:'Naskh', need:70,
        is:'A second hand, and with it the rhombic-dot proportional system that governs it.',
        do:'Naskh from a teacher’s mashq, alif height measured in dots rather than eyeballed.',
        fail:'Starting Naskh before Ruq‘ah is automatic. You end up with two mediocre hands and no everyday one.' },
      { k:'ijaza', n:'Under correction', need:120,
        is:'A teacher with an ijāza chain marks your sheets and you take the correction without arguing with it.',
        do:'Weekly submission. The chain is the whole point of this art.',
        fail:'Thuluth. Still not yet.' }
    ]
  },

  climb: {
    trial: 6,
    trialSay: 'Six sessions, borrowed shoes, no grade chasing. Long enough to know whether the problem-solving grips you or the forearms just hurt.',
    rungs: [
      { k:'fall', n:'Falling', need:6,
        is:'You can drop off a boulder problem on purpose and land without thinking about it.',
        do:'Practise falling from height deliberately, every session, before you climb.',
        fail:'Downclimbing everything. It feels responsible and it means you never learn the skill that keeps you climbing at your limit.' },
      { k:'feet', n:'Feet', need:15,
        is:'You place a foot silently and precisely, and you can climb a whole route watching your feet rather than your hands.',
        do:'Silent-feet drills and quiet traverses. Grades will drop first; that is the drill working.',
        fail:'Training grip. Footwork is the first thing to fail and grip is the last — training the wrong end holds you at one grade for a year.' },
      { k:'grit', n:'Outside', need:25,
        is:'You have climbed on real rock, read a route without tape, and been scared in a manageable way.',
        do:'Stanage is forty minutes away. Go with someone who has been.',
        fail:'Treating an outdoor grade as an indoor one. Outdoor V2 is not indoor V2, and the mismatch is where injuries happen.' },
      { k:'project', n:'Projecting', need:45,
        is:'You can work one problem across several sessions without needing to send something every visit.',
        do:'Pick something two grades above your flash level and stay with it for a month.',
        fail:'Session-grazing — twenty problems at your limit, none of them learned. Volume feels like progress and is not.' },
      { k:'lead', n:'On the sharp end', need:70,
        is:'You lead, you place or clip cleanly, and the fall is a decision rather than an accident.',
        do:'A lead course, then a regular partner. This is where climbing stops being a gym activity.',
        fail:'Leading at your top-rope grade. The head is the limiting system now, not the arms.' }
    ]
  },

  archery: {
    trial: 12,
    trialSay: 'Twice a week for six weeks — the club will insist and they are right. You cannot judge archery from one session; the whole discipline is what happens to you across many.',
    rungs: [
      { k:'form', n:'Form', need:12,
        is:'The same shot, repeated, without thinking about the sequence.',
        do:'Blank-bale shooting at close range with no target face at all.',
        fail:'Watching where the arrow lands. At this rung the arrow tells you nothing you can act on.' },
      { k:'group', n:'Grouping', need:25,
        is:'Your arrows land together, wherever they land. Tight and wrong beats scattered and centred.',
        do:'Shoot for group size, not score. Move the sight only when the group is tight.',
        fail:'Chasing the gold by adjusting your body. The sight moves; you do not.' },
      { k:'release', n:'The release', need:45,
        is:'A clean back-tension release you can feel, and you know a bad one before the arrow lands.',
        do:'Clicker work, and a coach watching for the collapse.',
        fail:'Target panic setting in unnoticed. If you cannot hold on gold without punching the release, stop scoring and go back to the blank bale.' },
      { k:'field', n:'Distance and weather', need:70,
        is:'You shoot outdoors at varied distances, in wind, and your sight marks are your own.',
        do:'Outdoor rounds through the season. Log conditions, not just scores.',
        fail:'Indoor-only archery. Eighteen metres in still air is a different sport.' },
      { k:'compete', n:'Under pressure', need:100,
        is:'You have shot a scored competition and your form held while it mattered.',
        do:'Enter a local round. The result is not the point; the nerves are the training stimulus.',
        fail:'Waiting to be good enough. Nobody is; the pressure is the missing input.' }
    ]
  },

  swim: {
    trial: 4,
    trialSay: 'Four one-to-one lessons. Adults almost always have a stroke fault they cannot see and cannot self-diagnose — four lessons is what it takes for someone to find it.',
    rungs: [
      { k:'breathe', n:'Breathing', need:4,
        is:'You can breathe bilaterally on front crawl without the stroke falling apart.',
        do:'Breathing drills only. Distance is irrelevant at this rung.',
        fail:'Swimming further to get fitter. You are technique-limited, not fitness-limited — that is exactly why adults plateau.' },
      { k:'body', n:'Body position', need:12,
        is:'You lie flat and high in the water. Legs stop sinking.',
        do:'Kick on your side, catch-up drill, and someone filming you from the side.',
        fail:'Kicking harder to lift the legs. Sinking legs are a head-position problem almost every time.' },
      { k:'catch', n:'The catch', need:25,
        is:'You feel the water at the front of the stroke and hold it, rather than slipping through it.',
        do:'Sculling and single-arm drills. Count strokes per length and watch the count fall.',
        fail:'Turnover rate. A fast arm that slips is slower than a slow arm that holds.' },
      { k:'distance', n:'Distance', need:45,
        is:'1500m continuous at a pace you could hold longer.',
        do:'Build volume now — the technique will survive it.',
        fail:'Letting the stroke degrade as the session goes on. If length 40 looks worse than length 4, the set was too long.' },
      { k:'open', n:'Open water', need:70,
        is:'You can swim in cold, murky water without a black line, and sight without stopping.',
        do:'A supervised open-water session. Cold-water acclimatisation is a skill of its own.',
        fail:'Assuming pool fitness transfers. It does not; the first cold-water breath is involuntary and needs practice.' }
    ]
  },

  horse: {
    trial: 10,
    trialSay: 'Ten lessons before deciding anything. Group lessons — cheaper, and you learn as much watching someone else get it wrong.',
    rungs: [
      { k:'seat', n:'Seat', need:10,
        is:'You stay balanced at walk and trot without gripping with your knees or relying on the reins.',
        do:'Lunge lessons with no reins and no stirrups. Undignified and the fastest route there is.',
        fail:'Steering with your hands. The hand is the last aid, not the first.' },
      { k:'aids', n:'Aids', need:25,
        is:'Leg, seat and hand work together, and the horse responds to a quiet ask.',
        do:'School figures — circles, transitions, changes of rein.',
        fail:'Escalating the aid instead of releasing it. Reward is the release, so a stronger ask teaches the horse to ignore the soft one.' },
      { k:'canter', n:'Canter', need:45,
        is:'You can strike off on the correct lead, sit the canter, and come back down without a fight.',
        do:'Transitions, repeatedly, both reins.',
        fail:'Only cantering on your good rein. Horses and riders both go crooked; the bad rein is the one that needs the work.' },
      { k:'out', n:'Hacking out', need:70,
        is:'You ride outside a school — traffic, other horses, things that move in hedges — and stay in charge.',
        do:'Ask about hacking from the start; a school-only rider is half a rider.',
        fail:'Assuming a horse behaves outdoors as it does in the arena. It does not, and that is the whole reason to go out.' },
      { k:'jump', n:'Over a fence, or deeper flat', need:100,
        is:'Either you jump a small course in balance, or your flatwork has moved into real lateral work.',
        do:'Pick one. Both are a discipline; doing neither is a plateau with lessons attached.',
        fail:'Paying for the same lesson for two years. If the content has not changed, neither have you.' }
    ]
  },

  photo: {
    trial: 5,
    trialSay: 'Five rolls. One camera, one film stock, one lens — enough exposures to find out whether the slowness is the appeal or the obstacle.',
    rungs: [
      { k:'expose', n:'Exposure', need:5,
        is:'You meter and expose correctly without bracketing, and you know why when you are wrong.',
        do:'One stock — HP5 — for a year. Never change two things at once.',
        fail:'Auto everything. The camera hides the variable you are trying to learn.' },
      { k:'develop', n:'Developing', need:12,
        is:'You develop black and white at home and get consistent negatives.',
        do:'A £40 kit and a dark bag. Same developer, same time, same temperature, every roll.',
        fail:'Changing developer to fix a shooting problem. Consistency first — you cannot debug two variables.' },
      { k:'see', n:'Seeing', need:25,
        is:'You can look at a scene and know whether there is a photograph in it before raising the camera.',
        do:'Shoot one roll a week and edit ruthlessly. Three keepers from 36 is a good roll.',
        fail:'Shooting more. The bottleneck moved from the camera to the eye and volume does not fix the eye.' },
      { k:'print', n:'Printing', need:45,
        is:'You make a physical print and it looks like what you intended.',
        do:'A darkroom session, or scan and print properly. A photograph you have never printed is unfinished.',
        fail:'Living on the screen. A backlit thumbnail flatters everything.' },
      { k:'body', n:'A body of work', need:70,
        is:'A set of twelve that belong together and were made on purpose, not collected afterwards.',
        do:'Choose a subject and stay with it for six months.',
        fail:'Confusing a good archive with a body of work. The second one has an argument.' }
    ]
  },

  wood: {
    trial: 6,
    trialSay: 'Six sessions. Sharpen, saw to a line, plane a face flat. If sharpening irritates you rather than settles you, hand-tool work is the wrong branch.',
    rungs: [
      { k:'sharp', n:'Sharpening', need:6,
        is:'You can put a shaving edge on a chisel in five minutes and you do it without being asked to.',
        do:'Learn one system and stop reading about the others.',
        fail:'Buying tools to avoid sharpening. A dull good chisel is worse than a sharp cheap one.' },
      { k:'line', n:'Sawing to a line', need:15,
        is:'You saw square and to the line, both directions, without correcting halfway.',
        do:'Practice cuts in scrap. Fifty of them.',
        fail:'Blaming the saw. It is almost always the stance and the grip.' },
      { k:'flat', n:'Flat, square, true', need:25,
        is:'You can bring a board to flat, square and to thickness with a plane, and check it honestly.',
        do:'Build the bench. It is both the first project and the tool everything else needs.',
        fail:'Trusting the eye. Winding sticks and a straight edge, every time.' },
      { k:'joint', n:'Joinery', need:45,
        is:'Dovetails and mortise-and-tenon that go together off the saw and need no filler.',
        do:'Fifty practice dovetails before you build anything you intend to keep.',
        fail:'Gap-filling. It teaches you nothing and you will see it every day for a decade.' },
      { k:'piece', n:'A finished piece', need:70,
        is:'A piece of furniture in daily use that you built, finished, and would build differently now.',
        do:'Something small and real. A stool beats a planned cabinet.',
        fail:'Never finishing. Finishing is a separate skill and the only way to learn it is to finish.' }
    ]
  },

  cook: {
    trial: 8,
    trialSay: 'Eight cooks from one tradition. Not eight recipes — eight goes at the same handful of techniques, for people who will tell you the truth.',
    rungs: [
      { k:'pick', n:'The tradition', need:8,
        is:'You have chosen one cuisine and can say what makes it itself rather than a set of dishes.',
        do:'Read its canon, not a listicle. Learn its five mother techniques.',
        fail:'Cooking across four cuisines. Breadth here is the enemy — you never get to the depth where the fun is.' },
      { k:'heat', n:'Heat', need:20,
        is:'You control heat by what you see and hear, not by a number in a recipe.',
        do:'Cook the same dish weekly and change one variable.',
        fail:'Following timings. A recipe timing is someone else’s pan on someone else’s hob.' },
      { k:'season', n:'Seasoning', need:35,
        is:'You taste and correct mid-cook — salt, acid, fat, heat — without a recipe telling you to.',
        do:'Deliberately under- and over-season on purpose so you know both edges.',
        fail:'Seasoning only at the end. It is a process, not a step.' },
      { k:'feed', n:'Feeding people', need:60,
        is:'You can cook for six and have everything land hot at once.',
        do:'Invite people from week one — that is the whole feedback loop.',
        fail:'Cooking only for yourself. You lose the honest signal and the reason.' },
      { k:'own', n:'Off the page', need:90,
        is:'You cook a dish of that tradition without a recipe and it is right.',
        do:'Close the book. Get it wrong a few times.',
        fail:'Improvising before the techniques are automatic. That is not creativity, it is guessing.' }
    ]
  },

  fell: {
    trial: 6,
    trialSay: 'Six walks in boots and a waterproof. The Peak is on the doorstep — six days out is enough to know whether weather is an obstacle or part of the point.',
    rungs: [
      { k:'kit', n:'Out in weather', need:6,
        is:'You go out in bad weather and it is uneventful, because you are dressed for it.',
        do:'Boots and a real waterproof. Nothing else yet.',
        fail:'Buying gear before going. Every gap in your kit is obvious after one wet day and invisible before it.' },
      { k:'nav', n:'Navigation', need:15,
        is:'Map and compass, in cloud, without the phone.',
        do:'Deliberately navigate a leg on the map when you could have used GPS.',
        fail:'Phone dependence. It fails in exactly the conditions that make navigation matter.' },
      { k:'long', n:'Long days', need:30,
        is:'Twenty kilometres over rough ground and you finish able to do it again tomorrow.',
        do:'Kinder, then Bleaklow, then the Edges. Build the day length.',
        fail:'Distance without ascent. Flat miles do not prepare you for the hills.' },
      { k:'run', n:'Running it', need:50,
        is:'You can run the descents and keep moving on the flat, over ground you would previously have walked.',
        do:'Start on tracks, not open moor. Descending is the skill, not the ascent.',
        fail:'Running the ups. Everyone walks the steep ups, including winners.' },
      { k:'solo', n:'Big and self-reliant', need:80,
        is:'A long day alone, in winter, with the right decisions made before you needed them.',
        do:'Leave a route plan. Build the turn-back rule into the plan, not the moment.',
        fail:'Summit fever. The decision to turn round is made in the kitchen, not on the ridge.' }
    ]
  },

  bind: {
    trial: 5,
    trialSay: 'Five books, about £30 of kit. Pamphlet stitch first. Bind your own notes — the stakes are exactly right for learning.',
    rungs: [
      { k:'stitch', n:'Pamphlet and coptic', need:5,
        is:'A pamphlet stitch and a coptic binding that open flat and hold.',
        do:'Bone folder, awl, linen thread, PVA. Repetition, not new structures.',
        fail:'Collecting structures. Two done well beats six attempted.' },
      { k:'fold', n:'Folding and grain', need:12,
        is:'You find paper grain by hand and your folds are square without measuring twice.',
        do:'Fold a hundred signatures. Notice how the wrong grain fights you.',
        fail:'Ignoring grain direction. It is why a book will not stay shut, and it is invisible until it is permanent.' },
      { k:'case', n:'Case binding', need:25,
        is:'A hard-cased book with square corners and a spine that does not crack.',
        do:'Cloth first, then paper over board. Measure the joint gap properly.',
        fail:'Rushing the pressing. Everything in this craft is glue and time.' },
      { k:'repair', n:'Repair', need:45,
        is:'You can rebind or repair a damaged book without making it worse.',
        do:'Start with a charity-shop paperback nobody will miss.',
        fail:'Over-restoring. Reversibility is the ethic; a repair should be undoable.' },
      { k:'edition', n:'An edition', need:70,
        is:'Five copies of the same book, consistent enough that nobody could pick the first from the last.',
        do:'Consistency is the whole test. Batch each step.',
        fail:'One-offs forever. Variation hides sloppiness; a batch of five exposes it.' }
    ]
  },

  garden: {
    trial: 8,
    trialSay: 'Eight sessions on a plot. Year one is soil, not vegetables — the trial is finding out whether the slow return suits you.',
    rungs: [
      { k:'soil', n:'Soil', need:8,
        is:'You know your soil — texture, drainage, pH — and you have started feeding it.',
        do:'Compost, mulch, and a soil test. Nothing else in year one matters as much.',
        fail:'Planting first. The soil is the machine; the plants are the output.' },
      { k:'six', n:'Six things well', need:20,
        is:'Six crops grown from seed to harvest, on purpose, with notes.',
        do:'Six, not twenty. Pick ones that suit the plot, not ones you like eating.',
        fail:'Over-sowing in April. Every allotment’s first year dies of enthusiasm in July.' },
      { k:'succession', n:'Succession', need:40,
        is:'Something is ready every week of the season, because you sowed in waves.',
        do:'A sowing calendar you actually follow. Sow small and often.',
        fail:'A glut and then nothing. One sowing of everything is the beginner signature.' },
      { k:'save', n:'Closing the loop', need:70,
        is:'You save your own seed and make your own compost, and the plot needs less bought input than it did.',
        do:'Start with the easy seed savers — beans, tomatoes, lettuce.',
        fail:'Saving from F1 hybrids and wondering why year two is strange.' },
      { k:'year', n:'A full rotation', need:110,
        is:'Three or four years in, with a rotation running and records showing what actually worked here.',
        do:'Keep the notebook. The plot teaches you things no book can, and only if you wrote them down.',
        fail:'Repeating year one four times. Without records that is exactly what happens.' }
    ]
  },

  machine: {
    trial: 5,
    trialSay: 'Five evenings, one project with a real user — you. ESP32, not a kit. Finding out whether debugging is satisfying or maddening.',
    rungs: [
      { k:'blink', n:'It runs', need:5,
        is:'You can get code onto a board and read a sensor without following a tutorial line by line.',
        do:'One project you actually want. Finish it badly rather than plan it well.',
        fail:'Kits. They are a guided tour, not a skill.' },
      { k:'debug', n:'Debugging', need:12,
        is:'When it does not work you can find out why, with a meter and a scope trace rather than by swapping parts.',
        do:'Buy a multimeter before another dev board. Learn to bisect a problem.',
        fail:'Shotgun debugging — changing three things and rerunning. You learn nothing when it works.' },
      { k:'circuit', n:'Your own circuit', need:25,
        is:'You design a small circuit from a datasheet rather than copying a reference schematic.',
        do:'Read datasheets properly. That is the skill that separates makers from copyists.',
        fail:'Trusting a schematic from a blog. Half of them are wrong and none of them are for your part.' },
      { k:'pcb', n:'A board', need:45,
        is:'A PCB you designed, ordered, assembled and which works.',
        do:'KiCad, and a simple two-layer board. The first one will have a mistake; that is the lesson.',
        fail:'Designing something complex first. Get the whole loop — design, order, assemble, debug — done once on something trivial.' },
      { k:'ship', n:'Something that lives', need:70,
        is:'A device in daily use, in an enclosure, that someone other than you could operate.',
        do:'Enclosure, power, and a failure mode that is not "unplug it". This is the whole gap between a demo and a thing.',
        fail:'Breadboards forever. A project on a breadboard is a project you have not finished.' }
    ]
  },

  motomaint: {
    trial: 5,
    trialSay: 'Five sessions on your own bike. Chain, pressures, pad wear — the three that matter. You are finding out whether you trust yourself with the machine you ride.',
    rungs: [
      { k:'three', n:'The three', need:5,
        is:'Chain tension and lube, tyre pressures, pad wear — checked by you, on schedule, without prompting.',
        do:'A torque wrench before anything else. The Haynes manual for your exact model.',
        fail:'Guessing torque. On a motorcycle the fastener that matters is the one you overtightened.' },
      { k:'fluids', n:'Fluids and filters', need:12,
        is:'Oil, filter, coolant and brake fluid changed properly, with the old fluid disposed of properly.',
        do:'Follow the manual’s sequence exactly, the first three times.',
        fail:'Skipping the bleed procedure. Air in a brake line is not a thing to learn by feel.' },
      { k:'diag', n:'Diagnosis', need:25,
        is:'A noise or a symptom leads you to a cause, rather than to a forum thread.',
        do:'Write down the symptom before searching. Then check whether the forum matches your evidence.',
        fail:'Parts-cannon. Replacing until it stops is expensive and teaches nothing.' },
      { k:'susp', n:'Suspension and geometry', need:45,
        is:'Sag set, damping adjusted for your weight and your roads, and you can feel the difference.',
        do:'Measure static and rider sag properly. Change one click at a time and ride the same road.',
        fail:'Setting it once. Suspension is the biggest free improvement on most bikes and almost nobody revisits it.' },
      { k:'strip', n:'Deep work', need:70,
        is:'A job that needs the bike apart — valve clearances, fork rebuild, wheel bearings — done by you and signed off.',
        do:'Book a weekend, buy the right tools, and have a plan for getting to work on Monday.',
        fail:'Starting a strip-down without the parts on the shelf. A bike in pieces waiting for a courier stops being a hobby.' }
    ]
  },

  sail: {
    trial: 4,
    trialSay: 'RYA Level 1 and 2 over one weekend. Four sessions on the water is enough to know whether the wind is fascinating or just cold.',
    rungs: [
      { k:'l2', n:'Level 2', need:4,
        is:'You can sail a dinghy in light wind, on all points of sail, and get back to where you started.',
        do:'RYA Level 1 and 2. Dinghy before yacht, always.',
        fail:'Going straight to a yacht. A dinghy tells you instantly when you are wrong; a yacht hides it.' },
      { k:'capsize', n:'Capsize and recovery', need:10,
        is:'You capsize and right the boat without help, and it is boring.',
        do:'Practise it on purpose, in warm weather, before it happens by accident in cold.',
        fail:'Avoiding the drill. The one time it matters will not be a warm day.' },
      { k:'wind', n:'Reading wind and water', need:22,
        is:'You see gusts and shifts on the water before you feel them, and you use them.',
        do:'Sail the same water repeatedly. Local knowledge is most of it.',
        fail:'Watching the sail instead of the water. The information arrives on the surface first.' },
      { k:'blow', n:'Real weather', need:40,
        is:'Force 4 or 5 and you are still in control and enjoying it.',
        do:'Go out in more wind than is comfortable, with a safety boat around.',
        fail:'Only sailing in perfect conditions. That is the majority of club sailors and the reason they stay there.' },
      { k:'passage', n:'Passage and navigation', need:65,
        is:'You plan and complete a passage — tides, hazards, a bail-out plan — and it goes as planned.',
        do:'Day Skipper theory. Tides are the thing inland sailing never teaches.',
        fail:'Navigating by chartplotter alone. It is right until it is not.' }
    ]
  },

  arabicdeep: {
    trial: 10,
    trialSay: 'Ten sessions with a structured text and a teacher — not an app. Twenty minutes daily beats three hours weekly, and ten days tells you whether the grammar itself interests you.',
    rungs: [
      { k:'iraab', n:'Iʿrāb basics', need:10,
        is:'You can parse a simple sentence — mubtadaʾ, khabar, fāʿil, mafʿūl — and explain each ending.',
        do:'One structured matn with a teacher. Ājurrūmiyyah is the standard entry.',
        fail:'Vocabulary. It feels like progress and it is not the bottleneck — the bottleneck is structure.' },
      { k:'sarf', n:'Ṣarf', need:25,
        is:'You recognise the forms and can derive from a root without a table in front of you.',
        do:'The ten forms, drilled until they are automatic. This is rote and it is unavoidable.',
        fail:'Skipping ṣarf because naḥw is more interesting. Half the ambiguity in a verse is morphological.' },
      { k:'quran', n:'Applied to the Qurʾān', need:45,
        is:'You parse an āyah you have not seen before and the grammar changes what you understand it to say.',
        do:'Apply it to the Qurʾān the same week you learn it. Never bank it for later.',
        fail:'Learning grammar as a subject. It is an instrument; unapplied it decays and you will not notice.' },
      { k:'text', n:'A text end to end', need:80,
        is:'You have read a classical text through with a teacher, not excerpts.',
        do:'Finish one matn completely before starting another.',
        fail:'Collecting beginnings. Three texts half-read is nothing; one finished is a foundation.' },
      { k:'balagha', n:'Balāghah', need:130,
        is:'You can say why a construction was chosen over an equivalent one — the rhetorical question, the fronted object.',
        do:'This is where the language stops being decoded and starts being read.',
        fail:'Arriving here without the ṣarf automatic. Balāghah on a shaky base is guesswork with vocabulary.' }
    ]
  },

  run: {
    trial: 8,
    trialSay: 'Eight runs, all easy, all slower than feels correct. Parkrun on Saturday for free measured feedback. Eight runs is enough for the legs to stop protesting and the question to become real.',
    rungs: [
      { k:'easy', n:'Easy is easy', need:8,
        is:'You can hold a conversation for a whole easy run, and you do it without checking pace.',
        do:'Run slower than feels correct. Almost everyone runs easy runs too fast.',
        fail:'The grey zone — every run moderately hard. It is too slow to be a stimulus and too fast to recover from.' },
      { k:'volume', n:'Volume', need:20,
        is:'A consistent weekly mileage you can repeat, built by no more than 10% at a time.',
        do:'Consistency over any single long run. Four weeks the same beats one big week.',
        fail:'Building volume and intensity in the same week. Pick one.' },
      { k:'long', n:'The long run', need:35,
        is:'A weekly long run that leaves you tired rather than broken.',
        do:'Add ten minutes a fortnight. Fuel it once it passes ninety minutes.',
        fail:'Racing the long run. It is an aerobic session, not a time trial.' },
      { k:'quality', n:'Quality work', need:55,
        is:'One structured hard session a week — intervals or a tempo — executed at the right effort, not as hard as possible.',
        do:'One session. Two is how most amateurs get injured.',
        fail:'Time-trialling every interval session. If the last rep is much slower than the first, the target was wrong.' },
      { k:'race', n:'A race, properly', need:85,
        is:'A race run to a plan you set beforehand and held to, whatever the first mile felt like.',
        do:'Pick a distance and build a block for it. The plan is the thing being tested.',
        fail:'Going out fast because it feels easy. It always feels easy for two miles.' }
    ]
  },

  coffee: {
    trial: 6,
    trialSay: 'Six weeks, one method, one coffee. The grinder matters more than the brewer. You are finding out whether the small differences are interesting or invisible.',
    rungs: [
      { k:'one', n:'One method', need:6,
        is:'A repeatable brew — same dose, same water, same time — that tastes the same twice running.',
        do:'V60 or AeroPress. One of them, for three months.',
        fail:'Buying a second brewer. Variety before repeatability means you never learn what any variable does.' },
      { k:'vary', n:'One variable at a time', need:18,
        is:'You can change grind alone and predict which way the cup moves.',
        do:'Change one thing per brew and write it down. Scales and a timer.',
        fail:'Changing grind and dose together. Now the result means nothing.' },
      { k:'taste', n:'Naming it', need:35,
        is:'You can say why a cup is bad — under-extracted, over-extracted, stale, wrong ratio — rather than just that it is.',
        do:'Deliberately brew a bad cup at each edge so you know both tastes.',
        fail:'Chasing "good" without a vocabulary. Without names for the faults you cannot correct anything.' },
      { k:'origin', n:'Origin and roast', need:55,
        is:'You taste a coffee and can say something true about its origin or roast level before reading the bag.',
        do:'Buy from one roaster across origins, then one origin across roasters.',
        fail:'Buying only what you already like. That is a preference, not a palate.' },
      { k:'dial', n:'Dialling in blind', need:80,
        is:'A new bag, three brews, dialled in — without a recipe card from the roaster.',
        do:'Cover the bag’s suggestions and work it out from taste.',
        fail:'Following the roaster’s recipe forever. It is a starting point on their water and their grinder.' }
    ]
  },

  chess: {
    trial: 10,
    trialSay: 'Ten long games, each reviewed. Tactics puzzles daily, openings never. Ten reviewed games tells you whether the thinking is enjoyable or just stressful.',
    rungs: [
      { k:'blunder', n:'Blunder-check', need:10,
        is:'You check every move for the opponent’s reply before playing it, every time.',
        do:'Long games only. Review every loss and name the losing move.',
        fail:'Blitz. It trains the pattern-recognition you already have and none of the calculation you lack.' },
      { k:'tactic', n:'Tactics', need:25,
        is:'You see forks, pins and discovered attacks reliably, in your own games and not only in puzzles.',
        do:'Daily puzzles. Openings still never.',
        fail:'Studying openings. Below a decent club level almost every game is decided by a tactic, not the opening.' },
      { k:'endgame', n:'Endgames', need:45,
        is:'King and pawn endings, opposition, basic rook endings — known, not guessed.',
        do:'Learn endgames before openings. It is the reverse of what everyone does and it is correct.',
        fail:'Resigning "lost" endings. Most club endgames are drawn or won by whoever knows the technique.' },
      { k:'plan', n:'Planning', need:70,
        is:'You can look at a quiet position and produce a plan, rather than waiting for a tactic.',
        do:'Study annotated master games in structures you actually play.',
        fail:'Playing hope chess — a move that only works if they miss it.' },
      { k:'club', n:'Over the board', need:100,
        is:'You play in a club or a rated tournament, and your play holds up with a clock and a person opposite.',
        do:'A club, so it is social rather than a phone habit.',
        fail:'Online-only rating chasing. A rating is a number; a club is a source of stronger opponents who explain things.' }
    ]
  },

  oud: {
    trial: 8,
    trialSay: 'The fiqh question first, properly and on its own terms. Then eight lessons with a teacher — maqām is not self-taught from video, and eight sessions is enough to hear whether the sound pulls you.',
    rungs: [
      { k:'hold', n:'Hold and tone', need:8,
        is:'You produce a clean tone with the risha, consistently, on every course.',
        do:'A teacher from the first lesson. Tone is the thing video cannot correct.',
        fail:'Chasing melodies before tone. A right note with a bad tone is still wrong.' },
      { k:'maqam', n:'A first maqām', need:20,
        is:'You can play Rāst or Bayātī in position and hear when a note is out — including the quarter tones.',
        do:'One maqām until it is in your ear, not four at once.',
        fail:'Equal-temperament ears. The intervals are the whole identity of the music and Western tuning fights them.' },
      { k:'taqsim', n:'Taqsīm', need:40,
        is:'You can improvise a short taqsīm that stays inside the maqām and resolves properly.',
        do:'Listen far more than you play. Imitate whole phrases from recordings.',
        fail:'Improvising before the maqām is internalised. It comes out as wandering rather than as speech.' },
      { k:'rhythm', n:'Īqāʿ', need:65,
        is:'You hold a rhythmic cycle — samāʿī thaqīl, maqsūm — while playing melody over it.',
        do:'Count out loud. Play with a percussionist as soon as you can.',
        fail:'Rubato everything. The free sections mean something because the metered ones exist.' },
      { k:'with', n:'With others', need:95,
        is:'You play in a takht or with other musicians and hold your part.',
        do:'Find people. This music is ensemble music and solo practice has a ceiling.',
        fail:'Practising alone indefinitely. The ceiling arrives quietly and looks like a plateau in technique.' }
    ]
  }
};

/** Trial length for a hobby, or a sane default for one with no ladder written yet. */
export const trialFor = id => LADDERS[id]?.trial ?? 6;
export const ladderFor = id => LADDERS[id] || null;
