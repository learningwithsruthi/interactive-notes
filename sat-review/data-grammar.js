window.LWS = window.LWS || {};
(function () {
  const LWS = window.LWS;
  const r = String.raw;

  const SE = r`<p>Which choice completes the text so that it conforms to the conventions of Standard English?</p>`;
  const TR = r`<p>Which choice completes the text with the most logical transition?</p>`;
  const SY = r`<p>Which choice most effectively uses relevant information from the notes to accomplish this goal?</p>`;
  const list = (items) => '<ul>' + items.map((i) => '<li>' + i + '</li>').join('') + '</ul>';

  /* ------------------------------------------------------------------ */
  /* Guide: fast checklist first, then the 16 sheet sections in order    */
  /* ------------------------------------------------------------------ */
  LWS.grammarGuide = [
    {
      id: 'checklist',
      title: 'How It Works and the Fast Checklist',
      tested: 'high',
      html: r`
<p>The Digital SAT tests Standard English Conventions (punctuation, sentence boundaries, agreement, verb tense, modifiers) and Expression of Ideas (transitions, rhetorical synthesis).</p>
<div class="callout"><b>The method:</b> every answer choice usually changes one thing. Find what changes, name the rule, pick the choice that follows it.</div>
<p><b>Fast checklist</b></p>
<ol>
<li>Is each sentence a complete sentence?</li>
<li>Is punctuation joining the right pieces?</li>
<li>Do subject and verb agree? Do pronoun and noun agree?</li>
<li>Is the tense consistent?</li>
<li>Is the modifier next to what it describes?</li>
<li>If all of those are correct, choose the most concise.</li>
</ol>`
    },
    {
      id: 'parts-of-speech',
      title: '1. Parts of Speech',
      tested: 'low',
      html: r`
<table>
<tr><th>Part</th><th>Job</th><th>Examples</th></tr>
<tr><td>Noun</td><td>person, place, thing, idea</td><td>scientist, Paris, theory</td></tr>
<tr><td>Pronoun</td><td>replaces a noun</td><td>she, it, they, which, who</td></tr>
<tr><td>Verb</td><td>action or state</td><td>discovered, is, has been</td></tr>
<tr><td>Adjective</td><td>describes a noun</td><td>rapid growth</td></tr>
<tr><td>Adverb</td><td>describes a verb, adjective or adverb (often -ly)</td><td>grew rapidly; very rapid</td></tr>
<tr><td>Preposition</td><td>shows relationship (starts a phrase)</td><td>of, in, by, with, between</td></tr>
<tr><td>Conjunction</td><td>joins words or clauses</td><td>and, but, because, although</td></tr>
<tr><td>Article / determiner</td><td>points to a noun</td><td>a, an, the, this, each</td></tr>
<tr><td>Interjection</td><td>emotion</td><td>wow, oh</td></tr>
</table>
<p><b>Three kinds of conjunctions</b></p>
<ul>
<li><b>Coordinating (FANBOYS):</b> for, and, nor, but, or, yet, so. They join equal parts.</li>
<li><b>Subordinating:</b> because, although, while, since, if, when, unless, whereas. They make a clause dependent.</li>
<li><b>Correlative pairs:</b> either...or, neither...nor, not only...but also, both...and, whether...or.</li>
</ul>
<p><b>Adjective vs adverb:</b> <span class="no">She sang beautiful.</span> <span class="ok">She sang beautifully.</span> The word describes the verb, so it must be an adverb.</p>`
    },
    {
      id: 'building-blocks',
      title: '2. Sentence Building Blocks',
      tested: 'medium',
      html: r`
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td>Subject</td><td>who or what does the action</td></tr>
<tr><td>Predicate / verb</td><td>what the subject does or is</td></tr>
<tr><td>Phrase</td><td>group of words missing a subject or verb ("in the lab", "running fast")</td></tr>
<tr><td>Clause</td><td>has a subject and a verb</td></tr>
<tr><td>Independent clause (IC)</td><td>a clause that can stand alone as a sentence</td></tr>
<tr><td>Dependent clause (DC)</td><td>a clause that can't stand alone; starts with a subordinator (because, although) or a relative pronoun (who, which, that)</td></tr>
</table>
<p><b>IC:</b> The bees returned. <b>DC:</b> because the bees returned</p>
<p><b>Sentence types</b></p>
<ul>
<li>Simple: 1 IC</li>
<li>Compound: IC + IC</li>
<li>Complex: IC + DC</li>
<li>Compound-complex: 2 or more ICs + DC</li>
</ul>`
    },
    {
      id: 'sentence-boundaries',
      title: '3. Sentence Boundaries',
      tested: 'high',
      html: r`
<div class="callout">This is the most-tested grammar skill. Before you look at the punctuation, decide whether each side of the blank can stand alone.</div>
<p><b>Fragment:</b> not a complete sentence. <span class="no">Because the data were incomplete.</span></p>
<p><b>Run-on / comma splice:</b> two ICs joined by only a comma, or by nothing. <span class="no">The data were incomplete, the study was delayed.</span></p>
<p><b>Correct ways to join two independent clauses</b></p>
<table>
<tr><th>Pattern</th><th>Example</th></tr>
<tr><td>IC . IC</td><td><span class="ok">The data were incomplete. The study was delayed.</span></td></tr>
<tr><td>IC ; IC</td><td><span class="ok">The data were incomplete; the study was delayed.</span></td></tr>
<tr><td>IC , FANBOYS IC</td><td><span class="ok">The data were incomplete, so the study was delayed.</span></td></tr>
<tr><td>IC : IC (second explains first)</td><td><span class="ok">The study was delayed: the data were incomplete.</span></td></tr>
<tr><td>IC — IC (explains, informal)</td><td><span class="ok">The study was delayed — the data were incomplete.</span></td></tr>
<tr><td>DC , IC</td><td><span class="ok">Because the data were incomplete, the study was delayed.</span></td></tr>
<tr><td>IC DC (usually no comma)</td><td><span class="ok">The study was delayed because the data were incomplete.</span></td></tr>
</table>
<div class="callout"><b>Semicolon = period.</b> Both sides must be complete sentences. A comma plus a transition word is still a splice.<br>
<span class="no">...incomplete, however, the study...</span><br>
<span class="ok">...incomplete; however, the study...</span></div>`
    },
    {
      id: 'commas',
      title: '4. Commas',
      tested: 'high',
      html: r`
<p><b>Use a comma</b></p>
<ol>
<li>Lists of 3 or more: <span class="ok">red, white, and blue</span></li>
<li>Before FANBOYS joining two ICs: <span class="ok">It rained, but we played.</span></li>
<li>After an introductory element: <span class="ok">After the storm, we left.</span> <span class="ok">However, ...</span></li>
<li>Around nonessential information, in pairs: <span class="ok">My sister, a nurse, works nights.</span></li>
<li>Between coordinate adjectives (if "and" works between them): <span class="ok">a long, difficult test</span></li>
<li>Before a quotation, with direct address, and with dates and places: <span class="ok">Austin, Texas, is...</span></li>
</ol>
<p><b>Don't use a comma</b></p>
<ul>
<li>Between a subject and its verb: <span class="no">The results of the study, showed...</span></li>
<li>Between a verb and its object: <span class="no">She found, that...</span></li>
<li>Before "that" or around essential information</li>
<li>Between a preposition and its object: <span class="no">such as, oak</span></li>
<li>To join two ICs alone (comma splice)</li>
<li>Between two items joined by "and" (compound verb): <span class="no">She studied, and passed.</span></li>
</ul>`
    },
    {
      id: 'essential',
      title: '5. Essential vs Nonessential Elements',
      tested: 'high',
      html: r`
<p><b>Nonessential</b> (extra information; the sentence still makes sense without it): set off with a matching pair of two commas, two dashes, or two parentheses.<br>
<span class="ok">The Nile, which flows north, is long.</span></p>
<p><b>Essential</b> (needed to identify which one): no commas.<br>
<span class="ok">The river that flows north is the Nile.</span></p>
<table>
<tr><th>Word</th><th>Use</th></tr>
<tr><td>which</td><td>nonessential, with commas</td></tr>
<tr><td>that</td><td>essential, no commas</td></tr>
<tr><td>who / whom</td><td>people (either kind)</td></tr>
</table>
<p><b>Match the pair.</b> Whatever opens the extra information has to close it.<br>
<span class="no">The author — who won the prize, spoke.</span><br>
<span class="ok">The author — who won the prize — spoke.</span><br>
<span class="ok">The author, who won the prize, spoke.</span></p>
<p><b>Appositives</b> (a noun renaming a noun)</p>
<ul>
<li>Title before a name, no commas: <span class="ok">biologist Rachel Carson</span></li>
<li>Follows the noun as extra information, commas: <span class="ok">Rachel Carson, a biologist,</span></li>
</ul>`
    },
    {
      id: 'semicolons-colons-dashes',
      title: '6. Semicolons, Colons, Dashes',
      tested: 'high',
      html: r`
<table>
<tr><th>Mark</th><th>Rule</th></tr>
<tr><td>;</td><td>Joins two ICs, like a period. Also separates list items that already contain commas: <span class="ok">Paris, France; Rome, Italy; and Oslo, Norway</span></td></tr>
<tr><td>:</td><td>Must follow an IC. Introduces a list, explanation, example or quote.</td></tr>
<tr><td>— (single)</td><td>Like a colon: emphasizes what follows.</td></tr>
<tr><td>— ... — (pair)</td><td>Like a pair of commas around extra information.</td></tr>
<tr><td>( )</td><td>Extra information, less important.</td></tr>
</table>
<p><b>The colon test:</b> cover everything after the colon. What is left has to be a complete sentence.<br>
<span class="no">The ingredients are: flour, eggs, and milk.</span> ("The ingredients are" can't stand alone.)<br>
<span class="ok">She needed three things: flour, eggs, and milk.</span></p>`
    },
    {
      id: 'apostrophes',
      title: '7. Apostrophes and Possessives',
      tested: 'high',
      html: r`
<table>
<tr><th>Form</th><th>Example</th></tr>
<tr><td>singular possessive: 's</td><td><span class="ok">the student's book</span></td></tr>
<tr><td>plural possessive (ends in s): s'</td><td><span class="ok">the students' books</span></td></tr>
<tr><td>irregular plural: 's</td><td><span class="ok">the children's toys</span></td></tr>
<tr><td>plural, not possessive: no apostrophe</td><td><span class="ok">the scientists ran tests</span></td></tr>
</table>
<p><b>Pronoun possessives have no apostrophe:</b> its, their, whose, your, theirs.</p>
<table>
<tr><th>Possessive</th><th>Sounds like</th></tr>
<tr><td>its</td><td>it's = it is</td></tr>
<tr><td>their</td><td>they're = they are; there = place</td></tr>
<tr><td>whose</td><td>who's = who is</td></tr>
<tr><td>your</td><td>you're = you are</td></tr>
</table>
<div class="callout"><b>Test:</b> does it own the next noun? Then it's possessive. Can you expand it to "it is"? Then it's a contraction.</div>`
    },
    {
      id: 'subject-verb',
      title: '8. Subject-Verb Agreement',
      tested: 'high',
      html: r`
<p>Singular subject, singular verb (is, has, -s). Plural subject, plural verb (are, have). Find the true subject first.</p>
<ul>
<li><b>Cross out prepositional phrases:</b> <span class="ok">The box of cookies is...</span></li>
<li><b>Cross out nonessential information:</b> <span class="ok">The coach, along with the players, was...</span></li>
<li><b>"and" = plural:</b> <span class="ok">Ana and Ben are...</span></li>
<li><b>or / nor, match the closer subject:</b> <span class="ok">Neither the teacher nor the students were...</span></li>
<li><b>Inverted order:</b> <span class="ok">Among the ruins were two statues.</span> <span class="ok">There are many...</span></li>
<li><b>Singular:</b> each, every, either, neither, anyone, everyone, nobody, something; "the number of"</li>
<li><b>Plural:</b> both, few, many, several; "a number of"</li>
<li><b>Collective nouns</b> (team, committee, jury) are usually singular on the SAT: <span class="ok">The team is...</span></li>
<li><b>Gerund subjects are singular:</b> <span class="ok">Reading novels improves...</span></li>
</ul>
<div class="callout"><b>Data</b> is the one to watch. It can go either way, so follow how the passage uses it. The examples in this guide say "the data were".</div>`
    },
    {
      id: 'pronouns',
      title: '9. Pronouns',
      tested: 'high',
      html: r`
<p><b>Agreement:</b> a pronoun matches its noun in number. Companies, schools, and teams take it / its, not they.<br>
<span class="no">The company lost their lead.</span> <span class="ok">The company lost its lead.</span></p>
<p><b>Clear reference:</b> the pronoun must point to one obvious noun.<br>
<span class="no">When Maya met Jo, she smiled.</span> (Who smiled?)</p>
<table>
<tr><th>Subject case</th><th>Object case</th><th>Possessive</th></tr>
<tr><td>I, he, she, we, they, who</td><td>me, him, her, us, them, whom</td><td>my, his, her, our, their, whose</td></tr>
</table>
<ul>
<li><b>Drop the other person:</b> <span class="ok">between you and me</span>; <span class="ok">She and I went.</span></li>
<li><b>who vs whom:</b> if you'd answer with he, use who. If you'd answer with him, use whom.</li>
<li><b>Comparisons:</b> <span class="ok">taller than I (am)</span></li>
</ul>`
    },
    {
      id: 'tense',
      title: '10. Verb Tense and Form',
      tested: 'medium',
      html: r`
<table>
<tr><th>Tense</th><th>Form</th><th>Use</th></tr>
<tr><td>simple present / past / future</td><td>walks / walked / will walk</td><td>habit / finished / later</td></tr>
<tr><td>present perfect</td><td>has or have + past participle</td><td>began in the past, continues now</td></tr>
<tr><td>past perfect</td><td>had + past participle</td><td>happened before another past event</td></tr>
<tr><td>progressive</td><td>is or was + -ing</td><td>ongoing action</td></tr>
</table>
<ul>
<li>Stay consistent with the passage's tense unless the timeline changes.</li>
<li><b>Irregular participles:</b> <span class="ok">has gone</span> (not <span class="no">has went</span>), <span class="ok">had written</span>, <span class="ok">has risen</span>, <span class="ok">had begun</span>, <span class="ok">has swum</span>.</li>
<li><b>Fragment trap:</b> an -ing word alone is not a verb. <span class="no">The scientist studying cells.</span></li>
</ul>`
    },
    {
      id: 'modifiers',
      title: '11. Modifiers',
      tested: 'high',
      html: r`
<p>A modifier must sit right next to the thing it describes.</p>
<p><b>Dangling modifier</b><br>
<span class="no">Walking into the room, the lights turned on.</span> (The lights weren't walking.)<br>
<span class="ok">Walking into the room, Maria turned on the lights.</span></p>
<div class="callout"><b>SAT rule:</b> after an introductory phrase and a comma, the very next noun must be the one doing or being that phrase. Check who did the action.</div>
<p><b>Misplaced modifier:</b> position changes the meaning.<br>
"She almost ate the whole pizza" means she ate none of it. "She ate almost the whole pizza" means she ate most of it.</p>`
    },
    {
      id: 'parallel-comparison',
      title: '12. Parallel Structure and Comparisons',
      tested: 'medium',
      html: r`
<ul>
<li><b>Lists keep the same form:</b> <span class="ok">She likes hiking, swimming, and biking.</span> <span class="no">She likes hiking, swimming, and to bike.</span></li>
<li><b>Correlative pairs match on both sides:</b> <span class="ok">not only fast but also accurate</span>; either...or; neither...nor.</li>
<li><b>Compare like things:</b> <span class="no">Her essay was longer than Tom.</span> <span class="ok">Her essay was longer than Tom's.</span> <span class="ok">Her essay was longer than that of Tom.</span> For plurals, use "those of".</li>
<li><b>Comparatives:</b> two things take -er or more. Three or more take -est or most.</li>
<li><b>fewer</b> (countable) vs <b>less</b> (amount).</li>
<li><b>between</b> (two) vs <b>among</b> (three or more).</li>
</ul>`
    },
    {
      id: 'transitions',
      title: '13. Transitions',
      tested: 'high',
      html: r`
<p>Read the sentence before and the one with the blank. Decide the relationship, then pick the word.</p>
<table>
<tr><th>Relationship</th><th>Transitions</th></tr>
<tr><td>Addition</td><td>furthermore, moreover, in addition, additionally, also</td></tr>
<tr><td>Contrast</td><td>however, nevertheless, nonetheless, on the other hand, in contrast, conversely, yet, still</td></tr>
<tr><td>Cause and effect</td><td>therefore, thus, consequently, as a result, hence, accordingly</td></tr>
<tr><td>Example</td><td>for example, for instance, specifically, to illustrate</td></tr>
<tr><td>Similarity</td><td>similarly, likewise, in the same way</td></tr>
<tr><td>Sequence / time</td><td>first, next, then, subsequently, finally, meanwhile, previously</td></tr>
<tr><td>Emphasis / clarification</td><td>in fact, indeed, that is, in other words</td></tr>
<tr><td>Concession</td><td>admittedly, granted, although, even so</td></tr>
<tr><td>Conclusion</td><td>in conclusion, ultimately, overall, in short</td></tr>
</table>
<div class="callout"><b>Trap:</b> two answers with the same meaning (thus and therefore, for example) are both wrong. The correct one has a different relationship.</div>`
    },
    {
      id: 'synthesis',
      title: '14. Rhetorical Synthesis',
      tested: 'high',
      html: r`
<p>You get bullet-point notes and a goal, such as "The student wants to emphasize a difference..."</p>
<ol>
<li>Read the goal first and underline the task word: compare, emphasize, introduce, explain, present a finding.</li>
<li>Eliminate choices that are accurate but off-goal.</li>
<li>For compare or contrast goals, the answer must mention both things.</li>
</ol>
<div class="callout">Every choice is usually true to the notes. You are not checking facts. You are checking whether the sentence does the job named in the goal.</div>`
    },
    {
      id: 'concision',
      title: '15. Concision and Word Choice',
      tested: 'low',
      html: r`
<ul>
<li><b>Redundancy:</b> <span class="no">annual yearly report</span>, <span class="no">return back</span>, <span class="no">the reason is because</span>. Cut the repeats.</li>
<li>When all choices are grammatical and say the same thing, pick the shortest.</li>
</ul>
<table>
<tr><th>Often confused</th><th>Meaning</th></tr>
<tr><td>affect / effect</td><td>affect = verb (influence); effect = noun (result)</td></tr>
<tr><td>than / then</td><td>comparison; time</td></tr>
<tr><td>accept / except</td><td>receive; excluding</td></tr>
<tr><td>principal / principle</td><td>main, school head; rule</td></tr>
<tr><td>complement / compliment</td><td>completes; praise</td></tr>
<tr><td>imply / infer</td><td>speaker suggests; listener concludes</td></tr>
<tr><td>could have</td><td>never "could of"</td></tr>
</table>`
    },
    {
      id: 'quotations',
      title: '16. Quotations and Other Marks',
      tested: 'low',
      html: r`
<ul>
<li>Commas and periods go inside closing quotes: <span class="ok">"Go," she said.</span></li>
<li>Use a colon before a quote only after a complete sentence. Use a comma after "said" or "wrote".</li>
<li>No comma when a quote blends into your sentence: <span class="ok">The author calls it "a turning point."</span></li>
<li>Question mark only for a direct question: <span class="no">She asked if it was ready?</span> <span class="ok">She asked if it was ready.</span></li>
<li>Titles: italics for books and films; "quotes" for articles and poems.</li>
</ul>`
    }
  ];

  /* ------------------------------------------------------------------ */
  /* Walkthroughs: 10 step-through problems for class                    */
  /* ------------------------------------------------------------------ */
  LWS.grammarWalk = [
    {
      id: 'gw1',
      title: 'Comma Splice With However',
      skill: 'Sentence Boundaries',
      level: 'medium',
      stem: r`<p>The city's first subway line opened ahead of schedule ______ ridership in its first year fell far short of projections.</p>` + SE + list([r`schedule, however,`, r`schedule however,`, r`schedule; however,`, r`schedule, however`]),
      steps: [
        {
          say: r`Compare the four choices. What is the one thing changing?`,
          type: 'mc',
          choices: [r`The punctuation around "however"`, r`The meaning of "however"`, r`The tense of the verb`, r`The word order of the clause`],
          hint: r`Every choice has the same two words. Look at what surrounds them.`,
          after: r`The words stay the same and only the punctuation moves, so this is a boundary question. Start by testing each side of the blank.`
        },
        {
          say: r`Read only what comes before the blank: "The city's first subway line opened ahead of schedule." What is it?`,
          type: 'mc',
          choices: [r`An independent clause`, r`A dependent clause`, r`A phrase with no verb`],
          hint: r`Does it have a subject and a verb, and could you put a period after it?`,
          after: r`It has a subject (line) and a verb (opened), and it can stand alone.`
        },
        {
          say: r`Now read what comes after: "ridership in its first year fell far short of projections." What is it?`,
          type: 'mc',
          choices: [r`An independent clause`, r`A dependent clause`, r`A phrase with no verb`],
          hint: r`Find the subject and the verb. "Fell" is the verb.`,
          after: r`It is also a complete sentence. So you have IC + IC, and you need a real joiner between them.`
        },
        {
          say: r`Can "however" join two independent clauses if it only has commas around it?`,
          type: 'mc',
          choices: [r`No. It is a transition word, so it still needs a period or semicolon in front of it.`, r`Yes. Commas on both sides are enough.`, r`Yes, but only if the comma after it is left out.`],
          hint: r`"However" is not one of the FANBOYS.`,
          after: r`A comma plus a transition word is still a comma splice. The boundary has to be a semicolon or a period, and the comma after "however" sets it off from the clause it starts.`
        },
        {
          say: r`Pick the final answer.`,
          type: 'mc',
          choices: [r`schedule; however,`, r`schedule, however,`, r`schedule however,`, r`schedule, however`],
          hint: r`Semicolon before, comma after.`,
          after: r`"schedule; however," puts a strong boundary between the clauses and sets off the transition. The two choices with a comma before "however" are splices, and the choice with no mark is a run-on.`
        }
      ],
      takeaway: r`Transition words like however and therefore do not join sentences. Check both sides first. If both can stand alone, you need a semicolon or period before the transition.`
    },
    {
      id: 'gw2',
      title: 'Semicolon vs Comma With a Transition',
      skill: 'Sentence Boundaries',
      level: 'hard',
      stem: r`<p>Early charts of the northern coast were drawn from memory ______ many harbors appeared miles from their true positions.</p>` + SE + list([r`memory, as a result,`, r`memory, as a result;`, r`memory; as a result,`, r`memory as a result,`]),
      steps: [
        {
          say: r`What changes among the choices?`,
          type: 'mc',
          choices: [r`Where the semicolon and commas sit around "as a result"`, r`Which transition word is used`, r`The verb in the second clause`],
          hint: r`All four use the same transition.`,
          after: r`Same words, different punctuation. Two things matter here: where the boundary goes, and which clause the transition belongs to.`
        },
        {
          say: r`The text before the blank and the text after it are both independent clauses. Which marks can separate them?`,
          type: 'mc',
          choices: [r`A semicolon or period, but not a comma alone`, r`A comma alone`, r`No mark at all`],
          hint: r`Two ICs. A semicolon works like a period.`,
          after: r`That removes the choices with no semicolon: "memory, as a result," is a splice and "memory as a result," is a run-on.`
        },
        {
          say: r`Two choices are left, so ask about logic. Which idea is the result?`,
          type: 'mc',
          choices: [r`Many harbors appeared miles from their true positions`, r`The charts were drawn from memory`],
          hint: r`Which happened because of the other?`,
          after: r`Drawing from memory is the cause, and the wrong positions are the effect. So "as a result" belongs with the second clause, after the semicolon.`
        },
        {
          say: r`Pick the final answer.`,
          type: 'mc',
          choices: [r`memory; as a result,`, r`memory, as a result;`, r`memory, as a result,`, r`memory as a result,`],
          hint: r`The transition should open the clause that states the result.`,
          after: r`"memory; as a result," puts the boundary before the transition, so the transition opens the effect. "memory, as a result;" has legal marks but says the charts were drawn from memory because of something else, which reverses the logic.`
        }
      ],
      takeaway: r`When a semicolon can go on either side of a transition, read for logic. The semicolon goes on the side that keeps the transition with the clause it describes.`
    },
    {
      id: 'gw3',
      title: 'Matching a Nonessential Pair',
      skill: 'Commas and Nonessentials',
      level: 'medium',
      stem: r`<p>Brannock Observatory's oldest telescope, a brass instrument built in the ______ still used by students on clear nights.</p>` + SE + list([r`1880s is`, r`1880s; is`, r`1880s, is`, r`1880s—is`]),
      steps: [
        {
          say: r`What changes among the choices?`,
          type: 'mc',
          choices: [r`The punctuation after "1880s"`, r`The verb`, r`The date`],
          hint: r`"1880s" and "is" appear in every choice.`,
          after: r`Only the mark changes. Look back in the sentence to see whether a mark has already been opened.`
        },
        {
          say: r`Which part can you lift out and still have a complete sentence?`,
          type: 'mc',
          choices: [r`a brass instrument built in the 1880s`, r`Brannock Observatory's oldest telescope`, r`still used by students`],
          hint: r`Try reading the sentence aloud without it.`,
          after: r`"Brannock Observatory's oldest telescope is still used by students on clear nights" works on its own. The middle part is nonessential.`
        },
        {
          say: r`Which mark opens that nonessential part?`,
          type: 'mc',
          choices: [r`A comma`, r`A dash`, r`A parenthesis`, r`Nothing`],
          hint: r`Look right after "telescope".`,
          after: r`It opens with a comma, so it must close with a comma. Pairs have to match.`
        },
        {
          say: r`Pick the final answer.`,
          type: 'mc',
          choices: [r`1880s, is`, r`1880s is`, r`1880s; is`, r`1880s—is`],
          hint: r`Comma opened, comma closes.`,
          after: r`"1880s, is" closes the pair. A dash cannot close something a comma opened, no mark leaves the pair unfinished, and a semicolon would cut the subject off from its verb.`
        }
      ],
      takeaway: r`Nonessential information gets a matching pair: comma and comma, or dash and dash. When a blank sits at the end of extra information, look back to see what opened it.`
    },
    {
      id: 'gw4',
      title: 'Subject and Verb Across a Long Phrase',
      skill: 'Agreement',
      level: 'hard',
      stem: r`<p>The set of instructions that came with the early telescopes sold by the Lindqvist workshop ______ surprisingly hard to follow.</p>` + SE + list([r`were`, r`was`, r`are`, r`have been`]),
      steps: [
        {
          say: r`What changes among the choices?`,
          type: 'mc',
          choices: [r`The form of the verb, singular or plural`, r`The punctuation`, r`The pronoun`],
          hint: r`All four are forms of "to be".`,
          after: r`Verb forms mean you check agreement and tense. Agreement starts with finding the true subject.`
        },
        {
          say: r`Cross out "of instructions" and "that came with the early telescopes sold by the Lindqvist workshop". What one noun is left as the subject?`,
          type: 'text',
          answers: ['set', 'the set'],
          hint: r`Read from the start of the sentence and stop at the first preposition.`,
          after: r`The subject is "set". Instructions, telescopes, and workshop all sit inside phrases, and a noun inside a phrase can't be the subject.`
        },
        {
          say: r`Is "set" singular or plural?`,
          type: 'mc',
          choices: [r`Singular`, r`Plural`],
          hint: r`One set, even if it holds many instructions.`,
          after: r`Singular. That rules out "were", "are", and "have been". The nearby plural nouns are the trap.`
        },
        {
          say: r`Pick the final answer.`,
          type: 'mc',
          choices: [r`was`, r`were`, r`are`, r`have been`],
          hint: r`Read it back: "The set ... ______ surprisingly hard to follow."`,
          after: r`"The set was surprisingly hard to follow." It is singular, and past tense matches "came" and "sold".`
        }
      ],
      takeaway: r`The noun right before the blank is often bait. Cross out phrases and find the true subject before you look at the verb.`
    },
    {
      id: 'gw5',
      title: 'Dangling Modifier',
      skill: 'Modifiers',
      level: 'medium',
      stem: r`<p>Hoping to reduce the noise from nearby traffic, ______</p>` + SE + list([r`tall hedges were planted along the highway by the city planners.`, r`the highway was lined with tall hedges by the city planners.`, r`the city planners lined the highway with tall hedges.`, r`the noise was cut by the hedges that the city planners planted.`]),
      steps: [
        {
          say: r`What changes among the choices?`,
          type: 'mc',
          choices: [r`What comes right after the comma`, r`The punctuation`, r`The tense of the verb`],
          hint: r`Look at the first noun in each choice.`,
          after: r`Each choice opens with a different noun. That points straight to the modifier rule.`
        },
        {
          say: r`Who could be "hoping to reduce the noise"?`,
          type: 'mc',
          choices: [r`The city planners`, r`The hedges`, r`The highway`, r`The noise`],
          hint: r`Only one of these can hope for anything.`,
          after: r`Only people can hope. So "the city planners" must come right after the comma.`
        },
        {
          say: r`Why is "tall hedges were planted ... by the city planners" wrong, even though it mentions the planners?`,
          type: 'mc',
          choices: [r`The noun right after the comma is hedges, so it says the hedges were hoping`, r`It uses the wrong tense`, r`It needs a semicolon`],
          hint: r`Mentioning the right noun later isn't enough.`,
          after: r`The rule is about the very next noun. A correct noun that shows up later in the sentence doesn't fix the modifier.`
        },
        {
          say: r`Pick the final answer.`,
          type: 'mc',
          choices: [r`the city planners lined the highway with tall hedges.`, r`tall hedges were planted along the highway by the city planners.`, r`the highway was lined with tall hedges by the city planners.`, r`the noise was cut by the hedges that the city planners planted.`],
          hint: r`The planners come first.`,
          after: r`The planners were hoping, and the planners come right after the comma. Each other choice says that hedges, a highway, or noise was hoping.`
        }
      ],
      takeaway: r`After an introductory phrase and a comma, ask who did it. That noun has to come next.`
    },
    {
      id: 'gw6',
      title: 'Possessive Plural',
      skill: 'Apostrophes',
      level: 'medium',
      stem: r`<p>Every autumn, all of the valley's beekeepers meet to compare notes. This year, the ______ records showed a sharp drop in honey production.</p>` + SE + list([r`beekeeper's`, r`beekeepers`, r`beekeepers'`, r`beekeepers's`]),
      steps: [
        {
          say: r`What changes among the choices?`,
          type: 'mc',
          choices: [r`Where the apostrophe goes, if there is one`, r`The word itself`, r`The tense`],
          hint: r`It's the same word in each choice.`,
          after: r`Apostrophe placement carries two questions: does it own something, and how many owners are there?`
        },
        {
          say: r`Does the word own the next noun, "records"?`,
          type: 'mc',
          choices: [r`Yes, they are the beekeepers' records`, r`No, it is just a plural noun`],
          hint: r`Whose records?`,
          after: r`The records belong to them, so it needs an apostrophe. "beekeepers" with none is out.`
        },
        {
          say: r`How many owners are there?`,
          type: 'mc',
          choices: [r`More than one`, r`Exactly one`],
          hint: r`Check the first sentence.`,
          after: r`"All of the valley's beekeepers" means many owners. The plural is "beekeepers", and a plural ending in s adds only an apostrophe.`
        },
        {
          say: r`Pick the final answer.`,
          type: 'mc',
          choices: [r`beekeepers'`, r`beekeeper's`, r`beekeepers`, r`beekeepers's`],
          hint: r`Plural first, then the apostrophe.`,
          after: r`"beekeepers'" is plural and possessive. "beekeeper's" means one owner, "beekeepers" shows no ownership, and "beekeepers's" is not a form used for a plural.`
        }
      ],
      takeaway: r`Ask two questions in order. Does it own the next noun? Then how many owners? Write the correct plural, then add the apostrophe.`
    },
    {
      id: 'gw7',
      title: 'Pronoun Agreement With a Company',
      skill: 'Agreement',
      level: 'medium',
      stem: r`<p>Norvane, a small bicycle manufacturer, surprised the industry last year when it moved ______ entire production line to a single solar-powered factory.</p>` + SE + list([r`their`, r`it's`, r`they're`, r`its`]),
      steps: [
        {
          say: r`What changes among the choices?`,
          type: 'mc',
          choices: [r`The pronoun: singular or plural, possessive or contraction`, r`The punctuation between clauses`, r`The verb tense`],
          hint: r`All four are pronoun forms.`,
          after: r`Two questions decide this one: what noun does the pronoun replace, and does it show ownership?`
        },
        {
          say: r`What does the pronoun refer to?`,
          type: 'mc',
          choices: [r`Norvane, the company`, r`The industry`, r`The bicycles`, r`The factory`],
          hint: r`Who owns the production line?`,
          after: r`The production line belongs to Norvane.`
        },
        {
          say: r`Is a company singular or plural?`,
          type: 'mc',
          choices: [r`Singular, so it takes it or its`, r`Plural, so it takes they or their`],
          hint: r`The sentence already calls Norvane "it".`,
          after: r`Companies, schools, and teams take it / its. That rules out "their" and "they're".`
        },
        {
          say: r`Can the word expand to "it is" here: "it is entire production line"?`,
          type: 'mc',
          choices: [r`No, so it has to be the possessive`, r`Yes, so it has to be the contraction`],
          hint: r`Read it aloud with "it is".`,
          after: r`"It is entire production line" makes no sense. The word owns "production line", so there is no apostrophe.`
        },
        {
          say: r`Pick the final answer.`,
          type: 'mc',
          choices: [r`its`, r`their`, r`it's`, r`they're`],
          hint: r`Singular and possessive.`,
          after: r`"its entire production line" is singular and possessive. Pronoun possessives never take an apostrophe.`
        }
      ],
      takeaway: r`Companies are "it". Then run the test: does it own the next noun, or can it expand to "it is"?`
    },
    {
      id: 'gw8',
      title: 'Colon After an Independent Clause',
      skill: 'Colons and Dashes',
      level: 'medium',
      stem: r`<p>When the restorers climbed the scaffold, they faced a single problem ______ decades of candle smoke had darkened the ceiling.</p>` + SE + list([r`problem,`, r`problem`, r`problem:`, r`problem that:`]),
      steps: [
        {
          say: r`What changes among the choices?`,
          type: 'mc',
          choices: [r`The mark after "problem"`, r`The subject of the sentence`, r`The tense of "faced"`],
          hint: r`Look at the end of each choice.`,
          after: r`This is a joining question. Test each side of the blank.`
        },
        {
          say: r`Could "When the restorers climbed the scaffold, they faced a single problem" stand alone?`,
          type: 'mc',
          choices: [r`Yes. It ends in a complete independent clause.`, r`No. "When" makes all of it dependent.`],
          hint: r`"When ... scaffold" is the dependent part. What follows the comma?`,
          after: r`"They faced a single problem" is an IC with an introductory clause in front of it. A colon is allowed here.`
        },
        {
          say: r`What does the part after the blank do?`,
          type: 'mc',
          choices: [r`It explains what the problem was`, r`It adds an unrelated fact`, r`It contrasts with the first clause`],
          hint: r`"A single problem" sets up a question. What was it?`,
          after: r`The first clause sets it up and the second delivers it. That is the colon's job. It is also an IC, so a comma alone would be a splice and no mark would be a run-on.`
        },
        {
          say: r`Which of these uses a colon correctly?`,
          type: 'mc',
          choices: [r`The restorers needed three tools: a brush, a scalpel, and solvent.`, r`The restorers needed: a brush, a scalpel, and solvent.`, r`The tools were: a brush, a scalpel, and solvent.`],
          hint: r`Cover everything after the colon. Is what's left a complete sentence?`,
          after: r`Only the first passes the cover test. "The restorers needed" and "The tools were" can't stand alone. The same test removes "problem that:" from your choices.`
        },
        {
          say: r`Pick the final answer.`,
          type: 'mc',
          choices: [r`problem:`, r`problem,`, r`problem`, r`problem that:`],
          hint: r`IC, colon, explanation.`,
          after: r`"problem:" follows a complete clause and introduces the explanation.`
        }
      ],
      takeaway: r`A colon needs a complete sentence in front of it. Cover what follows the colon. If what's left can't stand alone, the colon is wrong.`
    },
    {
      id: 'gw9',
      title: 'Transition by Relationship',
      skill: 'Transitions',
      level: 'medium',
      stem: r`<p>For decades, researchers assumed that the cave paintings in the valley were made by a single group. ______ new dating methods suggest that the images were added by different groups over thousands of years.</p>` + TR + list([r`Therefore,`, r`Thus,`, r`However,`, r`For example,`]),
      steps: [
        {
          say: r`Cover the choices. In your own words, how does the second sentence relate to the first?`,
          type: 'mc',
          choices: [r`It goes against the old assumption`, r`It is caused by the old assumption`, r`It gives an example of the old assumption`, r`It repeats the old assumption`],
          hint: r`Single group vs different groups.`,
          after: r`The old view said one group. The new evidence says many groups. That is a contrast.`
        },
        {
          say: r`Which family of transitions signals that relationship?`,
          type: 'mc',
          choices: [r`however, nevertheless, in contrast`, r`therefore, thus, consequently`, r`for example, for instance, to illustrate`, r`similarly, likewise, in the same way`],
          hint: r`You need a turn in direction.`,
          after: r`Contrast words signal the turn.`
        },
        {
          say: r`"Therefore" and "Thus" mean about the same thing. What does that tell you?`,
          type: 'mc',
          choices: [r`Both are wrong, since they can't both be the one answer`, r`One of them is correct, so pick the more formal one`, r`Both are correct`],
          hint: r`A question has exactly one right answer.`,
          after: r`Two answers with the same meaning cancel out. It is a quick way to check your thinking, not a replacement for naming the relationship.`
        },
        {
          say: r`Pick the final answer.`,
          type: 'mc',
          choices: [r`However,`, r`Therefore,`, r`Thus,`, r`For example,`],
          hint: r`Contrast.`,
          after: r`"However," signals that the new evidence pushes against the old assumption. The old assumption didn't cause the new finding, and the new finding isn't an example of it.`
        }
      ],
      takeaway: r`Name the relationship before you read the choices. Then the choice is just finding the word in that family.`
    },
    {
      id: 'gw10',
      title: 'Rhetorical Synthesis From Notes',
      skill: 'Synthesis',
      level: 'hard',
      stem: r`<p>While researching a topic, a student has taken the following notes:</p>
<ul>
<li>Researcher Tomas Eklund studied two bumblebee species, A and B, in an alpine meadow.</li>
<li>Species A visited mostly purple flowers.</li>
<li>Species B visited flowers of many colors.</li>
<li>Both species were active from June to September.</li>
<li>Eklund concluded that species A is a flower specialist and species B is a generalist.</li>
</ul>
<p>The student wants to present the study and its conclusion to an audience unfamiliar with Eklund's work.</p>` + SY + list([r`Both bumblebee species in the alpine meadow were active from June to September.`, r`Species A visited mostly purple flowers, whereas species B visited flowers of many colors.`, r`In a study of two bumblebee species in an alpine meadow, researcher Tomas Eklund concluded that one is a flower specialist and the other a generalist.`, r`Eklund concluded that species A is a specialist.`]),
      steps: [
        {
          say: r`Read the goal first. What two things does the sentence have to do?`,
          type: 'mc',
          choices: [r`Present the study and give its conclusion`, r`Compare flower colors and bee sizes`, r`Explain why bees like purple flowers`, r`State when the bees are active`],
          hint: r`The task words are in the last sentence of the notes.`,
          after: r`Study plus conclusion. Hold every choice against those two tasks.`
        },
        {
          say: r`Are the choices true to the notes?`,
          type: 'mc',
          choices: [r`Yes, all four are accurate, so accuracy won't decide this`, r`No, three of them contain false facts`],
          hint: r`Check each against the bullets.`,
          after: r`All four match the notes. This is normal for synthesis. The wrong answers are accurate but off-goal.`
        },
        {
          say: r`What is wrong with "Species A visited mostly purple flowers, whereas species B visited flowers of many colors"?`,
          type: 'mc',
          choices: [r`It gives the observation but not the study or the conclusion`, r`It is ungrammatical`, r`It misstates the notes`],
          hint: r`Does it mention Eklund or the conclusion?`,
          after: r`It is a good contrast sentence, but contrast isn't the goal. It leaves out the researcher, the study, and the conclusion.`
        },
        {
          say: r`The goal says the audience doesn't know Eklund's work. What does that mean for "Eklund concluded that species A is a specialist"?`,
          type: 'mc',
          choices: [r`It fails: it never says who Eklund is, what was studied, or what species A is`, r`It works because it is the shortest`, r`It works because it names the conclusion`],
          hint: r`Would a stranger understand "species A"?`,
          after: r`An unfamiliar reader needs the context. A choice being short only helps when it also does the job.`
        },
        {
          say: r`Pick the final answer.`,
          type: 'mc',
          choices: [r`In a study of two bumblebee species in an alpine meadow, researcher Tomas Eklund concluded that one is a flower specialist and the other a generalist.`, r`Both bumblebee species in the alpine meadow were active from June to September.`, r`Species A visited mostly purple flowers, whereas species B visited flowers of many colors.`, r`Eklund concluded that species A is a specialist.`],
          hint: r`It introduces the researcher, the study, and the conclusion.`,
          after: r`This sentence tells a new reader who did the work, what was studied, and what was concluded. The others each leave out part of the goal.`
        }
      ],
      takeaway: r`Read the goal before the notes. Then ignore whether a choice is true and ask only whether it does the named job.`
    }
  ];

  /* ------------------------------------------------------------------ */
  /* Practice questions: 45, correct choice first                        */
  /* ------------------------------------------------------------------ */
  LWS.grammarQs = [
    /* Sentence Boundaries (9) */
    {
      id: 'g-sb1', topic: 'Sentence Boundaries', level: 'medium', type: 'mc',
      stem: r`<p>The orchard's apples ripened two weeks early this ______ the harvest crew was hired ahead of schedule.</p>` + SE,
      choices: [r`year, so`, r`year, therefore`, r`year therefore`, r`year, thus`],
      explain: r`Both sides are independent clauses. A comma plus a FANBOYS word (so) joins them. "Therefore" and "thus" are transition words, so with only a comma or no mark they create a splice or a run-on.`
    },
    {
      id: 'g-sb2', topic: 'Sentence Boundaries', level: 'medium', type: 'mc',
      stem: r`<p>Ticket sales at the Harlow Theater rose sharply in the ______ attendance at weekday matinees remained low.</p>` + SE,
      choices: [r`spring; however,`, r`spring, however,`, r`spring however,`, r`spring; however`],
      explain: r`Two independent clauses need a semicolon or period, and "however" at the start of the second clause takes a comma after it. A comma before "however" is a splice, no mark is a run-on, and leaving out the comma after "however" fails to set off the transition.`
    },
    {
      id: 'g-sb3', topic: 'Sentence Boundaries', level: 'medium', type: 'mc',
      stem: r`<p>The sculptor Aiko Tanabe worked mostly in bronze during her early ______ she switched to recycled steel, a material she could source from nearby shipyards.</p>` + SE,
      choices: [r`career. Later,`, r`career, later,`, r`career, later`, r`career later,`],
      explain: r`"Later, she switched to recycled steel" is a complete sentence, and so is the part before it, so they must be separated by a period. A comma alone is a splice, and no mark is a run-on.`
    },
    {
      id: 'g-sb4', topic: 'Sentence Boundaries', level: 'medium', type: 'mc',
      stem: r`<p>Because honeybees communicate the location of food through ______ researchers often film hives to study how foraging information spreads.</p>` + SE,
      choices: [r`movement,`, r`movement.`, r`movement;`, r`movement, and`],
      explain: r`"Because" makes the first part a dependent clause, so it attaches to the main clause with a comma. A period or semicolon would leave the first part as a fragment. Adding "and" also leaves the "because" clause with no main clause of its own to attach to.`
    },
    {
      id: 'g-sb5', topic: 'Sentence Boundaries', level: 'medium', type: 'mc',
      stem: r`<p>The Ardent Glacier Project, which has collected ice samples from the northern range since 2004, ______ evidence that summer melt has accelerated.</p>` + SE,
      choices: [r`has produced`, r`producing`, r`having produced`, r`to produce`],
      explain: r`Cross out the "which" clause between the commas and you have "The Ardent Glacier Project ______ evidence." The sentence needs a main verb, and only "has produced" is one. The other three leave a fragment.`
    },
    {
      id: 'g-sb6', topic: 'Sentence Boundaries', level: 'hard', type: 'mc',
      stem: r`<p>Most volunteers in the first group finished the survey within ten ______ needed nearly twice as long.</p>` + SE,
      choices: [r`minutes; the second group, however,`, r`minutes, the second group, however,`, r`minutes; the second group however,`, r`minutes, the second group however;`],
      explain: r`The two clauses need a semicolon between them, and "however" sits inside the second clause, so it takes commas on both sides. A comma at the boundary is a splice. A missing comma before "however" leaves the transition half set off, and a semicolon after "however" cuts "the second group" off from its verb.`
    },
    {
      id: 'g-sb7', topic: 'Sentence Boundaries', level: 'hard', type: 'mc',
      stem: r`<p>The archive holds more than nine hundred letters written by the ______ describe the weather, the food, and the slow pace of river travel.</p>` + SE,
      choices: [r`explorer, many of which`, r`explorer, many of them`, r`explorer; many of which`, r`explorer many of them`],
      explain: r`"Many of which describe..." is a dependent clause, so a comma attaches it to the main clause. "Many of them describe..." is an independent clause, so a comma makes a splice and no mark makes a run-on. A semicolon can't go in front of the dependent "many of which" clause.`
    },
    {
      id: 'g-sb8', topic: 'Sentence Boundaries', level: 'medium', type: 'mc',
      stem: r`<p>Some desert plants store water in thick ______ send long roots deep underground.</p>` + SE,
      choices: [r`stems; others`, r`stems, others`, r`stems others`, r`stems, however, others`],
      explain: r`Both sides are independent clauses, and a semicolon joins them. A comma alone is a splice, no mark is a run-on, and "however" between two commas is still a splice.`
    },
    {
      id: 'g-sb9', topic: 'Sentence Boundaries', level: 'hard', type: 'mc',
      stem: r`<p>One astronomer's theory that the comet's orbit had shifted after a close pass by Jupiter ______ by later observations.</p>` + SE,
      choices: [r`was confirmed`, r`being confirmed`, r`which was confirmed`, r`having been confirmed`],
      explain: r`The subject is "theory", and the "that" clause only tells which theory. "Had shifted" belongs to that clause, so the sentence still needs a main verb. Only "was confirmed" supplies one. The other choices leave a fragment.`
    },

    /* Commas and Nonessentials (7) */
    {
      id: 'g-cn1', topic: 'Commas and Nonessentials', level: 'medium', type: 'mc',
      stem: r`<p>______ is the deepest lake in the world.</p>` + SE,
      choices: [r`Lake Baikal, which lies in southern Siberia,`, r`Lake Baikal which lies in southern Siberia,`, r`Lake Baikal, which lies in southern Siberia`, r`Lake Baikal, that lies in southern Siberia,`],
      explain: r`The location is extra information, since the name already identifies the lake. It needs a matching pair of commas. Missing either comma breaks the pair, and "that" can't introduce nonessential information.`
    },
    {
      id: 'g-cn2', topic: 'Commas and Nonessentials', level: 'medium', type: 'mc',
      stem: r`<p>The exhibit traces the career of ______ whose photographs of city streets drew little notice during her lifetime.</p>` + SE,
      choices: [r`photographer Mara Voss,`, r`photographer, Mara Voss,`, r`photographer, Mara Voss`, r`photographer Mara Voss`],
      explain: r`A title directly before a name takes no comma. The "whose" clause is extra information about a named person, so a comma goes after the name.`
    },
    {
      id: 'g-cn3', topic: 'Commas and Nonessentials', level: 'medium', type: 'mc',
      stem: r`<p>The team split its seedlings into two groups and gave one group extra light. Only the ______ grew tall enough to transplant.</p>` + SE,
      choices: [r`seedlings that received extra light`, r`seedlings, that received extra light,`, r`seedlings, that received extra light`, r`seedlings that received extra light,`],
      explain: r`The "that" clause tells you which seedlings, so it is essential and takes no commas. "That" never follows a comma this way, and a comma after "light" would separate the subject from its verb.`
    },
    {
      id: 'g-cn4', topic: 'Commas and Nonessentials', level: 'medium', type: 'mc',
      stem: r`<p>The results of the three-year ______ that urban foxes range over smaller territories than rural foxes do.</p>` + SE,
      choices: [r`survey showed`, r`survey, showed`, r`survey showed,`, r`survey, showed,`],
      explain: r`The subject is "results" and the verb is "showed", and no comma goes between them. No comma goes between a verb and its "that" clause either.`
    },
    {
      id: 'g-cn5', topic: 'Commas and Nonessentials', level: 'medium', type: 'mc',
      stem: r`<p>The garden includes several native trees, ______ all of which grow well in poor soil.</p>` + SE,
      choices: [r`such as oak, hickory, and maple,`, r`such as, oak, hickory, and maple,`, r`such as oak, hickory, and maple`, r`such as: oak, hickory, and maple,`],
      explain: r`"Such as" runs straight into its list with no mark. A comma or colon there separates it from its objects. A comma is also needed after "maple" to set off "all of which grow well in poor soil."`
    },
    {
      id: 'g-cn6', topic: 'Commas and Nonessentials', level: 'hard', type: 'mc',
      stem: r`<p>Novelist Priya Anand's best-known ______ has been translated into nine languages.</p>` + SE,
      choices: [r`book, <i>The Salt Road</i>,`, r`book, <i>The Salt Road</i>`, r`book <i>The Salt Road</i>,`, r`book: <i>The Salt Road</i>,`],
      explain: r`A novelist has only one best-known book, so the title is extra information and takes a matching pair of commas. One comma breaks the pair, and a colon can't go here because what comes before it isn't a complete sentence.`
    },
    {
      id: 'g-cn7', topic: 'Commas and Nonessentials', level: 'medium', type: 'mc',
      stem: r`<p>A music festival held each spring in ______ attracts visitors from across the region.</p>` + SE,
      choices: [r`Austin, Texas,`, r`Austin, Texas`, r`Austin Texas,`, r`Austin, Texas;`],
      explain: r`In the middle of a sentence, a state after a city is set off with commas on both sides. A semicolon can't go here because it would split the subject from the verb.`
    },

    /* Colons and Dashes (4) */
    {
      id: 'g-cd1', topic: 'Colons and Dashes', level: 'medium', type: 'mc',
      stem: r`<p>The survival kit held three essential ______ a compass, a water filter, and a flare.</p>` + SE,
      choices: [r`tools:`, r`tools;`, r`tools that`, r`tools which`],
      explain: r`The first part is a complete sentence and the list explains "three essential tools," so a colon fits. A semicolon needs a complete sentence on both sides, and the list isn't one. "That" and "which" leave the sentence broken.`
    },
    {
      id: 'g-cd2', topic: 'Colons and Dashes', level: 'medium', type: 'mc',
      stem: r`<p>The survey asked residents ______ parks, buses, and street lighting.</p>` + SE,
      choices: [r`about`, r`about:`, r`about;`, r`about—`],
      explain: r`"The survey asked residents about" is not a complete sentence, so no colon or semicolon can follow it. A preposition runs straight into its objects, with no mark between them.`
    },
    {
      id: 'g-cd3', topic: 'Colons and Dashes', level: 'hard', type: 'mc',
      stem: r`<p>Gregor Mendel—a monk who bred thousands of pea ______ often called the father of modern genetics.</p>` + SE,
      choices: [r`plants—is`, r`plants, is`, r`plants; is`, r`plants is`],
      explain: r`The dash after "Mendel" opens the extra information, so a dash must close it. A comma doesn't match, a semicolon cuts the subject off from "is", and no mark leaves the pair unfinished.`
    },
    {
      id: 'g-cd4', topic: 'Colons and Dashes', level: 'hard', type: 'mc',
      stem: r`<p>The tour stopped in four cities: Lisbon, ______ Accra, Ghana; Lima, Peru; and Hanoi, Vietnam.</p>` + SE,
      choices: [r`Portugal;`, r`Portugal,`, r`Portugal:`, r`Portugal—`],
      explain: r`The list items already contain commas, so semicolons separate them, as they do between the later items. A comma would blur which city goes with which country. A second colon or a dash breaks the pattern.`
    },

    /* Apostrophes (4) */
    {
      id: 'g-ap1', topic: 'Apostrophes', level: 'medium', type: 'mc',
      stem: r`<p>Field notes from the reserve follow a family of twelve otters through the winter. They record how the twelve ______ feeding habits changed when the river froze.</p>` + SE,
      choices: [r`otters'`, r`otter's`, r`otters`, r`otters's`],
      explain: r`The habits belong to the otters, and there are twelve of them. A plural ending in s adds only an apostrophe. "Otter's" means one owner, "otters" shows no ownership, and "otters's" is not a plural possessive form.`
    },
    {
      id: 'g-ap2', topic: 'Apostrophes', level: 'medium', type: 'mc',
      stem: r`<p>Lichen is easy to overlook on a mountain hike, but ______ role in slowly breaking down rock is considerable.</p>` + SE,
      choices: [r`its`, r`it's`, r`its'`, r`their`],
      explain: r`The word owns "role" and refers to lichen, which is singular here. Pronoun possessives have no apostrophe. "It's" means "it is," "its'" isn't a word, and "their" is plural.`
    },
    {
      id: 'g-ap3', topic: 'Apostrophes', level: 'hard', type: 'mc',
      stem: r`<p>After a flood damaged the town archive, the ______ rare manuscripts.</p>` + SE,
      choices: [r`librarians worked for months to save the library's`, r`librarian's worked for months to save the library's`, r`librarians' worked for months to save the library's`, r`librarians worked for months to save the librarys`],
      explain: r`"Librarians" is the plain plural subject of "worked," so it takes no apostrophe. The manuscripts belong to the library, so "library's" needs one. Test each word: does it own the next noun?`
    },
    {
      id: 'g-ap4', topic: 'Apostrophes', level: 'medium', type: 'mc',
      stem: r`<p>The poet, ______ early work was published under a false name, later became one of the best-known writers in the region.</p>` + SE,
      choices: [r`whose`, r`who's`, r`whos`, r`whose'`],
      explain: r`The word owns "early work." "Whose" is the possessive and has no apostrophe. "Who's" means "who is," and "who is early work" makes no sense.`
    },

    /* Agreement (7) */
    {
      id: 'g-ag1', topic: 'Agreement', level: 'hard', type: 'mc',
      stem: r`<p>The lead author of the study, along with two colleagues at a university in Norway, ______ that the findings apply only to cold-water species.</p>` + SE,
      choices: [r`argues`, r`argue`, r`are arguing`, r`have argued`],
      explain: r`Cross out "along with two colleagues at a university in Norway," since it is nonessential. The subject is "author," which is singular, and the other three verbs are plural.`
    },
    {
      id: 'g-ag2', topic: 'Agreement', level: 'medium', type: 'mc',
      stem: r`<p>When the alarm sounded, neither the lead engineer nor the two technicians ______ aware of the fault.</p>` + SE,
      choices: [r`were`, r`was`, r`is`, r`has been`],
      explain: r`With "neither...nor," the verb matches the closer subject, "technicians," which is plural. Past tense also matches "sounded." The other three verbs are singular.`
    },
    {
      id: 'g-ag3', topic: 'Agreement', level: 'hard', type: 'mc',
      stem: r`<p>Beneath the floor of the old chapel ______ two stone coffins and a bronze lamp.</p>` + SE,
      choices: [r`lie`, r`lies`, r`is lying`, r`has lain`],
      explain: r`This sentence is inverted, so the subject comes after the verb. The subject is "two stone coffins and a bronze lamp," and "and" makes it plural. Don't match the verb to "chapel" or "floor." The other three verbs are singular.`
    },
    {
      id: 'g-ag4', topic: 'Agreement', level: 'medium', type: 'mc',
      stem: r`<p>Each of the eleven paintings in the series ______ a different hour of the same afternoon.</p>` + SE,
      choices: [r`depicts`, r`depict`, r`are depicting`, r`have depicted`],
      explain: r`The subject is "each," which is always singular. "Of the eleven paintings" is a prepositional phrase, so cross it out. The other three verbs are plural.`
    },
    {
      id: 'g-ag5', topic: 'Agreement', level: 'hard', type: 'mc',
      stem: r`<p>Collecting soil samples from all twelve sites ______ a full week of careful work each season.</p>` + SE,
      choices: [r`requires`, r`require`, r`have required`, r`are requiring`],
      explain: r`The subject is the gerund "collecting," and gerund subjects are singular. "Samples" and "sites" are the plural bait. The other three verbs are plural.`
    },
    {
      id: 'g-ag6', topic: 'Agreement', level: 'medium', type: 'mc',
      stem: r`<p>The number of visitors to the national park ______ risen each year since the new trail opened.</p>` + SE,
      choices: [r`has`, r`have`, r`are`, r`were`],
      explain: r`"The number of" is singular, while "a number of" would be plural. "Has risen" also fits "since," which calls for the present perfect. The other three verbs are plural.`
    },
    {
      id: 'g-ag7', topic: 'Agreement', level: 'medium', type: 'mc',
      stem: r`<p>A bat's wings look delicate, but ______ are remarkably strong.</p>` + SE,
      choices: [r`they`, r`it`, r`its`, r`their`],
      explain: r`The pronoun replaces "wings," which is plural, and it is the subject of "are." "It" is singular and refers to the wrong noun. "Its" and "their" are possessive, so neither can be a subject.`
    },

    /* Tense and Form (3) */
    {
      id: 'g-tf1', topic: 'Tense and Form', level: 'medium', type: 'mc',
      stem: r`<p>By the time the relief ship reached the harbor, the stranded crew ______ most of its food supply.</p>` + SE,
      choices: [r`had exhausted`, r`has exhausted`, r`exhausts`, r`will exhaust`],
      explain: r`Using up the food happened before another past event, the ship's arrival. That timeline calls for the past perfect, "had" plus the past participle.`
    },
    {
      id: 'g-tf2', topic: 'Tense and Form', level: 'medium', type: 'mc',
      stem: r`<p>Since the 1990s, the cost of solar panels ______ dramatically.</p>` + SE,
      choices: [r`has fallen`, r`has fell`, r`fell`, r`will fall`],
      explain: r`"Since the 1990s" describes something that began in the past and continues now, so you need the present perfect. The past participle of "fall" is "fallen," not "fell." Simple past and future don't fit "since."`
    },
    {
      id: 'g-tf3', topic: 'Tense and Form', level: 'medium', type: 'mc',
      stem: r`<p>The painter Helene Marsh moved to the coast in 1931. There, she rented a small studio and ______ a series of seascapes that later made her name.</p>` + SE,
      choices: [r`painted`, r`paints`, r`will paint`, r`has painted`],
      explain: r`The passage stays in the simple past ("moved," "rented," "made"), and nothing changes the timeline. "Painted" keeps the tense consistent and parallel with "rented."`
    },

    /* Modifiers (4) */
    {
      id: 'g-mo1', topic: 'Modifiers', level: 'hard', type: 'mc',
      stem: r`<p>Trained as a chemist in her native Chile, ______</p>` + SE,
      choices: [r`Elena Ruiz later applied her knowledge of pigments to the restoration of paintings.`, r`Elena Ruiz's knowledge of pigments later proved useful in the restoration of paintings.`, r`the restoration of paintings later benefited from Elena Ruiz's knowledge of pigments.`, r`the knowledge of pigments that Elena Ruiz had was later applied to the restoration of paintings.`],
      explain: r`The person was trained as a chemist, so her name must come right after the comma, as the subject. "Elena Ruiz's knowledge" is the trap: its main noun is "knowledge," and knowledge wasn't trained as a chemist.`
    },
    {
      id: 'g-mo2', topic: 'Modifiers', level: 'medium', type: 'mc',
      stem: r`<p>Measuring more than thirty feet from head to tail, ______</p>` + SE,
      choices: [r`the fossil skeleton filled the museum's largest hall.`, r`the museum's largest hall was filled by the fossil skeleton.`, r`visitors to the museum saw the fossil skeleton in its largest hall.`, r`the museum placed the fossil skeleton in its largest hall.`],
      explain: r`The thing with a head and a tail is the skeleton, so it must come right after the comma. A hall, visitors, and a museum don't measure thirty feet from head to tail.`
    },
    {
      id: 'g-mo3', topic: 'Modifiers', level: 'medium', type: 'mc',
      stem: r`<p>A largely self-taught mathematician, ______</p>` + SE,
      choices: [r`Srinivasa Ramanujan recorded thousands of results in his notebooks.`, r`thousands of results were recorded by Srinivasa Ramanujan in his notebooks.`, r`the notebooks of Srinivasa Ramanujan contain thousands of results.`, r`Srinivasa Ramanujan's notebooks contain thousands of results.`],
      explain: r`The opening phrase renames a person, so that person has to be the subject right after the comma. Results and notebooks aren't mathematicians. "Srinivasa Ramanujan's notebooks" looks close, but its main noun is "notebooks."`
    },
    {
      id: 'g-mo4', topic: 'Modifiers', level: 'hard', type: 'mc',
      stem: r`<p>To reduce evaporation from a desert reservoir, ______</p>` + SE,
      choices: [r`engineers covered its surface with floating plastic balls.`, r`its surface was covered with floating plastic balls by engineers.`, r`floating plastic balls were spread across its surface by engineers.`, r`the reservoir's surface received a layer of floating plastic balls from engineers.`],
      explain: r`Ask who is trying to reduce evaporation: the engineers. The doer must come right after the comma. In the other choices, the main noun after the comma is a surface or plastic balls, neither of which is trying to do anything.`
    },

    /* Parallel and Comparison (3) */
    {
      id: 'g-pc1', topic: 'Parallel and Comparison', level: 'medium', type: 'mc',
      stem: r`<p>The program trains young researchers to collect water samples, ______ and to present their findings to the public.</p>` + SE,
      choices: [r`to record the data,`, r`recording the data,`, r`they record the data,`, r`the recording of the data,`],
      explain: r`The list items all take the "to" form: "to collect," "to record," "to present." The other choices break the pattern.`
    },
    {
      id: 'g-pc2', topic: 'Parallel and Comparison', level: 'hard', type: 'mc',
      stem: r`<p>The wingspan of the wandering albatross is wider than ______</p>` + SE,
      choices: [r`that of any other living bird.`, r`any other living bird.`, r`those of any other living bird.`, r`the other living birds.`],
      explain: r`Compare like things: a wingspan to a wingspan. "That of" stands in for "the wingspan of." Two choices compare a wingspan to a bird. "Those" is plural, but "wingspan" is singular.`
    },
    {
      id: 'g-pc3', topic: 'Parallel and Comparison', level: 'medium', type: 'mc',
      stem: r`<p>The new storage method is not only cheaper than the old one ______ easier to use.</p>` + SE,
      choices: [r`but also`, r`and also`, r`but it is also`, r`and it is`],
      explain: r`The correlative pair is "not only...but also," and both sides must match. "Cheaper" and "easier" are parallel only with "but also" directly in front of "easier." "And" doesn't complete the pair, and "it is" breaks the parallel form.`
    },

    /* Transitions (3) */
    {
      id: 'g-tr1', topic: 'Transitions', level: 'medium', type: 'mc',
      stem: r`<p>The new bridge reduced the drive between the two towns from an hour to fifteen minutes. ______ many residents of the smaller town began commuting to jobs across the river.</p>` + TR,
      choices: [r`As a result,`, r`In contrast,`, r`For instance,`, r`Nevertheless,`],
      explain: r`The shorter drive caused the commuting, so this is cause and effect. Nothing here contrasts, and commuting isn't an example of a shorter drive.`
    },
    {
      id: 'g-tr2', topic: 'Transitions', level: 'medium', type: 'mc',
      stem: r`<p>Many plants defend themselves with chemicals rather than thorns. ______ milkweed produces a bitter, toxic sap that discourages most insects from feeding on it.</p>` + TR,
      choices: [r`For example,`, r`However,`, r`Regardless,`, r`Finally,`],
      explain: r`The first sentence makes a general claim, and milkweed is one specific case of it. That relationship is an example, not a contrast or a step in a sequence.`
    },
    {
      id: 'g-tr3', topic: 'Transitions', level: 'hard', type: 'mc',
      stem: r`<p>The new seed variety requires more water than the older one does. ______ it yields so much more grain that most farmers consider the extra irrigation worthwhile.</p>` + TR,
      choices: [r`Even so,`, r`Therefore,`, r`Similarly,`, r`In other words,`],
      explain: r`The first sentence gives a drawback, and the second says farmers accept it anyway. That is concession. Needing more water doesn't cause higher yields, the two ideas aren't alike, and the second sentence doesn't restate the first.`
    },

    /* Synthesis (1) */
    {
      id: 'g-sy1', topic: 'Synthesis', level: 'hard', type: 'mc',
      stem: r`<p>While researching a topic, a student has taken the following notes:</p>
<ul>
<li>The Marlow Dam and the Teller Dam were both completed in the 1960s.</li>
<li>The Marlow Dam is 180 feet tall.</li>
<li>It holds drinking water for a nearby city.</li>
<li>The Teller Dam is 95 feet tall.</li>
<li>It was built mainly to generate electricity.</li>
</ul>
<p>The student wants to emphasize a difference in the purposes of the two dams.</p>` + SY,
      choices: [r`The Marlow Dam holds drinking water for a nearby city, whereas the Teller Dam was built mainly to generate electricity.`, r`At 180 feet, the Marlow Dam is much taller than the Teller Dam, which stands 95 feet tall.`, r`The Marlow Dam and the Teller Dam, both completed in the 1960s, stand 180 feet and 95 feet tall.`, r`Standing 95 feet tall, the Teller Dam was built mainly to generate electricity.`],
      explain: r`The goal names a difference in purpose, so the answer must give both purposes. The height choice shows a real difference but the wrong one, the 1960s choice gives no purpose at all, and the last choice mentions only one dam.`
    }
  ];
})();
