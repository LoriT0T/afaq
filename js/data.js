/* Āfāq — all content lives here. Views read from it; nothing is hardcoded in templates.
 * To change what the app says — add a title, a drill, a destination, a pursuit — edit
 * this file only. */

export const APP = {
  name: 'Āfāq',
  ar: 'آفاق',
  line: 'Screen, road, craft and travel — one model of what you actually love, fitted to what you actually did.',
  verse: 'سَنُرِيهِمْ آيَاتِنَا فِي الْآفَاقِ وَفِي أَنفُسِهِمْ',
  verseEn: '“We will show them Our signs in the horizons and within themselves.” — Fuṣṣilat 41:53',
  why: 'Every tracker stores. None of them select. A watchlist only grows, a someday-list only grows, and a hobby app counts streaks instead of skill. Āfāq predicts before you go, compares against what you report, and moves. If the prediction never gets better, the app is not working — and it will say so.'
};

/* =====================================================================
   SCREEN — eight axes, scored 0..1, chosen to be as close to orthogonal
   as hand-scoring allows. Genre is deliberately not an axis: "anime"
   contains both Mushishi and Mob Psycho, so it predicts nothing.
   ===================================================================== */
export const AXES = [
  { k:'int', n:'Interiority', lo:'plot-driven',   hi:'inner life' },
  { k:'den', n:'Density',     lo:'sparse',        hi:'dense' },
  { k:'amb', n:'Ambiguity',   lo:'clear line',    hi:'genuinely unresolved' },
  { k:'crf', n:'Craft',       lo:'story-first',   hi:'form-first' },
  { k:'mel', n:'Weight',      lo:'light',         hi:'heavy' },
  { k:'sys', n:'Systems',     lo:'vibes',         hi:'rule-driven world' },
  { k:'spc', n:'Spectacle',   lo:'still',         hi:'kinetic' },
  { k:'pce', n:'Pace',        lo:'slow burn',     hi:'propulsive' },
  /* Added 2026-08-22 from Musaed's own top tier. The eight above were built for
   * prestige film and could not separate his 9s from his 5s. These two can:
   * he named "too serious not fun" as the reason Suits and Billions failed,
   * and every title in his top tier has a protagonist climbing a visible ladder. */
  { k:'prg', n:'Progression', lo:'static',        hi:'visible ladder' },
  { k:'snc', n:'Sincerity',   lo:'ironic',        hi:'earnest' }
];

/* x is in AXES order. adv = content heads-up tags, used by the advisory filter. */
export const CATALOGUE = [
  /* ---- anime ---- */
  { id:'mushishi', t:'Mushishi', yr:2005, k:'anime', len:'46 ep', x:[.85,.25,.45,.80,.55,.60,.10,.10,0.1,0.85], adv:[],
    why:'Episodic natural philosophy. A wandering naturalist studies life-forms that are neither good nor evil, and neither is anyone else.' },
  { id:'vinland', t:'Vinland Saga', yr:2019, k:'anime', len:'48 ep', x:[.80,.55,.75,.70,.85,.50,.75,.50,0.7,0.9], adv:['violence','gore'],
    why:'A revenge story that spends its entire length dismantling revenge. The second season is the argument.' },
  { id:'monster', t:'Monster', yr:2004, k:'anime', len:'74 ep', x:[.75,.70,.90,.65,.85,.45,.30,.40,0.25,0.85], adv:['violence'],
    why:'Urasawa. One surgeon’s single ethical choice, compounding for seventy-four episodes.' },
  { id:'logh', t:'Legend of the Galactic Heroes', yr:1988, k:'anime', len:'110 ep', x:[.60,.90,.85,.50,.70,.90,.50,.35,0.6,0.85], adv:['violence'],
    why:'A genuine treatise on whether a competent autocracy beats a corrupt democracy. Talky, enormous, unmatched.' },
  { id:'pingpong', t:'Ping Pong the Animation', yr:2014, k:'anime', len:'11 ep', x:[.85,.60,.40,.95,.50,.35,.85,.80,0.85,0.85], adv:[],
    why:'Yuasa. The ugliest-looking and best-directed sports anime ever made; the drawing is doing the psychology.' },
  { id:'hyouka', t:'Hyouka', yr:2012, k:'anime', len:'22 ep', x:[.75,.55,.30,.85,.30,.50,.20,.25,0.2,0.7], adv:[],
    why:'Deduction at the smallest possible stakes, shot like a film. The stakes being small is the point.' },
  { id:'shinsekai', t:'From the New World', yr:2012, k:'anime', len:'25 ep', x:[.60,.70,.85,.70,.90,.95,.50,.45,0.35,0.8], adv:['violence','sex'],
    why:'The most rigorous worldbuilding in the medium: a functioning utopia whose mechanism is monstrous, and every rule holds.' },
  { id:'sonnyboy', t:'Sonny Boy', yr:2021, k:'anime', len:'12 ep', x:[.80,.80,.70,.90,.70,.85,.40,.40,0.3,0.7], adv:[],
    why:'Castaway students discover local physics is negotiable. Refuses to explain itself, and is better for it.' },
  { id:'planetes', t:'Planetes', yr:2003, k:'anime', len:'26 ep', x:[.75,.55,.60,.60,.60,.80,.35,.35,0.45,0.8], adv:[],
    why:'Orbital debris collection as blue-collar labour. The most plausible space anime, and quietly the most humane.' },
  { id:'march', t:'March Comes in Like a Lion', yr:2016, k:'anime', len:'44 ep', x:[.95,.55,.40,.85,.75,.40,.20,.20,0.75,0.95], adv:[],
    why:'Depression, borrowed family and shogi. The interiority ceiling for the medium.' },
  { id:'frieren', t:'Frieren: Beyond Journey’s End', yr:2023, k:'anime', len:'28 ep', x:[.85,.30,.35,.75,.60,.55,.45,.15,0.35,0.9], adv:[],
    why:'An elf realises that in a decade-long quest she never once learned what the humans were. Then spends the series learning.' },
  { id:'dungeonmeshi', t:'Delicious in Dungeon', yr:2024, k:'anime', len:'24 ep', x:[.40,.60,.35,.60,.35,.95,.55,.50,0.55,0.75], adv:[],
    why:'A dungeon crawl where the ecology is the actual subject. Every creature has a trophic level and every rule is obeyed.' },
  { id:'steinsgate', t:'Steins;Gate', yr:2011, k:'anime', len:'24 ep', x:[.65,.70,.55,.50,.75,.90,.45,.70,0.4,0.9], adv:[],
    why:'Time travel with a stated mechanism and a real price. Endure the first eight episodes; they are load-bearing.' },
  { id:'bebop', t:'Cowboy Bebop', yr:1998, k:'anime', len:'26 ep', x:[.70,.40,.60,.90,.60,.40,.75,.60,0.15,0.65], adv:['violence','music'],
    why:'Episodic, jazz-scored, and the reason the craft ceiling of the medium moved where it did.' },
  { id:'rakugo', t:'Shouwa Genroku Rakugo Shinjuu', yr:2016, k:'anime', len:'25 ep', x:[.95,.65,.70,.90,.80,.35,.15,.20,0.7,0.9], adv:['romance'],
    why:'Adults, a dying performance art, and the price of a life given entirely to a craft. Nearly nothing else in the medium attempts this.' },
  { id:'gitl', t:'Girls’ Last Tour', yr:2017, k:'anime', len:'12 ep', x:[.80,.20,.40,.75,.70,.45,.15,.10,0.05,0.85], adv:[],
    why:'Two girls, one half-track, a dead world. Quiet is not the tone here, it is the design.' },
  { id:'mob', t:'Mob Psycho 100', yr:2016, k:'anime', len:'37 ep', x:[.70,.50,.35,.95,.35,.40,.95,.85,0.8,0.9], adv:[],
    why:'The strongest esper alive learns that the power was never the interesting part. Animation as pure kinesis.' },
  { id:'lustrous', t:'Land of the Lustrous', yr:2017, k:'anime', len:'12 ep', x:[.75,.50,.65,.90,.80,.85,.70,.50,0.75,0.85], adv:['violence'],
    why:'The one time 3DCG in anime fully justified itself — gemstone bodies that could not be drawn any other way.' },
  { id:'apothecary', t:'The Apothecary Diaries', yr:2023, k:'anime', len:'24 ep', x:[.50,.60,.45,.70,.35,.70,.30,.45,0.45,0.7], adv:[],
    why:'A poisons expert solves court intrigue by method rather than intuition. Rare: the deductions actually work.' },
  { id:'pluto', t:'Pluto', yr:2023, k:'anime', len:'8 ep', x:[.80,.60,.80,.80,.85,.60,.50,.40,0.3,0.85], adv:['violence'],
    why:'Urasawa again — robots, war guilt, and what a soul would have to be for the question to mean anything.' },

  /* ---- film ---- */
  { id:'arrival', t:'Arrival', yr:2016, k:'film', len:'116 min', x:[.85,.60,.50,.85,.75,.80,.40,.30,0.25,0.8], adv:[],
    why:'Linguistics as first contact. The structure of the film is the thesis of the film.' },
  { id:'br2049', t:'Blade Runner 2049', yr:2017, k:'film', len:'164 min', x:[.80,.35,.70,.95,.80,.70,.55,.20,0.3,0.75], adv:['nudity','violence'],
    why:'Villeneuve and Deakins. Almost nothing happens for long stretches, and the stretches are the reason to watch.' },
  { id:'separation', t:'A Separation', yr:2011, k:'film', len:'123 min', x:[.75,.70,.95,.70,.80,.40,.15,.50,0.1,0.85], adv:[],
    why:'Farhadi. Every character is right, from where they stand. That is the entire engineering feat.' },
  { id:'burning', t:'Burning', yr:2018, k:'film', len:'148 min', x:[.90,.40,.95,.90,.80,.30,.20,.15,0.1,0.7], adv:['nudity','sex'],
    why:'Lee Chang-dong on class, envy and the thing you cannot prove. Withholds its answer on purpose.' },
  { id:'drivemycar', t:'Drive My Car', yr:2021, k:'film', len:'179 min', x:[.95,.50,.60,.85,.75,.25,.10,.10,0.35,0.85], adv:['sex'],
    why:'Three hours, mostly a car and a rehearsal room, and it earns every minute.' },
  { id:'shoplifters', t:'Shoplifters', yr:2018, k:'film', len:'121 min', x:[.85,.45,.85,.75,.75,.35,.10,.25,0.1,0.8], adv:['sex'],
    why:'Koreeda asks what makes a family, then refuses to answer cheaply.' },
  { id:'perfectdays', t:'Perfect Days', yr:2023, k:'film', len:'124 min', x:[.90,.15,.30,.85,.40,.20,.10,.05,0.1,0.9], adv:['music'],
    why:'A Tokyo toilet cleaner’s routine, filmed as a complete argument about how to hold a life.' },
  { id:'timbuktu', t:'Timbuktu', yr:2014, k:'film', len:'96 min', x:[.70,.40,.80,.85,.85,.50,.20,.25,0.05,0.9], adv:['violence'],
    why:'Sissako films the occupying militants as men rather than monsters, which is far more damning than the alternative.' },
  { id:'wadjda', t:'Wadjda', yr:2012, k:'film', len:'98 min', x:[.75,.40,.55,.60,.50,.40,.15,.30,0.55,0.9], adv:[],
    why:'The first feature shot entirely inside Saudi Arabia, by a Saudi woman, about a girl who wants a bicycle.' },
  { id:'message', t:'The Message', yr:1976, k:'film', len:'177 min', x:[.40,.50,.35,.60,.60,.50,.60,.40,0.3,0.95], adv:['violence'],
    why:'Akkad’s sīra film — historically careful, cleared by al-Azhar, and the camera never once depicts the Prophet ﷺ.' },
  { id:'childrenheaven', t:'Children of Heaven', yr:1997, k:'film', len:'89 min', x:[.70,.30,.25,.60,.50,.25,.30,.45,0.35,0.95], adv:[],
    why:'One pair of shoes, two children, and the most sustained tension anyone has built from a running race.' },
  { id:'tasteofcherry', t:'Taste of Cherry', yr:1997, k:'film', len:'95 min', x:[.90,.25,.90,.90,.85,.15,.05,.05,0.05,0.75], adv:[],
    why:'Kiarostami. A man drives around Tehran looking for someone to bury him. Hardest watch here; also the one that stays.' },
  { id:'ikiru', t:'Ikiru', yr:1952, k:'film', len:'143 min', x:[.90,.50,.50,.75,.80,.30,.10,.20,0.6,0.95], adv:[],
    why:'Kurosawa. A bureaucrat gets a terminal diagnosis and finally does one thing. Watch the last hour twice.' },
  { id:'highlow', t:'High and Low', yr:1963, k:'film', len:'143 min', x:[.60,.65,.75,.85,.60,.60,.40,.60,0.25,0.75], adv:[],
    why:'First half a single room and a moral choice; second half a procedural. Two perfect films stapled together.' },
  { id:'rashomon', t:'Rashomon', yr:1950, k:'film', len:'88 min', x:[.60,.45,.95,.85,.60,.50,.30,.40,0.05,0.55], adv:['violence','sex'],
    why:'The film that gave the epistemology its name. Still the cleanest statement of the problem.' },
  { id:'stalker', t:'Stalker', yr:1979, k:'film', len:'162 min', x:[.90,.50,.85,.95,.80,.70,.05,.02,0.1,0.7], adv:[],
    why:'Tarkovsky. Three men walk toward a room that grants your real desire, and spend the film afraid of what that is.' },
  { id:'nocountry', t:'No Country for Old Men', yr:2007, k:'film', len:'122 min', x:[.55,.25,.80,.90,.80,.50,.60,.55,0.05,0.45], adv:['violence','gore'],
    why:'Almost no score. The Coens remove every cue that tells you how to feel, and the absence is the horror.' },
  { id:'twbb', t:'There Will Be Blood', yr:2007, k:'film', len:'158 min', x:[.75,.35,.85,.95,.85,.40,.40,.25,0.35,0.55], adv:['violence'],
    why:'Oil, faith and appetite. Fifteen minutes of no dialogue to open, and you never need any.' },
  { id:'insider', t:'The Insider', yr:1999, k:'film', len:'157 min', x:[.70,.75,.70,.80,.70,.60,.30,.55,0.3,0.7], adv:[],
    why:'Mann. What it actually costs an ordinary man to tell the truth about his employer.' },
  { id:'michaelclayton', t:'Michael Clayton', yr:2007, k:'film', len:'119 min', x:[.70,.70,.80,.75,.70,.50,.25,.50,0.35,0.5], adv:['language'],
    why:'Corporate law as a machine that processes people. The best script of its decade.' },
  { id:'incendies', t:'Incendies', yr:2010, k:'film', len:'131 min', x:[.70,.55,.80,.80,.95,.45,.35,.50,0.25,0.8], adv:['violence','sex'],
    why:'Villeneuve before Hollywood. A notarised will sends twins to a country like Lebanon. Brutal and exact.' },
  { id:'lawrence', t:'Lawrence of Arabia', yr:1962, k:'film', len:'218 min', x:[.70,.50,.80,.95,.70,.50,.70,.25,0.55,0.7], adv:['violence'],
    why:'Read it as a study of a man who cannot decide which people he belongs to, and the desert stops being scenery.' },

  /* ---- road, and the people who take the risk on purpose ---- */
  { id:'tt3d', t:'TT3D: Closer to the Edge', yr:2011, k:'doc', len:'104 min', x:[.60,.40,.70,.70,.80,.40,.95,.70,0.4,0.9], adv:['violence'],
    why:'The Isle of Man TT with the odds stated plainly by the men taking them. Guy Martin talking is the film.' },
  { id:'senna', t:'Senna', yr:2010, k:'doc', len:'106 min', x:[.75,.50,.60,.70,.80,.40,.85,.65,0.55,0.9], adv:[],
    why:'Archive footage only, no talking heads. A study in what conviction looks like from inside a helmet.' },
  { id:'onanysunday', t:'On Any Sunday', yr:1971, k:'doc', len:'96 min', x:[.40,.25,.20,.65,.20,.30,.85,.60,0.3,0.9], adv:[],
    why:'The film that made motorcycling look like joy rather than menace. It still works.' },
  { id:'longwayround', t:'Long Way Round', yr:2004, k:'doc', len:'10 ep', x:[.50,.35,.25,.40,.30,.30,.60,.40,0.4,0.85], adv:['language'],
    why:'London to New York on two bikes. The template every overland trip since has copied, mistakes included.' },
  { id:'alpinist', t:'The Alpinist', yr:2021, k:'doc', len:'92 min', x:[.85,.30,.70,.75,.85,.35,.80,.40,0.45,0.9], adv:[],
    why:'Marc-André Leclerc soloing, and refusing to perform it. The film about a man who does not want a film.' },
  { id:'planetearth2', t:'Planet Earth II', yr:2016, k:'doc', len:'6 ep', x:[.20,.40,.10,.95,.30,.60,.90,.40,0.05,0.8], adv:[],
    why:'The technical ceiling for the form. Watch the Cities episode last; it reframes the other five.' },

  /* ---- tv ---- */
  { id:'thewire', t:'The Wire', yr:2002, k:'tv', len:'5 seasons', x:[.60,.90,.95,.80,.80,.95,.30,.35,0.3,0.4], adv:['violence','language','drugs','sex'],
    why:'Institutions as the protagonist. Each season swaps which institution, and none of them can be fixed from inside.' },
  { id:'bettercallsaul', t:'Better Call Saul', yr:2015, k:'tv', len:'6 seasons', x:[.90,.60,.90,.95,.80,.60,.35,.30,0.55,0.35], adv:['violence','language'],
    why:'A man becoming the person he was always going to be, one defensible decision at a time. Better than its parent show.' },
  { id:'chernobyl', t:'Chernobyl', yr:2019, k:'tv', len:'5 ep', x:[.60,.75,.75,.85,.95,.90,.50,.60,0.2,0.7], adv:['violence','gore','language'],
    why:'What a system costs when the truth is expensive to say out loud. The dramatic licence is worth knowing about, and worth watching anyway.' },
  { id:'severance', t:'Severance', yr:2022, k:'tv', len:'2 seasons', x:[.80,.55,.70,.90,.70,.85,.35,.40,0.35,0.55], adv:[],
    why:'A workplace thriller whose premise is a philosophy problem about personal identity, taken seriously.' },
  { id:'andor', t:'Andor', yr:2022, k:'tv', len:'2 seasons', x:[.65,.65,.75,.85,.75,.75,.60,.45,0.55,0.75], adv:['violence'],
    why:'A show about the logistics and cost of resistance. Ignore the franchise; the writing is not franchise writing.' },
  { id:'dark', t:'Dark', yr:2017, k:'tv', len:'3 seasons', x:[.60,.85,.60,.80,.85,.95,.40,.50,0.35,0.7], adv:['sex','nudity','violence'],
    why:'The only time-travel story that closes every loop it opens. Take notes; it expects you to.' },
  { id:'shogun', t:'Shōgun', yr:2024, k:'tv', len:'10 ep', x:[.65,.70,.85,.85,.80,.70,.55,.45,0.45,0.7], adv:['violence','gore','sex'],
    why:'Politics conducted entirely through what people are allowed to say. Subtitled and better for it.' },
  { id:'thebureau', t:'The Bureau (Le Bureau des Légendes)', yr:2015, k:'tv', len:'5 seasons', x:[.75,.85,.90,.70,.75,.85,.30,.40,0.35,0.35], adv:['sex','violence'],
    why:'French DGSE. The most accurate espionage show made, and the least glamorous — which is the same fact.' },
  { id:'slowhorses', t:'Slow Horses', yr:2022, k:'tv', len:'4 seasons', x:[.60,.65,.60,.65,.45,.50,.40,.65,0.2,0.3], adv:['language','violence'],
    why:'MI5’s rejects. Six-hour seasons, no fat, and Jackson Lamb is a genuinely new character.' },
  { id:'theterror', t:'The Terror', yr:2018, k:'tv', len:'10 ep', x:[.70,.60,.70,.85,.95,.60,.40,.30,0.15,0.65], adv:['violence','gore'],
    why:'The Franklin expedition. Season one only. The horror is the command structure, not the thing on the ice.' },
  { id:'haltcatchfire', t:'Halt and Catch Fire', yr:2014, k:'tv', len:'4 seasons', x:[.90,.60,.65,.75,.65,.60,.20,.35,0.45,0.55], adv:['sex','language'],
    why:'Four people keep building the next thing and keep being early. The best show about ambition and its cost.' },
  { id:'detectorists', t:'Detectorists', yr:2014, k:'tv', len:'3 series', x:[.85,.30,.20,.70,.25,.20,.05,.05,0.1,0.9], adv:[],
    why:'Two men with metal detectors in a field. The gentlest good thing on television, and structurally perfect.' },

  /* ---- your top tier, so the model can be fitted to it ---- */
  { id:'slime', t:'That Time I Got Reincarnated as a Slime', yr:2018, k:'anime', len:'48 ep', x:[.35,.50,.20,.45,.20,.90,.60,.45,.95,.90], adv:[],
    why:'Skill acquisition and then nation-building. The rules of the world are stated and obeyed, which is what separates it from every other isekai.' },
  { id:'rezero', t:'Re:Zero − Starting Life in Another World', yr:2016, k:'anime', len:'50 ep', x:[.90,.65,.45,.75,.85,.85,.65,.60,.55,.95], adv:['violence','gore'],
    why:'A loop mechanic used to interrogate the person inside it rather than to solve puzzles. Subaru’s breakdowns are played completely straight.' },
  { id:'akamegakill', t:'Akame ga Kill!', yr:2014, k:'anime', len:'24 ep', x:[.40,.40,.35,.50,.70,.45,.85,.80,.60,.85], adv:['violence','gore'],
    why:'Death is real from the first episode and stays real. Sincere in a way most dark shounen only pretends to be.' },
  { id:'hitman', t:'Hit Man', yr:2023, k:'film', len:'115 min', x:[.40,.50,.45,.55,.20,.30,.35,.60,.30,.45], adv:['sex','language'],
    why:'Linklater doing a light thriller about whether personality is something you can just choose. Glen Powell.' },
  { id:'odyssey', t:'The Odyssey', yr:2026, k:'film', len:'—', x:[.55,.55,.45,.90,.60,.50,.80,.50,.25,.75], adv:['violence'],
    why:'Nolan on the oldest story about getting home. Craft-forward in the way all his films are.' },
  { id:'f1movie', t:'F1', yr:2025, k:'film', len:'156 min', x:[.40,.35,.30,.75,.35,.55,.90,.75,.50,.60], adv:[],
    why:'Kosinski doing to Formula 1 what he did to fighter jets. Spectacle first, everything else second.' },
  { id:'arresteddev', t:'Arrested Development', yr:2003, k:'tv', len:'5 seasons', x:[.30,.90,.35,.70,.15,.55,.20,.75,.05,.05], adv:['language'],
    why:'The densest joke-per-minute construction in television. Every gag is a setup for one four episodes later.' },
  { id:'sunny', t:'It’s Always Sunny in Philadelphia', yr:2005, k:'tv', len:'16 seasons', x:[.20,.70,.50,.45,.10,.30,.30,.80,.05,.02], adv:['language','drugs','sex'],
    why:'Five irredeemable people, no growth, no lesson, forever. The refusal to develop is the format.' },
  { id:'suits', t:'Suits', yr:2011, k:'tv', len:'9 seasons', x:[.45,.65,.40,.45,.45,.45,.25,.65,.35,.25], adv:['sex','language'],
    why:'Competence as fantasy. Everyone is always the cleverest person in the room, which is also why nothing lands.' },
  { id:'billions', t:'Billions', yr:2016, k:'tv', len:'7 seasons', x:[.50,.80,.70,.55,.55,.60,.25,.60,.40,.15], adv:['sex','language','drugs'],
    why:'Two men circling each other for seven seasons. Verbally spectacular and emotionally transactional.' },

  /* ---- fitted to that top tier: earnest, systems-legible, a ladder to climb ---- */
  { id:'drstone', t:'Dr. Stone', yr:2019, k:'anime', len:'70 ep', x:[.25,.65,.15,.55,.15,.95,.55,.65,.95,.90], adv:[],
    why:'Rebuilding all of civilisation from first principles, one correct chemical step at a time. The most literal first-principles show ever made.' },
  { id:'loghorizon', t:'Log Horizon', yr:2013, k:'anime', len:'50 ep', x:[.35,.75,.35,.40,.25,.98,.35,.35,.75,.85], adv:[],
    why:'The isekai that spends its time on governance, economics and law instead of combat. Closest thing to a systems-thinking textbook in the genre.' },
  { id:'bookworm', t:'Ascendance of a Bookworm', yr:2019, k:'anime', len:'62 ep', x:[.55,.60,.20,.50,.30,.90,.15,.25,.95,.95], adv:[],
    why:'A librarian reincarnates into a world with no books and starts an industrial revolution to get some. Progression measured in supply chains.' },
  { id:'overlord', t:'Overlord', yr:2015, k:'anime', len:'52 ep', x:[.30,.55,.55,.45,.40,.90,.70,.50,.85,.75], adv:['violence','gore'],
    why:'Slime’s structural sibling with the morality inverted — the same nation-building, from the position of the thing everyone else is afraid of.' },
  { id:'fmab', t:'Fullmetal Alchemist: Brotherhood', yr:2009, k:'anime', len:'64 ep', x:[.60,.65,.55,.70,.60,.90,.85,.75,.85,.95], adv:['violence'],
    why:'Equivalent exchange is a stated law and the plot obeys it for sixty-four episodes. If you only ever watch one more anime, this.' },
  { id:'hxh', t:'Hunter × Hunter', yr:2011, k:'anime', len:'148 ep', x:[.65,.75,.65,.75,.65,.95,.80,.60,.90,.85], adv:['violence','gore'],
    why:'The best-constructed power system in shounen — Nen has rules, costs and a licensing exam. The Chimera Ant arc is the ceiling of the form.' },
  { id:'aot', t:'Attack on Titan', yr:2013, k:'anime', len:'89 ep', x:[.60,.70,.90,.80,.90,.85,.90,.75,.75,.90], adv:['violence','gore'],
    why:'Begins as survival horror and ends as an argument about whether freedom and atrocity share a root. Earns the turn.' },
  { id:'eightysix', t:'86 EIGHTY-SIX', yr:2021, k:'anime', len:'23 ep', x:[.80,.60,.70,.85,.90,.70,.75,.55,.65,.95], adv:['violence','gore'],
    why:'A war fought by drones that are not drones. The most emotionally exact anime of its decade, and the two halves are structurally opposed on purpose.' },
  { id:'kingdom', t:'Kingdom', yr:2012, k:'anime', len:'150+ ep', x:[.40,.65,.50,.45,.55,.85,.85,.70,.95,.90], adv:['violence','gore'],
    why:'Warring States China, told as strategy rather than as spectacle. A slave becomes a general over hundreds of episodes and every rank is earned on screen.' },
  { id:'codegeass', t:'Code Geass', yr:2006, k:'anime', len:'50 ep', x:[.55,.70,.85,.65,.70,.80,.80,.85,.70,.85], adv:['violence'],
    why:'A tactician with one absolute power and a plan that keeps almost working. Escalation done with actual chess in it.' },
  { id:'deathnote', t:'Death Note', yr:2006, k:'anime', len:'37 ep', x:[.55,.75,.80,.70,.60,.85,.35,.80,.60,.75], adv:[],
    why:'The rules of the notebook are printed and never broken. Everything that happens is a consequence of two people reading them carefully.' },
  { id:'mushoku', t:'Mushoku Tensei', yr:2021, k:'anime', len:'47 ep', x:[.80,.60,.60,.90,.60,.75,.60,.35,.90,.90], adv:['sex','nudity'],
    why:'The best-animated isekai by a distance, and genuinely about a wasted man trying to become worth something. The early episodes carry real lecherous content — that is a live objection, not a footnote.' },
  { id:'rankingkings', t:'Ranking of Kings', yr:2021, k:'anime', len:'23 ep', x:[.75,.45,.60,.85,.65,.55,.60,.50,.90,.98], adv:[],
    why:'A deaf, powerless prince who is dismissed by everyone. The most sincere thing on this list, and the storybook art is doing deliberate work.' },
  { id:'summertime', t:'Summertime Render', yr:2022, k:'anime', len:'25 ep', x:[.65,.75,.55,.70,.75,.90,.65,.75,.60,.90], adv:['violence','gore'],
    why:'A loop story with an airtight rule set that the protagonist actually exploits like an engineer. If Re:Zero worked on you, this is the nearest thing.' },
  { id:'erased', t:'Erased', yr:2016, k:'anime', len:'12 ep', x:[.75,.55,.50,.70,.80,.70,.35,.70,.45,.90], adv:['violence'],
    why:'Involuntary time loops back to childhood to stop a murder. Twelve episodes, no filler.' },
  { id:'vivy', t:'Vivy: Fluorite Eye’s Song', yr:2021, k:'anime', len:'13 ep', x:[.65,.60,.60,.85,.70,.80,.85,.70,.75,.90], adv:['violence'],
    why:'Written by Re:Zero’s author. A century-long mission to stop an AI war, with the best action animation of its year.' },
  { id:'shieldhero', t:'The Rising of the Shield Hero', yr:2019, k:'anime', len:'50 ep', x:[.55,.45,.45,.45,.50,.75,.60,.55,.85,.80], adv:['violence'],
    why:'Isekai starting from betrayal rather than from a cheat. Season one is the one that works.' },
  { id:'sololeveling', t:'Solo Leveling', yr:2024, k:'anime', len:'25 ep', x:[.20,.30,.15,.75,.25,.80,.95,.85,1,.75], adv:['violence'],
    why:'Progression in its purest, least diluted form. Almost no interiority and it does not pretend otherwise.' },
  { id:'jujutsu', t:'Jujutsu Kaisen', yr:2020, k:'anime', len:'47 ep', x:[.40,.50,.45,.90,.55,.75,.95,.85,.75,.80], adv:['violence','gore'],
    why:'A cursed-energy system with binding vows and stated costs, animated by the best action studio working.' },
  { id:'konosuba', t:'KonoSuba', yr:2016, k:'anime', len:'30 ep', x:[.15,.55,.15,.50,.05,.55,.45,.70,.25,.25], adv:['sex'],
    why:'Isekai played entirely for parody. Included as a deliberate contrast — if your Sincerity weight is real, the model should rank this low and you should agree with it.' },
  { id:'arcane', t:'Arcane', yr:2021, k:'tv', len:'2 seasons', x:[.80,.65,.85,.98,.80,.65,.90,.60,.70,.85], adv:['violence','drugs'],
    why:'Not anime, and the only Western animation that competes on this list. Two sisters on opposite sides of a class war, at a craft level nothing else reaches.' }
];

/* Musaed's own top tier, from 2026-08-22. Loaded by Screen → “Load the ten you told
 * me about”. Idempotent and id-keyed, so re-running it cannot duplicate or overwrite.
 *
 * mode:'comfort' is load-bearing. Three rewatches of Arrested Development is the
 * strongest raw signal in the set, and it is the one that must NOT reach the model —
 * he said plainly they are not his thing, they are what goes on in a rut. Rewatch
 * count there is measuring function, not taste. */
export const SEED = [
  { id:'rezero',       score:10,  mode:'engaged', note:'Watched three times.' },
  { id:'slime',        score:9.5, mode:'engaged', note:'Recently finished — one of the best watches.' },
  { id:'akamegakill',  score:9,   mode:'engaged', note:'Loved it.' },
  { id:'hitman',       score:7.5, mode:'engaged', note:'Liked it.' },
  { id:'odyssey',      score:7.5, mode:'engaged', note:'Solid.' },
  { id:'f1movie',      score:6.5, mode:'engaged', note:'Okay watch.' },
  { id:'suits',        score:5,   mode:'engaged', note:'Too serious, not fun. Did not complete.' },
  { id:'billions',     score:5,   mode:'engaged', note:'Same as Suits — watched during a development-obsession phase.' },
  { id:'arresteddev',  score:8,   mode:'comfort', note:'Three times. Burnout watch, not a preference.' },
  { id:'sunny',        score:7.5, mode:'comfort', note:'Twice. Same function as Arrested Development.' }
];

/* Stated once, in the app, on the Screen tab. Not a recommendation and not a judgement —
 * a measurement problem. */
export const ATTENTION = {
  t:'What you actually watch',
  body:'By your own account this is roughly one film every four months and one series a year, and the bulk of your watch-hours are YouTube self-improvement and streamer groups — FSLR, Offline TV and that neighbourhood. You described those as “not that funny or entertaining, it just feels homey”, like being part of a community.',
  point:'That makes this tab a model of the small half of your attention. It will get good at predicting the anime, and it will stay silent about the thing you actually spend the hours on.',
  close:'Worth naming once: you already identified what that content is doing rather than what it is. Nothing here can substitute for it, and no ranking of titles is the answer to it.'
};

export const ADVISORIES = [
  { k:'violence', n:'Violence' }, { k:'gore', n:'Gore' }, { k:'sex', n:'Sexual content' },
  { k:'nudity', n:'Nudity' }, { k:'romance', n:'Romance-central' }, { k:'language', n:'Strong language' },
  { k:'drugs', n:'Drug use' }, { k:'music', n:'Score-forward' }
];

/* =====================================================================
   RIDE — UK licensing ladder, then the skill curriculum. The gates are
   the point: a level is earned by logged evidence, never by reading.
   ===================================================================== */
export const LICENCE = [
  { id:'cbt', n:'CBT', full:'Compulsory Basic Training',
    is:'One day, no test. Lets you ride up to 125cc on L-plates — no pillion, no motorway. Expires after 2 years.',
    next:'Book at a DVSA-approved training body. Ride something for the two years; do not sit on it.' },
  { id:'theory', n:'Theory + hazard perception', full:'Motorcycle theory test',
    is:'Multiple choice plus a hazard-perception clip test. Valid 2 years — and the clock on it is what traps people.',
    next:'Take it early. Both practical modules must fall inside the two-year window.' },
  { id:'mod1', n:'Module 1', full:'Off-road manoeuvres',
    is:'Slalom, figure-8, slow ride, U-turn, controlled stop, then a hazard-avoidance swerve and an emergency stop at ~50 km/h.',
    next:'This is a slow-control test wearing a fast hat. Practise the U-turn and the slow ride until they are boring.' },
  { id:'mod2', n:'Module 2', full:'On-road test',
    is:'Eyesight check, safety questions, then roughly 40 minutes on the road including independent riding.',
    next:'Examiner is watching observation and position more than speed. Ride the system, not the route.' },
  { id:'a2', n:'A2 licence', full:'Restricted — 19+',
    is:'Up to 35 kW (47 bhp) and a power-to-weight ratio of 0.2 kW/kg or less. Restricted bikes must not come from a machine over twice that power.',
    next:'If you are 24 or over, skip this: Direct Access to full A is one set of tests, not two.' },
  { id:'a', n:'Full A licence', full:'Direct access — 24+, or progressive from A2 at 21+',
    is:'Unrestricted. At 24 or over you can take it directly on a big bike with no A2 stage in between.',
    next:'Passing is the start of the curriculum below, not the end of it. Statistically the first two years post-test are the dangerous ones.' },
  { id:'bikesafe', n:'BikeSafe', full:'Police-run observed ride',
    is:'A workshop plus an observed ride with a police motorcyclist. Cheap, honest, and it will find things you did not know you did.',
    next:'Book the first slot your force offers after you pass. Best value assessment in the country.' },
  { id:'ers', n:'Enhanced Rider Scheme', full:'DVSA post-test assessment',
    is:'No pass or fail — an assessed ride, a training plan, and a DVSA certificate that several insurers discount for.',
    next:'Sits neatly between BikeSafe and a full advanced course.' },
  { id:'iam', n:'IAM RoadSmart', full:'Advanced Rider course + test',
    is:'Observed rides with a volunteer observer against the Roadcraft standard, then a test with an examiner.',
    next:'The commitment is months, not a weekend. That is why it works.' },
  { id:'rospa', n:'RoSPA Advanced', full:'Graded advanced test',
    is:'Graded Bronze, Silver or Gold, and re-tested every three years — the only UK qualification that expires on purpose.',
    next:'The highest civilian bar. Gold is genuinely hard; retesting is the feature.' }
];

/* IPSGA — Information, Position, Speed, Gear, Acceleration. The system of
 * motorcycle control from Roadcraft, which every UK advanced course teaches. */
export const IPSGA = [
  { k:'I', n:'Information', is:'Take, use and give. It runs through all four of the others, not before them.' },
  { k:'P', n:'Position',    is:'For view first, then safety, then stability.' },
  { k:'S', n:'Speed',       is:'The speed you can stop in, in the distance you can see to be clear — on your side of the road.' },
  { k:'G', n:'Gear',        is:'The right gear for that speed, selected once, before the hazard.' },
  { k:'A', n:'Acceleration',is:'Only when you can see it is safe. Accelerating is a decision, not a default.' }
];

export const DRILLS = [
  { id:'check', n:'The pre-ride check', ord:1, sys:'T-CLOCS',
    is:'Tyres, Controls, Lights and electrics, Oil and fluids, Chassis and chain, Stands. Two minutes, every ride.',
    how:'Pressures cold and weekly. Chain slack and lube every ~500 miles or after rain. Squeeze both levers before you move. Look at the tyres, do not glance at them.',
    gate:{ rides:20, key:'check' },
    fail:'Checking only before long rides. The pressure that catches you out drops on an ordinary Tuesday.' },
  { id:'slow', n:'Slow-speed control', ord:2, sys:'Machine',
    is:'The clutch friction zone against a trailing rear brake, with your head up. Everything below 10 mph is this one skill.',
    how:'Empty car park. Figure-8s inside two bay widths, full-lock U-turns both directions, a slow race against yourself. Eyes at the exit — never at the front wheel.',
    gate:{ sessions:6, mins:15 },
    fail:'Looking down. The bike goes where you look at 4 mph exactly as much as at 60.' },
  { id:'vision', n:'Vision and the limit point', ord:3, sys:'I — Information',
    is:'The limit point is the furthest place you can see road surface. It tells you a corner’s severity before the corner is visible.',
    how:'Limit point moving away from you — the corner is opening, you can accelerate. Static — hold. Coming toward you — slow, now. Say it out loud on a quiet road until it is automatic.',
    gate:{ rides:8, kind:'twisty' },
    fail:'Target fixation. You steer at whatever you stare at, including the thing you are trying to miss.' },
  { id:'obs', n:'Observation and lifesavers', ord:4, sys:'I — Information',
    is:'Mirrors on a rhythm, and a shoulder check before every position change, turn and overtake — early enough that you can still act on what you see.',
    how:'Mirrors roughly every 7 seconds and always before slowing. Lifesaver before the manoeuvre, not during it. Know what is behind you at all times, not most of the time.',
    gate:{ rides:10 },
    fail:'The ritual lifesaver, taken so late it is a nod rather than a look.' },
  { id:'pos', n:'Positioning', ord:5, sys:'P — Position',
    is:'View, safety, stability, in that order. Left-hander: move right for view. Right-hander: move left. Surrender the position the moment it costs you safety.',
    how:'Ride a familiar A-road naming your position out loud at every bend and why. Watch what it does to how early you can see the exit.',
    gate:{ rides:8, kind:'aroad' },
    fail:'Holding a view position into a blind crest, where the oncoming car is the entire hazard.' },
  { id:'brake', n:'Braking', ord:6, sys:'S — Speed',
    is:'Progressive squeeze. Weight transfers forward, the front tyre’s contact patch grows, and the front then does 80–90% of the work.',
    how:'Emergency stops from 30, then 50. Dry first, then a wet car park. Feel the ABS cycle at least once so it is not a surprise on a road.',
    gate:{ sessions:6, wet:2 },
    fail:'Grabbing. The tyre has the grip; the suddenness of the input is what takes it away.' },
  { id:'corner', n:'Cornering', ord:7, sys:'IPSGA — all of it',
    is:'Slow, look, lean, roll. All braking finished upright before turn-in. Counter-steer — push the bar on the side you are going. Neutral-to-positive throttle from the apex out.',
    how:'A delayed apex buys you view on the way in and a straighter exit. Practise entering slower than feels right and leaving faster; that trade is the whole skill.',
    gate:{ rides:10, kind:'twisty' },
    fail:'Entering too hot then rolling off mid-corner. The bike stands up and runs wide — and on a UK right-hander, wide is the oncoming lane.' },
  { id:'wet', n:'Wet, cold, night, wind', ord:8, sys:'Conditions',
    is:'Smoother inputs, bigger gaps, and a different map of the road surface.',
    how:'Avoid the polished centre of the lane, painted lines, manhole covers, and the diesel ring on roundabout exits. Cold tyres for the first ten minutes are not the tyres from the review. In wind, hold the bike loose and steer with your body.',
    gate:{ rides:8, kind:'adverse' },
    fail:'Only ever riding in July. Fair-weather riders have fair-weather skill, and then it rains on the way home.' },
  { id:'filter', n:'Filtering', ord:9, sys:'Judgement',
    is:'Legal in the UK, and only sane at a low speed differential over stopped or crawling traffic.',
    how:'Roughly 10–15 mph faster than the traffic, not more. Never past a junction or a gap someone could turn into. Never alongside an HGV. Cover the front brake. Expect the opening door and the sudden U-turn.',
    gate:{ rides:6 },
    fail:'Reading a gap in traffic as permission. Nobody in that queue is looking for you.' },
  { id:'overtake', n:'Overtaking', ord:10, sys:'IPSGA — the full system',
    is:'The highest-risk manoeuvre you will choose to make. It is the one place the whole system runs consciously, in order.',
    how:'Following position for view, information both ways, speed and gear set before you pull out, then acceleration only once the exit is confirmed. Plan the abort before you commit. If you are thinking about it, that is the answer.',
    gate:{ rides:8 },
    fail:'Starting the overtake before the exit was confirmed, then having to finish it anyway.' },
  { id:'motorway', n:'Motorway and distance', ord:11, sys:'Endurance',
    is:'Lane discipline, HGV buffeting, fuel and fatigue planning, and knowing when your concentration went.',
    how:'Stop every ~90 minutes whether or not you want to. Plan fuel at two-thirds of tank range, not at the light. Layer for the coldest part of the day, not the warmest.',
    gate:{ rides:5, miles:60 },
    fail:'Reading fatigue as boredom. Concentration fails long before your body does.' },
  { id:'pillion', n:'Pillion and group riding', ord:12, sys:'Judgement',
    is:'Both change the machine and the decisions. Neither is a small adjustment.',
    how:'Brief the pillion: hold on, look over my shoulder into the corner, do not move suddenly. Everything takes longer to stop. In a group, ride staggered, and use second-man-drop-off so nobody is ever led onto a junction they cannot see.',
    gate:{ rides:4 },
    fail:'Riding your own pace in a group that is not yours to lead.' },
  { id:'maint', n:'Maintenance', ord:13, sys:'Machine',
    is:'The parts of the bike that decide the outcome are cheap and boring: chain, pressures, pads, fluid.',
    how:'Chain tension and lube every ~500 miles. Pressures cold, weekly. Pad thickness monthly. Brake fluid every two years regardless of how it looks.',
    gate:{ logs:8 },
    fail:'A chain adjusted once it is already noisy has been wrong for five hundred miles.' }
];

export const RISK = {
  lede:'These are the numbers, stated once, without softening. The point is not to talk you off the bike — it is that the mitigations below are unusually effective, and they are all decisions you make before you ride.',
  facts:[
    { tier:'Established', t:'Motorcycles are roughly 1% of UK traffic and around a fifth of road deaths.',
      d:'DfT reported road casualty statistics, consistently across recent years. Per mile ridden the fatality rate sits far above car occupants — the multiple moves with the year and the measure, but the order of magnitude does not.' },
    { tier:'Established', t:'The most common multi-vehicle crash is a driver taking your right of way at a junction.',
      d:'The SMIDSY. Which is why the mitigation is a road position and a covered brake at every junction, not an expectation that they will look.' },
    { tier:'Established', t:'Single-vehicle crashes concentrate on bends, and in the UK a right-hand bend is the dangerous one.',
      d:'Run wide on a left and you get the verge. Run wide on a right and you get the oncoming lane. Entry speed is the input that decides this.' },
    { tier:'Strong convergence', t:'Helmets and protective gear substantially reduce injury severity.',
      d:'Helmet effectiveness is the best-evidenced part — systematic reviews are consistent. All the gear, all the time, including on the ten-minute ride.' },
    { tier:'Hypothesis', t:'Advanced training is associated with lower crash involvement.',
      d:'The association is real in the data. The population self-selects heavily, so the causal size is genuinely unclear. Take the training; do not quote a number.' },
    { tier:'Established', t:'Speed, alcohol and unlicensed riding dominate the worst outcomes.',
      d:'This is the part fully inside your control, and it is the largest single lever on the list.' }
  ],
  ladder:['Gear, every ride, no exceptions','Junction discipline — cover the brake, assume you are invisible','Bend entry speed — slow in, drive out','Advanced training within your first two years','Conspicuity and position','Bike choice and power']
};

export const ROADS = [
  { id:'catfiddle', n:'A537 Cat & Fiddle', where:'Macclesfield – Buxton', from:45, mi:11, grade:3,
    is:'The famous one. Genuinely excellent third-gear road, and now average-speed cameras end to end. Ride it for the corners, not the speed.' },
  { id:'snake', n:'A57 Snake Pass', where:'Glossop – Sheffield', from:55, mi:14, grade:3,
    is:'Long sweeping moorland road over the Pennines. Closes for snow and for landslip more often than you would expect — check before you go.' },
  { id:'a53', n:'A53 / A54', where:'Buxton – Leek – Congleton', from:50, mi:20, grade:3,
    is:'Open moorland with far better sightlines than the Cat & Fiddle, and a fraction of the attention. The local’s answer.' },
  { id:'a515', n:'A515', where:'Ashbourne – Buxton', from:25, mi:20, grade:2,
    is:'Fast, straight-ish, and heavily policed. Use it as the way in, not the reason.' },
  { id:'winnats', n:'Winnats Pass & Mam Tor', where:'Castleton, A6187', from:50, mi:8, grade:2,
    is:'Spectacular and slow. Tourist traffic, gravel, and sheep. Ride it early on a weekday or not at all.' },
  { id:'curbar', n:'Curbar Gap & Froggatt Edge', where:'Baslow – Calver', from:45, mi:6, grade:2,
    is:'Short, tight, gritstone edges on both sides. Best as the link between two better roads.' },
  { id:'a6', n:'A6 Derwent Valley', where:'Matlock – Bakewell', from:20, mi:12, grade:2,
    is:'Busy, but it is the nearest genuinely pretty road to your front door and it opens up everything north of it.' },
  { id:'buttertubs', n:'Buttertubs Pass', where:'Yorkshire Dales', from:120, mi:6, grade:3,
    is:'Worth the two hours. Hawes to Thwaite, then keep going into Swaledale.' },
  { id:'evo', n:'The Evo Triangle', where:'North Wales, A5 / B4501 / A543', from:150, mi:20, grade:3,
    is:'Empty, fast, and famous for it. Pair with the A470 to make a proper weekend.' },
  { id:'blackmtn', n:'A4069 Black Mountain Pass', where:'Brecon Beacons', from:200, mi:8, grade:3,
    is:'The most photogenic switchbacks in Britain. Two hundred miles from Derby, and everyone does it once.' },
  { id:'hardknott', n:'Hardknott & Wrynose', where:'Lake District', from:180, mi:12, grade:3,
    is:'33% gradients and hairpins with no run-off. This is a slow-control test with a view, not a fast road.' },
  { id:'a68', n:'A68 & Hadrian’s Wall', where:'Northumberland', from:180, mi:60, grade:3,
    is:'Roman-straight with sudden crests that hide everything. Empty in a way the Peaks never are.' },
  { id:'nc500', n:'North Coast 500', where:'Scottish Highlands', from:420, mi:516, grade:3,
    is:'A five-to-seven day loop, not a road. Applecross (Bealach na Bà) is the one to plan the day around.' },
  { id:'iom', n:'Isle of Man', where:'Ferry from Heysham', from:180, mi:38, grade:3,
    is:'The Mountain Course is a public road with derestricted sections. TT is late May into early June; the island is a different place that fortnight.' }
];

export const CONDITIONS = [
  { k:'dry', n:'Dry' }, { k:'wet', n:'Wet' }, { k:'cold', n:'Cold (<7°C)' },
  { k:'night', n:'Night' }, { k:'wind', n:'High wind' }, { k:'fog', n:'Fog' }
];
export const ROADKINDS = [
  { k:'urban', n:'Urban' }, { k:'aroad', n:'A-road' }, { k:'twisty', n:'Twisty' },
  { k:'motorway', n:'Motorway' }, { k:'lane', n:'Country lane' }, { k:'carpark', n:'Car park drill' }
];

/* =====================================================================
   CRAFT — pursuits scored on eight dimensions. The recommendation is a
   gap analysis against what you already do, not a list of nice things.
   ===================================================================== */
export const HDIMS = [
  { k:'ar', n:'Arousal',    lo:'calm',      hi:'high' },
  { k:'so', n:'Social',     lo:'solitary',  hi:'group' },
  { k:'ki', n:'Physical',   lo:'sedentary', hi:'kinetic' },
  { k:'ge', n:'Generative', lo:'consumes',  hi:'makes' },
  { k:'rk', n:'Risk',       lo:'safe',      hi:'consequential' },
  { k:'wx', n:'Weather',    lo:'indoor',    hi:'weather-bound' },
  { k:'cp', n:'Capital',    lo:'cheap',     hi:'expensive' },
  { k:'po', n:'Portable',   lo:'anchored',  hi:'travels' }
];

export const HOBBIES = [
  { id:'moto', n:'Motorcycling', x:[.85,.35,.60,.10,.85,.85,.85,.15], ceil:.90, anchor:true,
    is:'The one you already have. It is worth seeing it as a vector rather than a hobby, because it explains what is missing.',
    why:'High arousal, physically demanding, expensive, weather-bound, and it produces nothing that outlives the ride. Not a criticism — a shape. Everything below is chosen against this shape.',
    first:['Log every ride, including the boring ones','Pick one drill per month from the Ride tab','Book BikeSafe'],
    cost:'Already sunk', fail:'Riding a lot and practising nothing. Mileage is not skill.' },

  { id:'khatt', n:'Arabic calligraphy (khaṭṭ)', x:[.15,.20,.15,.95,.05,.05,.10,.95], ceil:.95,
    is:'The classical Islamic art with a living master-to-student chain. Reed qalam, ink, and one letter form at a time.',
    why:'The near-exact inverse of the motorcycle on every dimension: calm, cheap, indoor, portable, and it makes something that persists. It is also the only pursuit here that sits under item 2 of your hierarchy rather than item 4.',
    first:['A Pilot Parallel 3.8mm and walnut ink — a reed qalam later, not first','Ruq‘ah before Naskh: it is the everyday hand and the fastest route to legibility','One letter form a week, twenty minutes, photograph every sheet'],
    cost:'£25 to start', derby:'Learn remotely from a teacher with an ijāza chain — the Turkish and Egyptian masters teach online. Ask at Derby Jamia Masjid about local classes.',
    fail:'Starting with Thuluth because it is the beautiful one. Ruq‘ah, then Naskh. Thuluth is year three.' },

  { id:'climb', n:'Rock climbing & bouldering', x:[.60,.75,.90,.20,.50,.50,.30,.60], ceil:.90,
    is:'Problem-solving with your whole body, graded so progress is unarguable.',
    why:'Social and physical without being high-arousal, and it fills the group-activity gap that riding cannot. The grade ladder gives you the legible progression that motorcycling badly lacks.',
    first:['One indoor session with a friend, no gear needed','Learn to fall before you learn to climb','Get outside onto grit within the first two months'],
    cost:'£12 a session, £60 for shoes', derby:'You live forty minutes from Stanage Edge — the most famous gritstone crag in the world. The Climbing Unit in Derby, The Foundry and Depot in Sheffield.',
    fail:'Training strength before technique. Grip is the last thing to fail; footwork is the first.' },

  { id:'archery', n:'Archery', x:[.20,.55,.50,.15,.20,.40,.40,.50], ceil:.85,
    is:'Stillness under load. Almost entirely a mental discipline once the form is in place.',
    why:'One of the three the Prophet ﷺ named, alongside swimming and horsemanship. Low arousal, moderately social, and the skill is measurable to the millimetre.',
    first:['A beginners’ course — clubs will not let you skip it, correctly','Barebow or traditional before compound','Shoot twice a week for six weeks, then decide'],
    cost:'£80 course, £150 first bow', derby:'Derby City Archers; Chevin Archers at Duffield. Both run beginner courses on a schedule.',
    fail:'Buying a bow before the course. Draw weight chosen by ego wrecks the form you have not built yet.' },

  { id:'swim', n:'Swimming', x:[.35,.30,.95,.05,.15,.05,.05,.95], ceil:.70,
    is:'The second of the three. Technique-limited, not fitness-limited, which is why adults plateau.',
    why:'Cheapest and most portable physical pursuit on this list, available in every city you will ever live in, and it pays straight back into everything else you do physically.',
    first:['Four one-to-one lessons — adults almost always have a stroke fault they cannot see','Front crawl breathing before distance','Twice a week, 30 minutes'],
    cost:'£5 a session', derby:'Queen’s Leisure Centre and Moorways in Derby; Moorways has the 50m pool.',
    fail:'Grinding lengths with a broken stroke and calling it training.' },

  { id:'horse', n:'Horse riding', x:[.55,.60,.80,.10,.60,.60,.80,.30], ceil:.90,
    is:'The third of the three, and the closest thing to the motorcycle’s feel with none of its traffic.',
    why:'Completes the set. Also the only pursuit here where the equipment has opinions, which is a genuinely different kind of skill.',
    first:['Group lessons first — cheaper and you learn from watching','Ten lessons before deciding anything','Ask about hacking out, not just school work'],
    cost:'£35–50 a lesson', derby:'Several yards within 20 minutes of Derby; look for BHS-approved.',
    fail:'Only ever riding in an arena. The point is outside.' },

  { id:'photo', n:'Film photography', x:[.20,.35,.35,.95,.05,.35,.50,.90], ceil:.85,
    is:'36 frames, no screen, and a developing tank in your kitchen.',
    why:'The natural documentary layer over the two things you already do — it turns a ride and a trip into something that persists, which is exactly what both currently lack.',
    first:['A Pentax K1000 or an Olympus XA, around £80','One film stock for a year — HP5 — and one lens','Develop black and white at home; a £40 kit and a dark bag is all it takes'],
    cost:'£120 all in', derby:'Peak District and the Derwent Valley Mills world heritage site are both on your doorstep.',
    fail:'Shooting twelve stocks and learning nothing from any of them. One stock, one lens, one year.' },

  { id:'wood', n:'Hand-tool woodworking', x:[.15,.20,.60,1,.25,.05,.50,.15], ceil:.90,
    is:'Saw, chisel, plane, bench. Furniture, boxes, and a very slow feedback loop.',
    why:'Maximum generative score on the list. For someone whose entire working output is text on a screen, the appeal is that the result either stands up or does not.',
    first:['Build a bench first — it is the first project and the tool you need most','A hand saw, two chisels, a block plane, a marking gauge','Cut fifty practice dovetails before you build anything you keep'],
    cost:'£200 for real tools', derby:'Local makerspaces and community woodshops; second-hand Record and Stanley planes are better than new budget ones.',
    fail:'Buying machines. A saw, two chisels and a plane build furniture; a table saw builds a hobby about buying machines.' },

  { id:'cook', n:'One cuisine, to depth', x:[.25,.80,.40,.80,.05,.05,.15,.80], ceil:.80,
    is:'Not "learning to cook". One tradition — Levantine, Hijazi, Sichuan, Persian — until you can improvise inside it.',
    why:'The only pursuit here that is simultaneously generative, social, portable and a daily obligation you already have. Highest compounding rate on the list by a distance.',
    first:['Pick the tradition before the recipe','Learn its five mother techniques, not fifty dishes','Cook for other people from week one — that is the whole feedback loop'],
    cost:'£40 of spices and a decent pan', fail:'Collecting recipes. Depth in one tradition beats breadth across six every time.' },

  { id:'fell', n:'Hill walking & fell running', x:[.50,.40,.95,.10,.30,.70,.10,.75], ceil:.70,
    is:'Long days on your feet, navigation, and weather you did not order.',
    why:'The cheapest way to be in the same landscape you ride through, at a speed that lets you see it. Also the fastest-improving fitness on this list.',
    first:['Boots and a waterproof, nothing else','Learn map and compass before you rely on a phone','Kinder Scout, then Bleaklow, then the Edges'],
    cost:'£150 of boots and shell', derby:'The Peak District starts twenty minutes away. Kinder, Bleaklow, Stanage, Mam Tor.',
    fail:'Buying the full kit for a hobby you have done twice.' },

  { id:'bind', n:'Bookbinding', x:[.10,.15,.35,1,.05,.02,.20,.50], ceil:.75,
    is:'Folding, sewing and casing — turning loose paper into an object that lasts a century.',
    why:'Quiet, exact, indoor, cheap, and it pairs directly with the reading you already do. A short ladder to competence and a very long one to mastery.',
    first:['A pamphlet stitch, then a coptic binding','Bone folder, awl, linen thread, PVA — about £30','Bind your own notes first; the stakes are right'],
    cost:'£30', fail:'Starting with a leather case binding. Sew ten pamphlets first.' },

  { id:'garden', n:'Allotment & growing', x:[.10,.45,.60,.90,.05,.95,.15,.05], ceil:.70,
    is:'A plot, a season, and a feedback loop measured in months.',
    why:'A ten-year-horizon pursuit for a ten-year-horizon person. The waiting list is the reason to act now rather than later.',
    first:['Join the council waiting list this week — it costs nothing to wait','Grow six things well, not twenty badly','Year one is soil, not vegetables'],
    cost:'£50 a year for a plot', derby:'Derby City Council runs allotment sites across the city, most with waiting lists measured in months to years.',
    fail:'Taking a full plot in year one. Half plots exist for a reason.' },

  { id:'machine', n:'Electronics & physical making', x:[.30,.30,.40,1,.20,.02,.50,.40], ceil:.90,
    is:'Microcontrollers, sensors, 3D printing, a soldering iron. Software that has to survive contact with physics.',
    why:'You are a CS student — the gap is physical output. Something on a bench that either works or does not, with no room to argue about it.',
    first:['One project with a real user — you','ESP32, not Arduino, and not a kit','Finish it badly rather than plan it well'],
    cost:'£80', derby:'University of Derby has workshop access; Derby Makers and similar groups run open evenings.',
    fail:'Buying modules for six projects and finishing none. One board, one project, one enclosure.' },

  { id:'motomaint', n:'Motorcycle maintenance', x:[.25,.25,.60,.70,.25,.20,.40,.15], ceil:.75, adjacent:true,
    is:'Chain, fluids, pads, valve clearances, and eventually a carburettor you did not need to touch.',
    why:'Adjacent rather than additive — it deepens something you already own and cuts its running cost, but it fills none of the portfolio gaps. Take it when you want depth, not when you want balance.',
    first:['Chain, pressures, pad wear — the three that matter','A torque wrench before anything else','The Haynes manual for your exact model'],
    cost:'£120 of tools', fail:'Starting with the fun jobs. The boring maintenance is the maintenance that matters.' },

  { id:'sail', n:'Sailing & kayaking', x:[.55,.65,.80,.10,.50,.85,.60,.35], ceil:.85,
    is:'Reading water and weather, and being wrong in front of consequences.',
    why:'Similar risk-and-judgement texture to riding, but social and in a completely different medium. RYA levels give you the legible ladder.',
    first:['RYA Level 1 and 2 over one weekend','Dinghy before yacht','Club membership beats owning anything'],
    cost:'£250 for the course', derby:'Carsington Water and Staunton Harold Reservoir, both under 40 minutes.',
    fail:'Buying a boat.' },

  { id:'arabicdeep', n:'Classical Arabic (naḥw & ṣarf)', x:[.30,.35,.05,.40,.02,.02,.05,1], ceil:1,
    is:'Grammar and morphology as a formal system, not conversational Arabic. Ājurrūmiyya, then Qaṭr al-Nadā.',
    why:'Scores like chess on the dimensions — sedentary, cognitive, portable — but sits under item 2 of your hierarchy rather than item 4, which changes its priority entirely regardless of what the vector says.',
    first:['One structured text with a teacher, not an app','Twenty minutes daily beats three hours weekly','Apply it to Qur’an the same week you learn it — never bank it for later'],
    cost:'Free to £30 a month', fail:'This is your documented failure mode exactly: learning the system and never parsing a live āyah with it.' },

  { id:'run', n:'Distance running', x:[.50,.35,1,.10,.15,.50,.05,1], ceil:.70,
    is:'The lowest-friction physical pursuit that exists. Shoes and a door.',
    why:'Maximum portability, minimum capital, and it survives every disruption to your life that will happen in the next decade.',
    first:['Run slower than feels correct — almost everyone runs their easy runs too fast','Parkrun on Saturday for the free measured feedback','Build weekly volume by no more than 10%'],
    cost:'£90 for shoes', derby:'Markeaton Park parkrun; the Derwent Valley path runs north out of the city.',
    fail:'Every run at the same medium effort. Easy days easy, hard days hard.' },

  { id:'coffee', n:'Specialty coffee', x:[.15,.45,.15,.50,.02,.02,.35,.75], ceil:.55,
    is:'Grinder, scale, one brew method, and a variable you change one at a time.',
    why:'Small, daily, sensory, and it makes an existing habit slightly better rather than adding a new obligation. Modest ceiling, honestly stated.',
    first:['The grinder matters more than the brewer','One method — V60 or AeroPress — for three months','Change one variable per brew or you learn nothing'],
    cost:'£150 for a real grinder', fail:'Buying an espresso machine first. It is the hardest method and the least forgiving.' },

  { id:'chess', n:'Chess or Go', x:[.40,.50,.05,.15,.02,.02,.05,1], ceil:1, anti:true,
    is:'Infinite ceiling, zero capital, complete portability.',
    why:'Listed as the anti-recommendation. You are already almost entirely cognitive, sedentary and solitary — this is excellent, and it deepens the exact axis you are already deepest on. Take it only if you have decided balance is not the goal.',
    first:['Tactics puzzles daily, openings never','Play long games, review every loss','A club, so it is social rather than a phone habit'],
    cost:'Free', fail:'Blitz on a phone. That is consumption wearing a hobby’s clothes.' },

  { id:'oud', n:'Oud or ney', x:[.30,.40,.30,.90,.02,.02,.50,.60], ceil:.95, flagged:true,
    is:'The maqām system, which is a genuinely deep music theory with a scholarly literature of its own.',
    why:'Listed as information, not as a recommendation. There is a live scholarly disagreement about instruments — some positions permit them broadly, some restrict to the duff. That is your call to make deliberately rather than by drift, which is why it is on the list rather than quietly omitted.',
    first:['Settle the fiqh question first, properly','Then: a teacher, because maqām is not self-taught from video','Ney is cheaper and harder; oud is the opposite'],
    cost:'£200+', fail:'Skipping the first step and resolving it later by habit.' }
];

/* =====================================================================
   TRAVEL — six axes, then destinations. Visa notes are written for a
   Saudi passport held by a UK resident, and they change; always verify.
   ===================================================================== */
export const TAXES = [
  { k:'nat', n:'Nature',   lo:'city',     hi:'wild' },
  { k:'pce', n:'Pace',     lo:'slow',     hi:'packed' },
  { k:'sol', n:'Solitude', lo:'crowded',  hi:'empty' },
  { k:'hst', n:'Heritage', lo:'modern',   hi:'deep history' },
  { k:'fud', n:'Food',     lo:'incidental',hi:'a reason to go' },
  { k:'phy', n:'Physical', lo:'easy',     hi:'demanding' }
];

export const DESTS = [
  /* --- weekends from Derby --- */
  { id:'peak', n:'Peak District', c:'England', days:2, cost:1, ride:3, region:'uk', when:'Apr–Oct, and crisp dry winter days',
    x:[.85,.35,.55,.45,.30,.70], why:'Twenty minutes from your door and it contains most of what you would fly for. Treat it as the default, not the fallback.' },
  { id:'lakes', n:'Lake District', c:'England', days:3, cost:2, ride:3, region:'uk', when:'May–Sep',
    x:[.95,.45,.45,.40,.35,.85], why:'Hardknott and Wrynose are the hardest tarmac in England on two wheels, and the fells behind them are better than the roads.' },
  { id:'eryri', n:'Eryri (Snowdonia)', c:'Wales', days:3, cost:2, ride:3, region:'uk', when:'May–Sep',
    x:[.95,.50,.55,.45,.30,.90], why:'Mountains, passes and the best riding roads in Britain within an hour of each other.' },
  { id:'dales', n:'Yorkshire Dales', c:'England', days:2, cost:1, ride:3, region:'uk', when:'May–Sep',
    x:[.90,.35,.70,.45,.40,.65], why:'Buttertubs, Swaledale and empty B-roads. Quieter than the Peaks for the same two hours of driving.' },
  { id:'northumb', n:'Northumberland & Hadrian’s Wall', c:'England', days:3, cost:2, ride:3, region:'uk', when:'May–Sep',
    x:[.85,.35,.90,.85,.30,.55], why:'The emptiest county in England, a Roman frontier, and dark skies. Underrated by everyone.' },
  { id:'skye', n:'Isle of Skye & Torridon', c:'Scotland', days:5, cost:2, ride:3, region:'uk', when:'May–Jun, Sep',
    x:[1,.40,.75,.50,.35,.85], why:'The most dramatic landscape in Britain. Go in May or September; July is midges and coaches.' },
  { id:'iomtrip', n:'Isle of Man', c:'Isle of Man', days:4, cost:2, ride:3, region:'uk', when:'TT: late May – early Jun',
    x:[.65,.70,.30,.60,.35,.50], why:'A public road with derestricted sections, and once a year the largest gathering of motorcyclists on earth. Book the ferry a year out for TT.' },

  /* --- Europe --- */
  { id:'nc500', n:'North Coast 500', c:'Scotland', days:7, cost:2, ride:3, region:'eu', when:'May–Jun, Sep',
    x:[1,.55,.70,.40,.40,.70], why:'516 miles of Highland coast. Applecross and the Bealach na Bà is the day everything else is arranged around.' },
  { id:'wildatlantic', n:'Wild Atlantic Way', c:'Ireland', days:7, cost:2, ride:3, region:'eu', when:'May–Sep',
    x:[.95,.45,.65,.55,.50,.60], why:'1,600 miles of Atlantic coast road. Your UK residence makes this the easiest border you will ever cross.' },
  { id:'dolomites', n:'Dolomites', c:'Italy', days:6, cost:3, ride:3, region:'eu', when:'Jun–Sep',
    x:[.95,.55,.45,.50,.75,.80], why:'Passo Gardena, Sella, Pordoi — four passes in one loop. The best density of good road anywhere in Europe.' },
  { id:'alps', n:'Stelvio, Furka & Grossglockner', c:'Italy / Switzerland / Austria', days:8, cost:3, ride:3, region:'eu', when:'late Jun–Sep (passes shut in snow)',
    x:[.95,.65,.35,.45,.60,.75], why:'The three most famous alpine passes in one route. Ride them on a weekday morning or share them with every coach in Europe.' },
  { id:'pyrenees', n:'Pyrenees', c:'France / Spain', days:7, cost:2, ride:3, region:'eu', when:'May–Oct',
    x:[.90,.50,.70,.55,.70,.75], why:'Alpine quality roads with a fraction of the alpine traffic, and both sides of the range are worth doing.' },
  { id:'norway', n:'Atlantic Road, Trollstigen & Lofoten', c:'Norway', days:10, cost:3, ride:3, region:'eu', when:'Jun–Aug',
    x:[1,.50,.75,.35,.40,.70], why:'Fjord roads, tunnels through mountains, and light that does not end. Expensive in a way that is worth planning for rather than discovering.' },
  { id:'iceland', n:'Iceland ring road', c:'Iceland', days:8, cost:3, ride:2, region:'eu', when:'Jun–Aug',
    x:[1,.50,.80,.30,.35,.65], why:'Volcanic, empty, and unlike anywhere else you will go. Wind is the constraint, not rain.' },
  { id:'andalusia', n:'Granada, Córdoba & Seville', c:'Spain', days:6, cost:2, ride:2, region:'eu', when:'Mar–May, Oct–Nov',
    x:[.25,.55,.25,1,.85,.30], why:'Al-Andalus, standing. The Alhambra and the Mezquita in one week, and the ride between them through the Sierra Nevada is not a compromise.' },
  { id:'istanbul', n:'Istanbul', c:'Türkiye', days:5, cost:1, ride:0, region:'eu', when:'Apr–May, Sep–Oct',
    x:[.10,.75,.10,.95,.95,.30], why:'Two empires, one city, and the best street food on the continent. The Süleymaniye at fajr is the reason to go.' },
  { id:'bosnia', n:'Sarajevo, Mostar & Blagaj', c:'Bosnia', days:6, cost:1, ride:3, region:'eu', when:'May–Jun, Sep',
    x:[.60,.50,.55,.90,.75,.45], why:'Ottoman Europe with the twentieth century written over it. Cheap, mountainous, and one of the great riding countries nobody names.' },
  { id:'albania', n:'Albanian Alps & Riviera', c:'Albania', days:8, cost:1, ride:3, region:'eu', when:'May–Jun, Sep',
    x:[.85,.45,.75,.65,.65,.80], why:'The last genuinely cheap, genuinely wild corner of Europe. Theth to Valbona on foot, the SH8 coast road on wheels.' },
  { id:'slovenia', n:'Julian Alps & Vršič', c:'Slovenia', days:5, cost:2, ride:3, region:'eu', when:'Jun–Sep',
    x:[.90,.50,.60,.50,.60,.70], why:'Fifty hairpins on one pass, a country you can cross in three hours, and none of the alpine prices.' },
  { id:'faroes', n:'Faroe Islands', c:'Faroe Islands', days:5, cost:3, ride:2, region:'eu', when:'Jun–Aug',
    x:[1,.35,.95,.40,.30,.70], why:'Eighteen islands, more sheep than people, and weather that changes every twenty minutes. Solitude is the product.' },

  /* --- the Islamic world and Asia --- */
  { id:'samarkand', n:'Samarkand & Bukhara', c:'Uzbekistan', days:8, cost:1, ride:1, region:'asia', when:'Apr–May, Sep–Oct',
    x:[.35,.50,.55,1,.65,.35], why:'The Registan, Ulugh Beg’s observatory, and Imām al-Bukhārī’s tomb outside Samarkand. The centre of Islamic scholarship for four centuries, and cheap to reach.' },
  { id:'morocco', n:'Fez & the High Atlas', c:'Morocco', days:8, cost:1, ride:3, region:'africa', when:'Mar–May, Sep–Nov',
    x:[.70,.55,.50,.90,.85,.65], why:'Tizi n’Test and Tizi n’Tichka are two of the great mountain roads, and Fez el-Bali is the largest car-free urban area on earth.' },
  { id:'oman', n:'Jebel Shams, Wadi Shab & Musandam', c:'Oman', days:8, cost:2, ride:2, region:'gulf', when:'Nov–Mar',
    x:[.90,.40,.80,.65,.55,.70], why:'The most beautiful country in the Gulf and the easiest for you to reach. Wadis, an eleven-thousand-foot canyon rim, and empty roads.' },
  { id:'alula', n:'AlUla & Hegra', c:'Saudi Arabia', days:4, cost:2, ride:2, region:'gulf', when:'Nov–Mar',
    x:[.85,.40,.70,.95,.45,.45], why:'Nabataean tombs cut into sandstone, a UNESCO site, and it is home. Most people fly over it to see the smaller version in Jordan.' },
  { id:'petra', n:'Petra & Wadi Rum', c:'Jordan', days:5, cost:2, ride:2, region:'gulf', when:'Mar–May, Sep–Nov',
    x:[.85,.55,.50,1,.55,.70], why:'Arrive at Petra at opening or do not bother. Wadi Rum after, and sleep out.' },
  { id:'cairo', n:'Islamic Cairo', c:'Egypt', days:6, cost:1, ride:0, region:'africa', when:'Nov–Mar',
    x:[.15,.75,.05,1,.85,.35], why:'Ibn Ṭūlūn, al-Azhar, the Citadel and Khan el-Khalili. A thousand years of continuous scholarship in walking distance.' },
  { id:'kyoto', n:'Kyoto & Nara', c:'Japan', days:8, cost:3, ride:1, region:'asia', when:'late Mar–Apr, Nov',
    x:[.45,.60,.35,.95,.95,.45], why:'The craft obsession you would recognise from the films. Go in November for maple, not April for cherry; the crowds are half.' },
  { id:'georgia', n:'Kazbegi & Tusheti', c:'Georgia', days:8, cost:1, ride:2, region:'asia', when:'Jun–Sep (Tusheti road only)',
    x:[.95,.45,.85,.75,.80,.85], why:'The Abano Pass into Tusheti is regularly called the most dangerous road in the world and is only open three months a year. Everything else in the country is easy.' },
  { id:'hagiang', n:'Hà Giang loop', c:'Vietnam', days:6, cost:1, ride:3, region:'asia', when:'Sep–Nov, Mar–May',
    x:[.85,.60,.55,.55,.85,.60], why:'Karst mountains on the Chinese border, ridden on a small bike, four days. The best cheap motorcycle trip in the world.' },
  { id:'ladakh', n:'Ladakh & Khardung La', c:'India', days:12, cost:2, ride:3, region:'asia', when:'Jun–Sep only',
    x:[1,.50,.85,.80,.55,.95], why:'Himalayan passes above 17,000 feet on a Royal Enfield. Altitude is the real difficulty, not the road.' },
  { id:'salalah', n:'Salalah in khareef', c:'Oman', days:6, cost:2, ride:1, region:'asia', when:'late Jun–early Sep — khareef only',
    x:[.80,.40,.60,.55,.35,.60], why:'For three months the monsoon turns a corner of Arabia into green fog while the rest of the Gulf burns at fifty. The Arab world\u2019s only cool summer, two hours from Kuwait.' },
  { id:'kyrgyz', n:'Song-Köl & the Tien Shan', c:'Kyrgyzstan', days:10, cost:1, ride:2, region:'asia', when:'Jun–Sep',
    x:[1,.35,.95,.55,.50,.85], why:'Alpine lakes at 3,000m, yurts, and almost nobody. The Silk Road half that nobody visits.' }
];

export const ITEMKINDS = [
  { k:'travel', n:'Travel', g:'✈' }, { k:'stay', n:'Stay', g:'⌂' },
  { k:'see', n:'See', g:'◉' }, { k:'eat', n:'Eat', g:'▲' },
  { k:'ride', n:'Ride', g:'⚡' }, { k:'walk', n:'Walk', g:'⚑' },
  { k:'salah', n:'Salah / masjid', g:'❈' }, { k:'admin', n:'Admin', g:'▦' }
];

/* Post-trip debrief: expected vs actual on the travel axes is what trains the model.
 * Without it, a trip log is a diary and predicts nothing. */
export const DEBRIEF = [
  { k:'rating', n:'Would you go again?', kind:'rate' },
  { k:'pace',   n:'Pace',    lo:'too slow',   hi:'too packed' },
  { k:'crowd',  n:'Crowds',  lo:'empty',      hi:'overrun' },
  { k:'cost',   n:'Cost',    lo:'under',      hi:'well over' },
  { k:'again',  n:'The one thing you would change', kind:'text' }
];

/* =====================================================================
   TRIP GUIDES — the everything-page for a booked trip. A guide is
   editorial and ships with the app; the trip record only points at it,
   so sync stays light and the content survives any round-trip.
   ===================================================================== */
export const GUIDES = {
  'salalah-khareef': {
    title: 'Salalah — the khareef book',
    sub: 'Everything a traveler needs, one page. Dhofar, Oman · 27 Aug – 1 Sep 2026.',
    coords: { lat: 17.02, lon: 54.09, tz: 'Asia/Muscat' },

    logistics: {
      out:  { line: 'Jazeera J9165 · Kuwait T5 09:35 → Salalah 13:30 · Wed 27 Aug', note: 'Local times — Salalah is an hour AHEAD, the flight is ~2h55.' },
      back: { line: 'Jazeera J9166 · Salalah 14:15 → Kuwait 16:10 · Tue 1 Sep', note: 'Be at SLL by 12:15. It is a small airport; that is enough.' },
      stay: { line: 'Anantara Al Baleed Resort · 2× Deluxe Double, breakfast included', note: 'Voucher 838040498 · booking 1567954854113578 · beachfront, next to the Al Baleed ruins.' },
      party: '5 travelers',
      bags: 'Carry-on ONLY: 1×7kg each, max 55×40×20cm. Weigh at home. Khareef packing: light layers + one warm layer for fog viewpoints, rain shell, shoes with grip (wet rock everywhere), swimwear for the POOL (not the sea).',
    },

    khareef: 'From late June to early September the southwest monsoon drags a ceiling of cloud onto the Dhofar mountains. Temperatures sit at 23–27°C, drizzle comes and goes, fog rolls through the wadis, and the entire escarpment turns green — the only place on the Arabian Peninsula this happens. It is why you are going and why half the Gulf is going: expect crowds at the famous spots, go early in the morning, and never plan around a view — fog gives and takes without notice.',

    car: {
      why: 'The one thing not yet sorted. Everything worth seeing is 20–90 minutes out of town in different directions; taxis to wadis are expensive and one-way. One SUV seats five.',
      steps: [
        'Book ONLINE TODAY for Salalah Airport (SLL) pickup, 27 Aug ~13:45, return 1 Sep ~11:30. Khareef is peak season — walk-up counters do sell out.',
        'Aggregators: rentalcars.com / Kayak. Desks at SLL: Europcar, Budget, Avis, Sixt, Dollar, Thrifty + local firms. A local firm is fine if reviews hold up.',
        'Choose an SUV (Fortuner / Pajero class) — five people plus wadi tracks, wet grades and fog want clearance, not a Yaris.',
        'Bring: Kuwaiti driving licence (valid in Oman for GCC residents/citizens — no IDP needed), passport or civil ID, and a CREDIT card in the driver’s name for the deposit block (typically 100–200 OMR).',
        'At the counter: photograph existing damage on video before leaving the lot, confirm insurance excess, decline nothing that covers windscreen/tyres — gravel and wadi fords make those the two real risks.',
        'Fuel is ~0.23 OMR/litre (roughly a third of UK price). Return it full; airport station is 5 minutes from the terminal.',
      ],
      hazards: 'Driving rules of the week: fog on the mountain roads can drop visibility to metres — slow down, fog lights, never stop in a lane. CAMELS wander onto roads and own them, especially after dark; hitting one is the classic Dhofar accident. Wadis can flash-flood — never park in a wadi bed, never cross moving water.',
    },

    places: [
      { id: 'g-darbat',  n: 'Wadi Darbat', q: 'Wadi Darbat Salalah waterfall green khareef', why: 'THE khareef postcard — waterfalls, mist, green meadows, camels grazing. Go before 09:00 or it is a car park.', when: 'Morning, any day. 45 min east.' },
      { id: 'g-mughsail', n: 'Mughsail Beach & Marneef Cave', q: 'Mughsail beach blowholes Salalah cliffs', why: 'Blowholes firing seawater through the cliff floor — khareef swell makes them their loudest. Dramatic 40-minute coastal drive west.', when: 'Half a day west. Blowholes strongest at high tide.' },
      { id: 'g-fizayah', n: 'Fizayah Beach viewpoints', q: 'Fizayah beach Salalah cliffs aerial', why: 'White cliffs dropping into turquoise past Mughsail. The switchback track down wants the SUV — or just take the top viewpoints.', when: 'Add to the Mughsail day. LOOK, don’t swim.' },
      { id: 'g-aynrazat', n: 'Ayn Razat & Ayn Athum', q: 'Ayn Razat spring gardens Salalah', why: 'Spring-fed gardens and a khareef waterfall at Athum — easy, gentle, close to town. The family-pace afternoon.', when: '20 min from the hotel. Late afternoon light.' },
      { id: 'g-samhan', n: 'Jabal Samhan viewpoint', q: 'Jabal Samhan viewpoint Oman cliff', why: '1,800m escarpment edge above the coastal plain — when the fog opens it is the best view in southern Arabia. Leopard country.', when: 'Fog lottery — go if the morning is clear. 1h30 east.' },
      { id: 'g-tawi', n: 'Tawi Atair sinkhole', q: 'Tawi Atair sinkhole Oman', why: 'A 200m-deep karst well in the green mountains, birdsong echoing off the walls. Pairs with Samhan.', when: 'On the Samhan road.' },
      { id: 'g-khorrori', n: 'Khor Rori & Sumhuram', q: 'Khor Rori Sumhuram ruins Oman lagoon', why: 'Ruins of the 2,000-year-old frankincense port above a lagoon full of flamingos and camels. UNESCO, and genuinely moving.', when: 'Pairs with Wadi Darbat day. Small entry fee.' },
      { id: 'g-baleed', n: 'Al Baleed & Frankincense Museum', q: 'Al Baleed archaeological park Salalah night', why: 'Medieval trading-city ruins NEXT DOOR to your hotel, lit beautifully after dark, with the best museum on the incense trade.', when: 'Evening stroll from the Anantara. Open late.' },
      { id: 'g-ayoub', n: 'Tomb of Nabi Ayoub (Job)', q: 'Nabi Ayoub tomb Jabal Ittin Salalah fog', why: 'The traditional resting place of Prophet Ayoub, up in the Ittin fog. Ziyarah and the eeriest, greenest drive of the week in one.', when: '30 min up the mountain. Dress modestly; it is a shrine.' },
      { id: 'g-dawkah', n: 'Wadi Dawkah frankincense park', q: 'Wadi Dawkah frankincense trees Oman', why: 'The UNESCO grove where Boswellia sacra actually grows — the tree that built every city you will have seen by then.', when: '40 min north, desert side — it sits OUTSIDE the fog.' },
      { id: 'g-taqah', n: 'Taqah Castle & Mirbat', q: 'Taqah castle Oman fishing town', why: 'A restored wali’s fort in a sardine-fishing town, and Mirbat’s old merchant houses beyond it. The quiet, human-scale hour.', when: 'On the east-coast road, en route to Khor Rori.' },
      { id: 'g-haffa', n: 'Al Haffa Souq', q: 'Al Haffa souq frankincense Salalah', why: 'THE place for frankincense (luban), bukhoor and Dhofari silver. Grades of luban: al-Hojari (greenish, best) down to al-Shazri. Smell before buying; bargain gently.', when: 'Evening. Gifts + the corniche walk.' },
    ],

    culture: [
      'Dhofar is its own world, closer to Yemen’s Hadhramaut than to Muscat. Many locals speak Shehri/Jibbali — a pre-Arabic South Arabian language — alongside Arabic. Your Gulf Arabic works everywhere; a "salaam alaykum" opens every door.',
      'Omanis are famously reserved and famously kind — hospitality is quieter than Kuwait’s, never louder. Accept coffee and dates if offered; right hand for everything.',
      'Dress: modest for everyone in town (shoulders/knees covered). NEVER photograph local women, and ask men before close portraits. Drones need permits — leave it.',
      'Khareef season is Gulf family tourism at full tide — Salalah in these weeks is festive, crowded at headline sights, and completely used to visitors. The Salalah Tourism Festival runs through the season (shows, souqs, funfair at the Ittin road festival grounds).',
      'Friday 28 Aug is Jumu’ah — the Sultan Qaboos Mosque on As Sultan Qaboos St is the grand one; arrive early. Most sights and shops pause late Friday morning and reopen after ‘asr.',
      'Prayer is easy everywhere: every sight has a musalla or a mosque within minutes; Salalah prayer times run ~1h behind Kuwait clock-time in these dates (Maghrib ≈ 18:50 local).',
    ],

    food: [
      'Shuwa — lamb buried in a fire pit for a day; the Omani feast dish. Order a day ahead at traditional places.',
      'Majboos/kabsa you know; the Dhofari twist is fresh sardine and kingfish everywhere — Taqah’s grills do it best.',
      'The khareef street ritual: fresh coconut and small sweet bananas from the Al Haffa / Ittin road stalls, drunk in the drizzle.',
      'Camel milk (fresh or with saffron) — sold chilled at farms and stalls; try it once.',
      'Omani halwa with kahwa (cardamom coffee) — the hospitality pair; Dhofari halwa is darker and smokier than the northern kind.',
      'Restaurants: Omani/Yemeni grills around As Salam St; the Anantara’s Mekong and Al Mina cover the hotel nights. Alcohol-free city outside hotel bars — exactly as you’d want.',
    ],

    practical: [
      { k: 'Time', v: 'Oman is UTC+4 — one hour AHEAD of Kuwait. Set watches on landing; prayer apps update on their own.' },
      { k: 'Money', v: 'Omani Rial (OMR). 1 OMR ≈ 0.79 KWD ≈ 2.0 GBP — it is one of the strongest currencies on earth; a 20 OMR note is real money. Cards work in town; carry ~30 OMR cash for stalls, entry fees, coconuts.' },
      { k: 'Visa', v: 'None needed — Kuwaiti citizens enter with civil ID/passport under GCC rules.' },
      { k: 'SIM', v: 'Omantel or Ooredoo tourist SIM at SLL arrivals (~5 OMR, generous data). Roaming from Kuwait works but data-buckets beat it.' },
      { k: 'Plugs', v: 'Type G — identical to Kuwait and the UK. Bring nothing new.' },
      { k: 'Health', v: 'No vaccinations needed. The sea is the one danger: khareef rip currents kill every season — hotel pool yes, ocean NO, no exceptions, not ankle-deep. Wet rocks at waterfalls are the second — grip shoes.' },
      { k: 'Emergency', v: 'Royal Oman Police 9999. Sultan Qaboos Hospital Salalah is the big one. Pharmacies everywhere in town.' },
      { k: 'Weather habit', v: 'Check the fog, not the forecast: mornings are clearest, the mountain decides by noon. Plan mountains early, town/coast afternoons.' },
    ],
  },
};
