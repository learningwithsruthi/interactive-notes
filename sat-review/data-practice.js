window.LWS = window.LWS || {};
(function () {
  const r = String.raw;
  const LWS = window.LWS;

  // Box plot SVG built from a five-number summary. lo and hi set the axis ends.
  function box(min, q1, med, q3, max, lo, hi) {
    const X = function (v) { return Math.round(20 + (v - lo) / (hi - lo) * 360); };
    const lab = function (v) {
      return '<line x1="' + X(v) + '" y1="66" x2="' + X(v) + '" y2="76" stroke="currentColor"/>' +
        '<text x="' + X(v) + '" y="94" font-size="14" fill="currentColor" text-anchor="middle">' + v + '</text>';
    };
    return '<svg viewBox="0 0 400 104" role="img" aria-label="Box plot">' +
      '<line x1="20" y1="71" x2="380" y2="71" stroke="currentColor"/>' +
      '<line x1="' + X(min) + '" y1="35" x2="' + X(q1) + '" y2="35" stroke="currentColor" stroke-width="2"/>' +
      '<line x1="' + X(q3) + '" y1="35" x2="' + X(max) + '" y2="35" stroke="currentColor" stroke-width="2"/>' +
      '<line x1="' + X(min) + '" y1="25" x2="' + X(min) + '" y2="45" stroke="currentColor" stroke-width="2"/>' +
      '<line x1="' + X(max) + '" y1="25" x2="' + X(max) + '" y2="45" stroke="currentColor" stroke-width="2"/>' +
      '<rect x="' + X(q1) + '" y="15" width="' + (X(q3) - X(q1)) + '" height="40" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<line x1="' + X(med) + '" y1="15" x2="' + X(med) + '" y2="55" style="stroke:var(--accent)" stroke-width="3"/>' +
      lab(min) + lab(q1) + lab(med) + lab(q3) + lab(max) + '</svg>';
  }

  const svgTangent = r`<svg viewBox="0 0 340 250" role="img" aria-label="Circle with a radius to point P and the tangent line at P">
<circle cx="130" cy="130" r="100" fill="none" stroke="currentColor" stroke-width="2"/>
<circle cx="130" cy="130" r="3" fill="currentColor"/><circle cx="210" cy="70" r="3" fill="currentColor"/>
<line x1="130" y1="130" x2="210" y2="70" stroke="currentColor"/>
<line x1="165" y1="10" x2="255" y2="130" style="stroke:var(--accent)" stroke-width="2"/>
<text x="92" y="152" font-size="14" fill="currentColor">C(3, -1)</text>
<text x="220" y="66" font-size="14" fill="currentColor">P(7, 2)</text>
<text x="262" y="134" font-size="14" fill="currentColor">tangent</text>
</svg>`;

  const svgChord = r`<svg viewBox="0 0 300 220" role="img" aria-label="Circle with center O, radii OA and OB, chord AB, and segment OM from the center to the midpoint of the chord">
<circle cx="150" cy="110" r="90" fill="none" stroke="currentColor" stroke-width="2"/>
<line x1="150" y1="110" x2="72" y2="155" stroke="currentColor"/>
<line x1="150" y1="110" x2="228" y2="155" stroke="currentColor"/>
<line x1="72" y1="155" x2="228" y2="155" style="stroke:var(--accent)" stroke-width="2"/>
<line x1="150" y1="110" x2="150" y2="155" stroke="currentColor" stroke-dasharray="4 3"/>
<text x="150" y="100" font-size="14" fill="currentColor" text-anchor="middle">O</text>
<text x="50" y="160" font-size="14" fill="currentColor">A</text>
<text x="240" y="160" font-size="14" fill="currentColor">B</text>
<text x="150" y="174" font-size="14" fill="currentColor" text-anchor="middle">M</text>
<text x="198" y="122" font-size="14" fill="currentColor">12</text>
</svg>`;

  const svgParallel = r`<svg viewBox="0 -10 320 240" role="img" aria-label="Triangle ABC with segment DE parallel to BC">
<polygon points="160,20 40,200 280,200" fill="none" stroke="currentColor" stroke-width="2"/>
<line x1="112" y1="92" x2="208" y2="92" style="stroke:var(--accent)" stroke-width="2"/>
<text x="160" y="12" font-size="14" fill="currentColor" text-anchor="middle">A</text>
<text x="96" y="97" font-size="14" fill="currentColor">D</text>
<text x="214" y="97" font-size="14" fill="currentColor">E</text>
<text x="24" y="216" font-size="14" fill="currentColor">B</text>
<text x="284" y="216" font-size="14" fill="currentColor">C</text>
<text x="122" y="58" font-size="14" fill="currentColor">6</text>
<text x="60" y="150" font-size="14" fill="currentColor">9</text>
<text x="160" y="86" font-size="14" fill="currentColor" text-anchor="middle">8</text>
</svg>`;

  const svgRight = r`<svg viewBox="0 0 320 210" role="img" aria-label="Right triangle ABC with the right angle at C and hypotenuse AB of length 39">
<polygon points="40,180 280,180 40,80" fill="none" stroke="currentColor" stroke-width="2"/>
<polyline points="40,166 54,166 54,180" fill="none" stroke="currentColor"/>
<text x="24" y="198" font-size="14" fill="currentColor">C</text>
<text x="286" y="198" font-size="14" fill="currentColor">A</text>
<text x="26" y="76" font-size="14" fill="currentColor">B</text>
<text x="170" y="118" font-size="14" fill="currentColor">39</text>
</svg>`;

  LWS.challenge = [
    {
      id: 'ineq-compound-flip', title: 'Compound Inequality With a Flip', skill: 'Linear inequalities', level: 'hard',
      stem: r`How many integers $x$ satisfy $-5 \lt 7-3x \le 16$?`,
      steps: [
        { say: r`Isolate the $x$ term first. Subtract 7 from all three parts. What does the left part become?`, type: 'num', answer: '-12', hint: r`Compute $-5-7$.`, after: r`Now you have $-12 \lt -3x \le 9$.` },
        { say: r`Next you divide all three parts by $-3$. In one word, what must happen to both inequality signs?`, type: 'text', answers: ['flip', 'flips', 'reverse', 'reverses', 'switch', 'switches'], hint: r`Think about what dividing by a negative number does to an inequality.`, after: r`Both signs reverse: $4 \gt x \ge -3$.` },
        { say: r`What is the smallest integer allowed?`, type: 'num', answer: '-3', hint: r`The part $x \ge -3$ includes its endpoint.`, after: r`$x=-3$ works because that end uses $\ge$.` },
        { say: r`What is the largest integer allowed?`, type: 'num', answer: '3', hint: r`The part $x \lt 4$ does not include 4.`, after: r`4 is left out because that end is strict, so the largest integer is 3.` },
        { say: r`How many integers is that in total?`, type: 'num', answer: '7', hint: r`Count from $-3$ to 3 and include zero.`, after: r`$3-(-3)+1=7$. The integers are $-3,-2,-1,0,1,2,3$.` }
      ],
      takeaway: r`Dividing by a negative flips every sign in the chain, and an inclusive count is high minus low plus one.`
    },
    {
      id: 'ineq-parameter-sign', title: 'Solve for the Hidden Coefficient', skill: 'Inequalities with a constant', level: 'hard',
      stem: r`The solution set of $ax+6 \gt 2a$, where $a$ is a nonzero constant, is $x \lt 4$. What is the value of $a$?`,
      steps: [
        { say: r`Subtract 6 from both sides. Which form do you get?`, type: 'mc', choices: [r`$ax \gt 2a-6$`, r`$ax \gt 2a+6$`, r`$ax \lt 2a-6$`, r`$x \gt 2a-6$`], hint: r`Subtracting a number does not change the direction of the sign.`, after: r`$ax \gt 2a-6$. The next move is to divide by $a$.` },
        { say: r`The sign started as $\gt$ and the answer uses $\lt$. What does that tell you about $a$?`, type: 'mc', choices: [r`$a$ is negative`, r`$a$ is positive`, r`$a$ equals 4`, r`It tells you nothing about $a$`], hint: r`Only one kind of division reverses an inequality.`, after: r`The direction changed when you divided by $a$, so $a \lt 0$.` },
        { say: r`The boundary must match, so $\frac{2a-6}{a}=4$. Multiply both sides by $a$ to get $2a-6=ka$. What is the value of $k$?`, type: 'num', prefix: r`$k=$`, answer: '4', hint: r`Multiplying the right side, 4, by $a$ gives $4a$.`, after: r`$2a-6=4a$.` },
        { say: r`Solve for $a$.`, type: 'num', prefix: r`$a=$`, answer: '-3', hint: r`Subtract $2a$ from both sides, then divide by 2.`, after: r`$-6=2a$, so $a=-3$. It is negative, which agrees with the flip. Check: $-3x+6 \gt -6$ gives $x \lt 4$.` }
      ],
      takeaway: r`When an unknown coefficient appears, a reversed sign tells you it is negative, and the boundary gives its value.`
    },
    {
      id: 'expr-excluded-values', title: 'What Cancelling Hides', skill: 'Excluded values', level: 'hard',
      stem: r`Consider $f(x)=\dfrac{x^2-9}{x^2+x-6}$.`,
      steps: [
        { say: r`Factor the denominator. Which is right?`, type: 'mc', choices: [r`$(x+3)(x-2)$`, r`$(x-3)(x+2)$`, r`$(x+6)(x-1)$`, r`$(x-6)(x+1)$`], hint: r`You need two numbers with product $-6$ and sum $1$.`, after: r`$x^2+x-6=(x+3)(x-2)$.` },
        { say: r`Factor the numerator too and cancel. Which simplified form do you get?`, type: 'mc', choices: [r`$\dfrac{x-3}{x-2}$`, r`$\dfrac{x+3}{x-2}$`, r`$\dfrac{x-3}{x+2}$`, r`$\dfrac{3}{2}$`], hint: r`$x^2-9$ is a difference of squares.`, after: r`$\dfrac{(x-3)(x+3)}{(x+3)(x-2)}=\dfrac{x-3}{x-2}$ wherever the original is defined.` },
        { say: r`Excluded values come from the original denominator, before cancelling. What is the smaller excluded value?`, type: 'num', answer: '-3', hint: r`Set each factor of the original denominator equal to zero.`, after: r`$x+3=0$ gives $x=-3$. The factor cancelled, but the original still divides by zero there.` },
        { say: r`What is the other excluded value?`, type: 'num', answer: '2', hint: r`Use the factor that survived.`, after: r`$x-2=0$ gives $x=2$.` },
        { say: r`Find $f(4)$.`, type: 'num', answer: '1/2', hint: r`4 is not excluded, so you can use the simplified form.`, after: r`$\dfrac{4-3}{4-2}=\dfrac{1}{2}$.` }
      ],
      takeaway: r`Find excluded values before you cancel. A cancelled factor still counts.`
    },
    {
      id: 'expr-compound-fraction', title: 'Clear a Compound Fraction', skill: 'Compound fractions', level: 'hard',
      stem: r`For the values of $x$ where it is defined, $\dfrac{1+\frac{2}{x}}{1-\frac{4}{x^2}}=3$. What is the value of $x$?`,
      steps: [
        { say: r`To clear every small fraction at once, what should you multiply the top and bottom by?`, type: 'mc', choices: [r`$x^2$`, r`$x$`, r`$2x$`, r`$4x^2$`], hint: r`Use the smallest expression that both $x$ and $x^2$ divide into.`, after: r`The least common denominator of the small fractions is $x^2$.` },
        { say: r`After multiplying, which fraction do you have?`, type: 'mc', choices: [r`$\dfrac{x^2+2x}{x^2-4}$`, r`$\dfrac{x^2+2}{x^2-4}$`, r`$\dfrac{x+2}{x^2-4}$`, r`$\dfrac{x^2+2x}{x^2-4x}$`], hint: r`Multiply each term by $x^2$, including the 1s.`, after: r`$x^2\cdot 1=x^2$, $x^2\cdot\frac{2}{x}=2x$, and $x^2\cdot\frac{4}{x^2}=4$.` },
        { say: r`Factor before you cancel. What does the fraction simplify to?`, type: 'mc', choices: [r`$\dfrac{x}{x-2}$`, r`$\dfrac{x}{x+2}$`, r`$\dfrac{2x}{-4}$`, r`$\dfrac{x+2}{x-2}$`], hint: r`The top is $x(x+2)$ and the bottom is a difference of squares.`, after: r`$\dfrac{x(x+2)}{(x-2)(x+2)}=\dfrac{x}{x-2}$.` },
        { say: r`Set the simplified form equal to 3 and solve.`, type: 'num', prefix: r`$x=$`, answer: '3', hint: r`Cross multiply: $x=3(x-2)$.`, after: r`$x=3x-6$, so $x=3$. It is not an excluded value ($0$, $2$, $-2$). Check: $\frac{5/3}{5/9}=3$.` }
      ],
      takeaway: r`Multiply the top and bottom by the common denominator of the small fractions, then factor before cancelling.`
    },
    {
      id: 'expr-extraneous-root', title: 'The Root That Does Not Count', skill: 'Rational equations', level: 'hard',
      stem: r`What is the solution to $\dfrac{x}{x-3}+\dfrac{2}{x}=\dfrac{3}{x-3}$?`,
      steps: [
        { say: r`Before doing anything else, which values can $x$ never be?`, type: 'mc', choices: [r`$0$ and $3$`, r`$3$ only`, r`$0$ only`, r`$-3$ and $0$`], hint: r`Look at every denominator.`, after: r`The denominators $x-3$ and $x$ rule out $x=3$ and $x=0$.` },
        { say: r`Multiply every term by $x(x-3)$. Which equation results?`, type: 'mc', choices: [r`$x^2+2(x-3)=3x$`, r`$x+2=3$`, r`$x^2+2=3x$`, r`$x^2+2(x-3)=3$`], hint: r`Each term loses its own denominator and keeps the rest of $x(x-3)$.`, after: r`$x\cdot x+2(x-3)=3x$.` },
        { say: r`Collect everything on one side as $x^2+bx-6=0$. What is $b$?`, type: 'num', prefix: r`$b=$`, answer: '-1', hint: r`Expand to $x^2+2x-6=3x$, then subtract $3x$.`, after: r`$x^2-x-6=0$, which factors as $(x-3)(x+2)=0$.` },
        { say: r`The candidates are $x=3$ and $x=-2$. Compare them to your first step. What is the solution?`, type: 'num', prefix: r`$x=$`, answer: '-2', hint: r`One candidate makes a denominator zero.`, after: r`$x=3$ is extraneous. Check $x=-2$: $0.4-1=-0.6$ and $\frac{3}{-5}=-0.6$.` }
      ],
      takeaway: r`Write the forbidden values first, then test every root against that list.`
    },
    {
      id: 'growth-half-life-units', title: 'Half-Life in the Wrong Units', skill: 'Decay with time units', level: 'hard',
      stem: r`A lab sample has a mass of 640 milligrams. Its mass is cut in half every 6 hours. What is the mass, in milligrams, after 1.5 days?`,
      steps: [
        { say: r`The period is 6 hours and the time is in days. How many 6-hour periods are in 1 day?`, type: 'num', answer: '4', hint: r`Divide 24 by 6.`, after: r`There are 4 periods per day.` },
        { say: r`With $t$ in days, which model fits?`, type: 'mc', choices: [r`$M=640\left(\frac{1}{2}\right)^{4t}$`, r`$M=640\left(\frac{1}{2}\right)^{t/4}$`, r`$M=640\left(\frac{1}{2}\right)^{6t}$`, r`$M=640\left(\frac{1}{2}\right)^{t}$`], hint: r`The exponent counts how many times the mass halves.`, after: r`In $t$ days the mass halves $4t$ times.` },
        { say: r`How many halvings happen in 1.5 days?`, type: 'num', answer: '6', hint: r`Compute $4(1.5)$.`, after: r`$4(1.5)=6$ halvings.` },
        { say: r`What is the mass after 1.5 days?`, type: 'num', answer: '10', hint: r`Halve 640 six times, or divide by $2^6$.`, after: r`$640\div 64=10$ milligrams.` }
      ],
      takeaway: r`The exponent counts periods, so convert the time into periods before you compute.`
    },
    {
      id: 'growth-percent-multiplier', title: 'From Quarterly to Yearly', skill: 'Percent to multiplier', level: 'hard',
      stem: r`The number of members in a club grows by 8 percent every 3 months. By what percent does the number grow each year, to the nearest whole percent?`,
      steps: [
        { say: r`What is the multiplier for one 3-month period?`, type: 'num', answer: '1.08', hint: r`Growth means 1 plus the rate written as a decimal.`, after: r`An 8 percent increase means multiply by $1.08$.` },
        { say: r`How many of those periods are in one year?`, type: 'num', answer: '4', hint: r`Divide 12 months by 3 months.`, after: r`There are 4 periods in a year.` },
        { say: r`With $t$ in years and a starting count of $N_0$, which model fits?`, type: 'mc', choices: [r`$N=N_0(1.08)^{4t}$`, r`$N=N_0(1.08)^{t/4}$`, r`$N=N_0(1.32)^{t}$`, r`$N=N_0(1.8)^{4t}$`], hint: r`Each year contains 4 growth steps, and percents do not simply add.`, after: r`The exponent is $4t$. Note that $4\times 8=32$ percent is not the yearly rate.` },
        { say: r`What is the yearly growth, to the nearest whole percent?`, type: 'num', answer: '36', tol: 0.5, hint: r`Compute $1.08^4$ and subtract 1.`, after: r`$1.08^4\approx 1.3605$, so the yearly growth is about 36 percent, not 32.` }
      ],
      takeaway: r`To change the period, raise the multiplier to a power. Never multiply the percent.`
    },
    {
      id: 'growth-depreciation-compare', title: 'Two Cars, Two Periods', skill: 'Percent and exponential', level: 'hard',
      stem: r`Car A costs ¤18,000 and loses 15 percent of its value each year. Car B loses 10 percent of its value every 6 months.`,
      steps: [
        { say: r`What is the yearly multiplier for Car A?`, type: 'num', answer: '0.85', hint: r`Decay means 1 minus the rate.`, after: r`$1-0.15=0.85$.` },
        { say: r`What is the 2-year multiplier for Car A?`, type: 'num', answer: '0.7225', hint: r`Square the yearly multiplier.`, after: r`$0.85^2=0.7225$.` },
        { say: r`What percent of its original value has Car A lost after 2 years?`, type: 'num', answer: '27.75', hint: r`Subtract the multiplier from 1, then write it as a percent.`, after: r`$1-0.7225=0.2775$, so 27.75 percent. It is not 30 percent, because the second loss comes off a smaller value.` },
        { say: r`In dollars, what is Car A worth after 2 years?`, type: 'num', prefix: r`¤`, answer: '13005', hint: r`Multiply 18,000 by the 2-year multiplier.`, after: r`$18000(0.7225)=13005$.` },
        { say: r`What is the yearly multiplier for Car B?`, type: 'num', answer: '0.81', hint: r`There are two 6-month periods in a year.`, after: r`$0.90^2=0.81$, so Car B loses 19 percent per year.` },
        { say: r`Which car loses a greater percent of its value each year?`, type: 'mc', choices: [r`Car B, at 19 percent per year`, r`Car A, at 15 percent per year`, r`Car B, at 20 percent per year`, r`They lose the same percent per year`], hint: r`Compare the yearly multipliers. The smaller multiplier loses more.`, after: r`$0.81 \lt 0.85$, so Car B loses a greater percent each year.` }
      ],
      takeaway: r`Put both models on the same time period before you compare them.`
    },
    {
      id: 'pct-successive-reverse', title: 'Undo Two Changes', skill: 'Successive percents and reversing', level: 'hard',
      stem: r`The price of a bike was raised by 20 percent. Later the new price was cut by 10 percent. The final price is ¤162. What was the original price, in dollars?`,
      steps: [
        { say: r`What is the multiplier for the 20 percent increase?`, type: 'num', answer: '1.2', hint: r`Use 1 plus the rate.`, after: r`$1+0.20=1.2$.` },
        { say: r`What is the multiplier for the 10 percent cut?`, type: 'num', answer: '0.9', hint: r`Use 1 minus the rate.`, after: r`$1-0.10=0.9$.` },
        { say: r`What is the net multiplier for both changes together?`, type: 'num', answer: '1.08', hint: r`Multiply them. Do not add the percents.`, after: r`$1.2\times 0.9=1.08$, a net 8 percent increase and not 10 percent.` },
        { say: r`How do you get back to the original price?`, type: 'mc', choices: [r`Divide ¤162 by 1.08`, r`Multiply ¤162 by 0.92`, r`Divide ¤162 by 1.30`, r`Subtract 8 percent of ¤162`], hint: r`Original times net multiplier equals final. Solve for original.`, after: r`Original $\times\, 1.08=162$, so you divide. Taking 8 percent off ¤162 uses the wrong base.` },
        { say: r`What was the original price?`, type: 'num', prefix: r`¤`, answer: '150', hint: r`Compute $162\div 1.08$.`, after: r`$162\div 1.08=150$. Check: 150 becomes 180, then 162.` }
      ],
      takeaway: r`Multiply the multipliers going forward, and divide by the net multiplier going back.`
    },
    {
      id: 'pct-reversing-times', title: 'Reversing Times', skill: 'Reversing a comparison', level: 'hard',
      stem: r`Last year Shop A sold 2.5 times as many bikes as Shop B. This year Shop A's sales grew by 20 percent and Shop B's sales doubled.`,
      steps: [
        { say: r`Pick an easy number. Say Shop B sold 100 last year. How many did Shop A sell?`, type: 'num', answer: '250', hint: r`Multiply 100 by 2.5.`, after: r`Shop A sold 250.` },
        { say: r`Last year, Shop B's sales were what percent of Shop A's sales?`, type: 'num', answer: '40', hint: r`The word "of" points to the base. Divide by Shop A's number.`, after: r`$100\div 250=0.4$, so 40 percent.` },
        { say: r`So Shop B sold what percent fewer than Shop A?`, type: 'num', answer: '60', hint: r`Compare the gap to Shop A's number.`, after: r`$(250-100)\div 250=0.6$, so 60 percent fewer. The answer 150 percent would use Shop B as the base.` },
        { say: r`Which statement reverses "A is 2.5 times B" correctly?`, type: 'mc', choices: [r`B is 0.4 times A`, r`B is 2.5 times less than A`, r`B is 0.25 times A`, r`B is 1.5 times A`], hint: r`Divide both sides of $A=2.5B$ by 2.5.`, after: r`$B=\frac{A}{2.5}=0.4A$.` },
        { say: r`What is the ratio of Shop A's sales to Shop B's sales this year?`, type: 'num', answer: '3/2', hint: r`Compute $250(1.2)$ and $100(2)$, then divide.`, after: r`$300\div 200=\frac{3}{2}$.` }
      ],
      takeaway: r`Reversing "times" means dividing, and the base of a percent is whatever follows "of" or "than".`
    },
    {
      id: 'circle-complete-square', title: 'Complete the Square Twice', skill: 'Circle equations', level: 'hard',
      stem: r`A circle in the $xy$-plane has the equation $x^2+y^2-8x+6y-11=0$. What is the $y$-coordinate of the highest point on the circle?`,
      steps: [
        { say: r`Move the constant to the right side. Group the $x$ terms. What do you add to complete $x^2-8x$?`, type: 'num', answer: '16', hint: r`Halve $-8$ and square the result.`, after: r`$(-4)^2=16$, so $x^2-8x+16=(x-4)^2$.` },
        { say: r`What do you add to complete $y^2+6y$?`, type: 'num', answer: '9', hint: r`Halve 6 and square the result.`, after: r`$3^2=9$, so $y^2+6y+9=(y+3)^2$.` },
        { say: r`Both numbers go on the right side as well. What is $r^2$?`, type: 'num', prefix: r`$r^2=$`, answer: '36', hint: r`Compute $11+16+9$.`, after: r`$(x-4)^2+(y+3)^2=36$.` },
        { say: r`Which pair gives the center and the radius?`, type: 'mc', choices: [r`Center $(4,-3)$, radius $6$`, r`Center $(-4,3)$, radius $6$`, r`Center $(4,-3)$, radius $36$`, r`Center $(4,3)$, radius $6$`], hint: r`The signs inside the squares are opposite to the coordinates, and $r$ is the square root.`, after: r`The center is $(4,-3)$ and the radius is $\sqrt{36}=6$.` },
        { say: r`What is the $y$-coordinate of the highest point?`, type: 'num', answer: '3', hint: r`Go straight up from the center by one radius.`, after: r`$-3+6=3$.` }
      ],
      takeaway: r`Whatever you add on the left you must add on the right, and the right side is $r^2$, not $r$.`
    },
    {
      id: 'circle-tangent-slope', title: 'Tangent From the Radius', skill: 'Circle plus tangent line', level: 'hard',
      stem: r`A circle has center $C(3,-1)$ and passes through $P(7,2)$. Line $\ell$ is tangent to the circle at $P$. What is the $y$-intercept of line $\ell$?`,
      diagram: svgTangent,
      steps: [
        { say: r`What is the radius of the circle?`, type: 'num', answer: '5', hint: r`The horizontal change is 4 and the vertical change is 3.`, after: r`$\sqrt{4^2+3^2}=5$.` },
        { say: r`What is the slope of radius $CP$?`, type: 'num', answer: '3/4', hint: r`Rise over run from $C$ to $P$.`, after: r`$\frac{2-(-1)}{7-3}=\frac{3}{4}$.` },
        { say: r`How is the tangent at $P$ related to the radius $CP$?`, type: 'mc', choices: [r`It is perpendicular to the radius`, r`It is parallel to the radius`, r`It passes through the center`, r`It has the same slope as the radius`], hint: r`A tangent touches the circle at one point and makes a specific angle with the radius there.`, after: r`A tangent is always perpendicular to the radius at the point of contact.` },
        { say: r`What is the slope of line $\ell$?`, type: 'num', answer: '-4/3', hint: r`Take the negative reciprocal of $\frac{3}{4}$.`, after: r`The negative reciprocal of $\frac{3}{4}$ is $-\frac{4}{3}$.` },
        { say: r`What is the $y$-intercept of line $\ell$? It helps to use $y-2=-\frac{4}{3}(x-7)$ at $x=0$.`, type: 'num', answer: '34/3', hint: r`At $x=0$, $y=2+\frac{28}{3}$.`, after: r`$y=2+\frac{28}{3}=\frac{34}{3}$.` }
      ],
      takeaway: r`The tangent slope is the negative reciprocal of the radius slope at the point of contact.`
    },
    {
      id: 'circle-chord-30-60-90', title: 'A 30-60-90 Inside a Circle', skill: 'Special right triangle in a circle', level: 'hard',
      stem: r`In a circle with center $O$ and radius 12, chord $AB$ has a central angle $\angle AOB$ of $120^\circ$. Point $M$ is the midpoint of $AB$. The length of $AB$ can be written as $k\sqrt{3}$. What is the value of $k$?`,
      diagram: svgChord,
      steps: [
        { say: r`Segment $OM$ splits the central angle in half and meets the chord at a right angle. What is the measure, in degrees, of $\angle AOM$?`, type: 'num', answer: '60', hint: r`Halve 120.`, after: r`$\angle AOM=60^\circ$, so triangle $AOM$ is a 30-60-90 triangle with hypotenuse $OA=12$.` },
        { say: r`What is the length of $OM$, the side opposite the $30^\circ$ angle?`, type: 'num', answer: '6', hint: r`In a 30-60-90 triangle, the shortest side is half the hypotenuse.`, after: r`$OM=\frac{12}{2}=6$.` },
        { say: r`What is the length of $AM$, the side opposite the $60^\circ$ angle?`, type: 'mc', choices: [r`$6\sqrt{3}$`, r`$6\sqrt{2}$`, r`$12\sqrt{3}$`, r`$6$`], hint: r`The longer leg is the shorter leg times $\sqrt{3}$.`, after: r`$AM=6\sqrt{3}$.` },
        { say: r`What is $k$, if $AB=k\sqrt{3}$?`, type: 'num', prefix: r`$k=$`, answer: '12', hint: r`$M$ is the midpoint, so $AB$ is twice $AM$.`, after: r`$AB=2(6\sqrt{3})=12\sqrt{3}$, so $k=12$.` }
      ],
      takeaway: r`Radius, half chord, and center-to-chord distance form a right triangle. Look for one whenever a chord appears.`
    },
    {
      id: 'trig-complementary-chain', title: 'Complementary Angles and a Chain', skill: 'Right triangle trig', level: 'hard',
      stem: r`In right triangle $ABC$, the right angle is at $C$, $\sin A=\frac{5}{13}$, and $AB=39$. What is $\tan B$?`,
      diagram: svgRight,
      steps: [
        { say: r`Angles $A$ and $B$ are complementary. What is $\cos B$?`, type: 'num', answer: '5/13', hint: r`The sine of an angle equals the cosine of its complement.`, after: r`$\cos B=\sin A=\frac{5}{13}$.` },
        { say: r`The hypotenuse in the ratio is 13, but $AB=39$. What is the scale factor?`, type: 'num', answer: '3', hint: r`Divide 39 by 13.`, after: r`$39\div 13=3$.` },
        { say: r`What is $BC$, the side opposite angle $A$?`, type: 'num', answer: '15', hint: r`Scale the 5.`, after: r`$5\times 3=15$.` },
        { say: r`Use the Pythagorean theorem. What is $AC$?`, type: 'num', answer: '36', hint: r`$39^2-15^2$, then take the square root.`, after: r`$\sqrt{1521-225}=\sqrt{1296}=36$. This is a 5-12-13 triangle scaled by 3.` },
        { say: r`From angle $B$, $\tan B$ is opposite over adjacent. What is its value?`, type: 'num', answer: '12/5', hint: r`From $B$, the opposite side is $AC$ and the adjacent side is $BC$.`, after: r`$\tan B=\frac{36}{15}=\frac{12}{5}$.` }
      ],
      takeaway: r`Name the sides from the angle you are asked about, not the one you were given.`
    },
    {
      id: 'trig-similar-ratio', title: 'Ratios Carry Across Similar Triangles', skill: 'Trig with similar triangles', level: 'hard',
      stem: r`Right triangles $ABC$ and $DEF$ are similar, with right angles at $C$ and $F$, and $A$ corresponds to $D$. If $\tan A=\frac{3}{4}$ and $DE=30$, what is $\sin E$?`,
      steps: [
        { say: r`What is $\tan D$?`, type: 'num', answer: '3/4', hint: r`Corresponding angles in similar triangles are equal.`, after: r`$\angle D=\angle A$, so $\tan D=\frac{3}{4}$.` },
        { say: r`A tangent of $\frac{3}{4}$ means legs in the ratio 3 to 4. What is the hypotenuse of that base triangle?`, type: 'num', answer: '5', hint: r`$\sqrt{3^2+4^2}$`, after: r`It is a 3-4-5 triangle.` },
        { say: r`The hypotenuse $DE$ is 30. What is the scale factor from 3-4-5?`, type: 'num', answer: '6', hint: r`Divide 30 by 5.`, after: r`$30\div 5=6$, so $EF=18$ and $DF=24$.` },
        { say: r`Which side is opposite angle $E$?`, type: 'mc', choices: [r`$DF$`, r`$EF$`, r`$DE$`, r`It depends on the scale factor`], hint: r`The side opposite an angle does not touch that angle's vertex.`, after: r`Side $DF$ does not touch $E$. It has length 24.` },
        { say: r`What is $\sin E$?`, type: 'num', answer: '4/5', hint: r`Opposite over hypotenuse, from angle $E$.`, after: r`$\sin E=\frac{24}{30}=\frac{4}{5}$.` }
      ],
      takeaway: r`Similar triangles share their angles, so they share every trig ratio.`
    },
    {
      id: 'geo-similar-parallel', title: 'Parallel Line, Area Trap', skill: 'Similar triangles', level: 'hard',
      stem: r`In triangle $ABC$, $D$ is on $AB$, $E$ is on $AC$, and $DE$ is parallel to $BC$. If $AD=6$, $DB=9$, $DE=8$, and the area of triangle $ABC$ is 100, what is the area of trapezoid $DBCE$?`,
      diagram: svgParallel,
      steps: [
        { say: r`What is the length of $AB$?`, type: 'num', answer: '15', hint: r`Add the two parts of the side. The ratio needs the whole side.`, after: r`$AB=6+9=15$.` },
        { say: r`What is the ratio of a side of the small triangle to the matching side of the large one?`, type: 'num', answer: '2/5', hint: r`Compare $AD$ to $AB$, not $AD$ to $DB$.`, after: r`$\frac{6}{15}=\frac{2}{5}$.` },
        { say: r`What is the length of $BC$?`, type: 'num', answer: '20', hint: r`$\frac{8}{BC}=\frac{2}{5}$`, after: r`$BC=8\times\frac{5}{2}=20$.` },
        { say: r`What is the ratio of the areas of triangle $ADE$ to triangle $ABC$?`, type: 'mc', choices: [r`$\frac{4}{25}$`, r`$\frac{2}{5}$`, r`$\frac{4}{5}$`, r`$\frac{8}{125}$`], hint: r`Area is two-dimensional, so square the side ratio.`, after: r`$\left(\frac{2}{5}\right)^2=\frac{4}{25}$.` },
        { say: r`What is the area of the trapezoid?`, type: 'num', answer: '84', hint: r`Find the small triangle's area and subtract it from 100.`, after: r`Triangle $ADE$ has area $100\times\frac{4}{25}=16$, so the trapezoid has area $100-16=84$.` }
      ],
      takeaway: r`Use the part to the whole for the ratio, and square it for area.`
    },
    {
      id: 'quad-shifted-zeros', title: 'Shifted Input', skill: 'Zeros with a shifted input', level: 'hard',
      stem: r`The function $g$ is defined by $g(x)=(x-4)(x+2)$. If $g(c-5)=0$, what is the sum of all possible values of $c$?`,
      steps: [
        { say: r`What does $g(c-5)=0$ tell you?`, type: 'mc', choices: [r`$c-5$ must equal a zero of $g$`, r`$c$ must equal a zero of $g$`, r`$c$ must equal 5`, r`$g$ has a zero at $x=-5$`], hint: r`Whatever sits inside $g(\;)$ plays the role of $x$.`, after: r`The input $c-5$ has to be a value that makes $g$ zero.` },
        { say: r`What is the larger zero of $g$?`, type: 'num', answer: '4', hint: r`Set $x-4=0$.`, after: r`$x=4$.` },
        { say: r`What is the smaller zero of $g$?`, type: 'num', answer: '-2', hint: r`Set $x+2=0$.`, after: r`$x=-2$.` },
        { say: r`Which value of $c$ comes from $c-5=4$?`, type: 'num', prefix: r`$c=$`, answer: '9', hint: r`Add 5 to both sides.`, after: r`$c=9$. Subtracting 5 from 4 is the common mistake.` },
        { say: r`Which value of $c$ comes from $c-5=-2$?`, type: 'num', prefix: r`$c=$`, answer: '3', hint: r`Add 5 to both sides.`, after: r`$c=3$.` },
        { say: r`What is the sum of the possible values of $c$?`, type: 'num', answer: '12', hint: r`Add your two values.`, after: r`$9+3=12$.` }
      ],
      takeaway: r`Set the whole input equal to each zero, then solve for the letter inside.`
    },
    {
      id: 'quad-from-zeros-point', title: 'Build It From the Zeros', skill: 'Quadratic from zeros', level: 'hard',
      stem: r`A parabola crosses the $x$-axis at $x=-1$ and $x=5$ and passes through the point $(3,-16)$. What is the minimum value of the function?`,
      steps: [
        { say: r`Which form should you start from?`, type: 'mc', choices: [r`$y=a(x+1)(x-5)$`, r`$y=(x+1)(x-5)$`, r`$y=a(x-1)(x+5)$`, r`$y=a(x+1)(x-5)-16$`], hint: r`Each zero gives a factor, and you still need a leading coefficient.`, after: r`Zeros $-1$ and $5$ give factors $(x+1)$ and $(x-5)$. Do not forget $a$.` },
        { say: r`Substitute $(3,-16)$ and solve for $a$.`, type: 'num', prefix: r`$a=$`, answer: '2', hint: r`$-16=a(3+1)(3-5)$`, after: r`$-16=a(4)(-2)=-8a$, so $a=2$.` },
        { say: r`What is the $x$-coordinate of the vertex?`, type: 'num', answer: '2', hint: r`The vertex sits halfway between the zeros.`, after: r`$\frac{-1+5}{2}=2$.` },
        { say: r`What is the minimum value of the function?`, type: 'num', answer: '-18', hint: r`Substitute $x=2$ into $y=2(x+1)(x-5)$.`, after: r`$2(3)(-3)=-18$.` }
      ],
      takeaway: r`Zeros give the factors, one more point gives $a$, and the vertex lies midway between the zeros.`
    },
    {
      id: 'lines-table-rebuild', title: 'Rebuild the Line, Then Intersect', skill: 'Linear from table and intercepts', level: 'hard',
      stem: r`The linear function $f$ has $f(2)=11$, $f(5)=20$, and $f(9)=32$. Line $g$ crosses the $x$-axis at $(3,0)$ and the $y$-axis at $(0,-3)$. At what $y$-value do the graphs of $f$ and $g$ intersect?`,
      steps: [
        { say: r`What is the slope of $f$?`, type: 'num', answer: '3', hint: r`Use change in output over change in input, such as from $x=2$ to $x=5$.`, after: r`$\frac{20-11}{5-2}=3$.` },
        { say: r`What is $f(0)$, the value where the graph crosses the $y$-axis?`, type: 'num', answer: '5', hint: r`Go back 2 inputs from $x=2$, which lowers the output by $2\times 3$.`, after: r`$11-6=5$, so $f(x)=3x+5$.` },
        { say: r`What is the slope of line $g$?`, type: 'num', answer: '1', hint: r`Rise over run between the two intercepts.`, after: r`$\frac{0-(-3)}{3-0}=1$, so $g(x)=x-3$.` },
        { say: r`Set $3x+5=x-3$. What is $x$ at the intersection?`, type: 'num', prefix: r`$x=$`, answer: '-4', hint: r`Subtract $x$ and subtract 5 from both sides.`, after: r`$2x=-8$, so $x=-4$.` },
        { say: r`What is the $y$-value at the intersection?`, type: 'num', prefix: r`$y=$`, answer: '-7', hint: r`Substitute $x=-4$ into either line.`, after: r`$g(-4)=-7$ and $f(-4)=-12+5=-7$. The lines agree.` }
      ],
      takeaway: r`Two points give the slope, the value at $x=0$ gives the intercept, and an intersection comes from setting the two rules equal.`
    },
    {
      id: 'data-box-conditional', title: 'Box Plot, Then Pick the Denominator', skill: 'Box plots and conditional probability', level: 'hard',
      stem: r`The box plot shows the scores of 200 students on a test. Exactly 50 of the students scored at or above the third quartile. Of those 50, 20 took a prep class. In all, 80 of the 200 students took a prep class.`,
      diagram: box(52, 64, 73, 81, 96, 40, 100),
      steps: [
        { say: r`What is the range of the scores?`, type: 'num', answer: '44', hint: r`Maximum minus minimum.`, after: r`$96-52=44$.` },
        { say: r`What is the interquartile range?`, type: 'num', answer: '17', hint: r`Use the two edges of the box, not the whiskers.`, after: r`$81-64=17$.` },
        { say: r`A student who took a prep class is chosen at random. What is the denominator for the chance that this student scored at or above the third quartile?`, type: 'mc', choices: [r`80, the students who took a prep class`, r`50, the students at or above the third quartile`, r`200, all students`, r`20, the students in both groups`], hint: r`The word after "given" or the group you are told the student belongs to is the denominator.`, after: r`You already know the student took a prep class, so only those 80 students count.` },
        { say: r`What is that probability?`, type: 'num', answer: '1/4', hint: r`Both conditions over the group you were told about.`, after: r`$\frac{20}{80}=\frac{1}{4}$.` },
        { say: r`Now reverse it. A student at or above the third quartile is chosen. What is the chance this student took a prep class?`, type: 'num', answer: '2/5', hint: r`The numerator stays 20. The denominator changes.`, after: r`$\frac{20}{50}=\frac{2}{5}$. Same numerator, different group, different answer.` }
      ],
      takeaway: r`Range uses the whiskers, IQR uses the box, and the given group is always the denominator.`
    }
  ];

  LWS.practice = [
    // Inequalities
    { id: 'p-ineq-1', topic: 'Inequalities', level: 'easy', type: 'mc',
      stem: r`Which is the solution to $-4x \gt 20$?`,
      choices: [r`$x \lt -5$`, r`$x \gt -5$`, r`$x \lt 5$`, r`$x \gt 5$`],
      explain: r`Divide both sides by $-4$ and reverse the sign: $x \lt -5$.` },
    { id: 'p-ineq-2', topic: 'Inequalities', level: 'medium', type: 'num',
      stem: r`What is the greatest possible value of $x$ if $5-2x \ge 3x-20$?`, answer: '5',
      explain: r`Add $2x$ and add 20 to both sides: $25 \ge 5x$. Divide by 5: $5 \ge x$. The greatest value is 5.` },
    { id: 'p-ineq-3', topic: 'Inequalities', level: 'medium', type: 'mc',
      stem: r`A tank holds 480 liters and drains at 15 liters per minute. The tank must keep at least 180 liters. Which gives all possible values of $t$, the minutes of draining?`,
      choices: [r`$t \le 20$`, r`$t \ge 20$`, r`$t \le 44$`, r`$t \ge 44$`],
      explain: r`$480-15t \ge 180$ gives $-15t \ge -300$. Dividing by $-15$ reverses the sign: $t \le 20$. The value 44 comes from adding 180 instead of subtracting it.` },
    { id: 'p-ineq-4', topic: 'Inequalities', level: 'hard', type: 'num',
      stem: r`The point $(a,b)$ lies in the solution region of $y \le -x+10$ and $y \ge 2x-2$. What is the greatest possible value of $a$?`, answer: '4',
      explain: r`Both conditions can hold only when $2x-2 \le -x+10$. That gives $3x \le 12$, so $x \le 4$. At $x=4$, $y=6$ satisfies both. The greatest value of $a$ is 4.` },
    { id: 'p-ineq-5', topic: 'Inequalities', level: 'hard', type: 'mc',
      stem: r`If $a \lt b \lt 0$, which statement must be true?`,
      choices: [r`$-a \gt -b$`, r`$a^2 \lt b^2$`, r`$\frac{a}{b} \lt 1$`, r`$ab \lt 0$`],
      explain: r`Multiplying $a \lt b$ by $-1$ reverses the sign, so $-a \gt -b$. Try $a=-3$, $b=-2$ to rule out the rest: $a^2=9 \gt 4$, $\frac{a}{b}=1.5 \gt 1$, and $ab=6 \gt 0$.` },
    { id: 'p-ineq-6', topic: 'Inequalities', level: 'hard', type: 'num',
      stem: r`How many integers $x$ satisfy $-1 \lt \dfrac{5-2x}{3} \le 7$?`, answer: '12',
      explain: r`Multiply by 3: $-3 \lt 5-2x \le 21$. Subtract 5: $-8 \lt -2x \le 16$. Divide by $-2$ and reverse both signs: $4 \gt x \ge -8$. The integers run from $-8$ to 3, and $3-(-8)+1=12$.` },

    // Expressions
    { id: 'p-expr-1', topic: 'Expressions', level: 'easy', type: 'mc',
      stem: r`For $x \ne 4$, which is equivalent to $\dfrac{x^2-16}{x-4}$?`,
      choices: [r`$x+4$`, r`$x-4$`, r`$x^2-4$`, r`$x-16$`],
      explain: r`$x^2-16=(x-4)(x+4)$. Cancel $x-4$ to get $x+4$.` },
    { id: 'p-expr-2', topic: 'Expressions', level: 'medium', type: 'mc',
      stem: r`For which values of $x$ is $\dfrac{x+3}{x^2-5x-6}$ undefined?`,
      choices: [r`$x=6$ and $x=-1$`, r`$x=-6$ and $x=1$`, r`$x=-3$ only`, r`$x=-3$, $x=6$, and $x=-1$`],
      explain: r`A fraction is undefined only where the denominator is zero. $x^2-5x-6=(x-6)(x+1)$, so $x=6$ and $x=-1$. A zero numerator at $x=-3$ just makes the value 0.` },
    { id: 'p-expr-3', topic: 'Expressions', level: 'medium', type: 'num',
      stem: r`What is the value of $\dfrac{\frac{1}{x}+\frac{1}{3}}{\frac{x+3}{6}}$ when $x=4$?`, answer: '1/2',
      explain: r`The top is $\frac{3+x}{3x}$. Dividing by $\frac{x+3}{6}$ means multiplying by $\frac{6}{x+3}$, which gives $\frac{2}{x}$. At $x=4$ the value is $\frac{1}{2}$.` },
    { id: 'p-expr-4', topic: 'Expressions', level: 'hard', type: 'mc',
      stem: r`For the values of $x$ where it is defined, which is equivalent to $\dfrac{2x^2+7x+3}{x^2-9}$?`,
      choices: [r`$\dfrac{2x+1}{x-3}$`, r`$\dfrac{2x+1}{x+3}$`, r`$\dfrac{2x+3}{x-3}$`, r`$\dfrac{2x^2+7x}{x^2-12}$`],
      explain: r`The top factors as $(2x+1)(x+3)$ and the bottom as $(x-3)(x+3)$. Cancel $x+3$ to get $\frac{2x+1}{x-3}$. You cannot cancel the 3 and the 9 term by term.` },
    { id: 'p-expr-5', topic: 'Expressions', level: 'hard', type: 'num',
      stem: r`What is the solution to $\dfrac{x+1}{x-3}=\dfrac{4}{x-3}+x$?`, answer: '1',
      explain: r`Multiply by $x-3$: $x+1=4+x^2-3x$. Rearrange: $x^2-4x+3=0$, so $(x-1)(x-3)=0$. $x=3$ makes a denominator zero, so it is extraneous. Check $x=1$: $\frac{2}{-2}=-1$ and $\frac{4}{-2}+1=-1$.` },
    { id: 'p-expr-6', topic: 'Expressions', level: 'hard', type: 'mc',
      stem: r`Which is equivalent to $\dfrac{x}{x-1}-\dfrac{1}{x+1}$, for $x \ne \pm 1$?`,
      choices: [r`$\dfrac{x^2+1}{x^2-1}$`, r`$\dfrac{x-1}{x^2-1}$`, r`$\dfrac{x^2+2x+1}{x^2-1}$`, r`$\dfrac{x^2-1}{x^2-1}$`],
      explain: r`The common denominator is $(x-1)(x+1)=x^2-1$. The top is $x(x+1)-(x-1)=x^2+x-x+1=x^2+1$. The minus sign must apply to both terms of $x-1$.` },

    // Growth and Decay
    { id: 'p-grow-1', topic: 'Growth and Decay', level: 'easy', type: 'mc',
      stem: r`A town has 500 residents and its population grows by 6 percent each year. Which gives the population after $t$ years?`,
      choices: [r`$500(1.06)^t$`, r`$500(0.06)^t$`, r`$500(1.6)^t$`, r`$500(0.94)^t$`],
      explain: r`A 6 percent increase is a multiplier of $1+0.06=1.06$, applied once per year.` },
    { id: 'p-grow-2', topic: 'Growth and Decay', level: 'medium', type: 'mc',
      stem: r`The number of visitors to a site was 2,500 and falls by 20 percent each week. How many visitors are there after 3 weeks?`,
      choices: [r`1,280`, r`1,000`, r`2,000`, r`4,883`],
      explain: r`$2500(0.8)^3=2500(0.512)=1280$. The value 1,000 subtracts 500 each week, which treats the drop as linear. The value 4,883 uses a multiplier of 1.25.` },
    { id: 'p-grow-3', topic: 'Growth and Decay', level: 'medium', type: 'mc',
      stem: r`A bacteria culture starts with 200 cells and triples every 4 hours. Which gives the number of cells after $t$ hours?`,
      choices: [r`$200\cdot 3^{t/4}$`, r`$200\cdot 3^{4t}$`, r`$200\cdot 4^{t/3}$`, r`$200\cdot 3^{t}$`],
      explain: r`The culture triples once per 4 hours, so in $t$ hours it triples $\frac{t}{4}$ times.` },
    { id: 'p-grow-4', topic: 'Growth and Decay', level: 'hard', type: 'num',
      stem: r`An account starts at ¤1,000 and grows by 3 percent every 6 months. To the nearest dollar, how many dollars are in the account after 4 years?`, answer: '1267', tol: 1,
      explain: r`There are 8 six-month periods in 4 years. $1000(1.03)^8\approx 1266.77$, which rounds to 1267.` },
    { id: 'p-grow-5', topic: 'Growth and Decay', level: 'hard', type: 'mc',
      stem: r`The value of a machine after $t$ years is $V(t)=900(0.81)^{t/2}$. By what percent does the value decrease each year?`,
      choices: [r`10 percent`, r`19 percent`, r`9.5 percent`, r`81 percent`],
      explain: r`$(0.81)^{t/2}=\left(0.81^{1/2}\right)^t=0.9^t$. The yearly multiplier is 0.9, so the decrease is 10 percent. The 19 percent figure is the decrease per 2 years.` },
    { id: 'p-grow-6', topic: 'Growth and Decay', level: 'hard', type: 'num',
      stem: r`A 12-gram sample decays to 3 grams in 36 hours. Its mass is cut in half at a constant interval. How many hours is that interval?`, answer: '18',
      explain: r`12 to 6 to 3 takes 2 halvings. $36\div 2=18$ hours.` },

    // Percentages
    { id: 'p-pct-1', topic: 'Percentages', level: 'easy', type: 'num',
      stem: r`A value rises from 40 to 52. What is the percent increase?`, answer: '30',
      explain: r`The change is 12. The base is the starting value, so $\frac{12}{40}=0.30$, or 30 percent.` },
    { id: 'p-pct-2', topic: 'Percentages', level: 'medium', type: 'mc',
      stem: r`A price is increased by 15 percent and then decreased by 20 percent. What is the overall change?`,
      choices: [r`An 8 percent decrease`, r`A 5 percent decrease`, r`An 8 percent increase`, r`A 5 percent increase`],
      explain: r`$1.15\times 0.80=0.92$, which is an 8 percent decrease. Adding the percents gives the wrong answer of 5.` },
    { id: 'p-pct-3', topic: 'Percentages', level: 'medium', type: 'mc',
      stem: r`After a 30 percent discount, a coat costs ¤91. What was the price before the discount?`,
      choices: [r`¤130`, r`¤118.30`, r`¤121`, r`¤303.33`],
      explain: r`Sale price is 0.70 of the original, so the original is $91\div 0.70=130$. Multiplying by 1.30 gives ¤118.30, which takes 30 percent of the wrong base.` },
    { id: 'p-pct-4', topic: 'Percentages', level: 'hard', type: 'num',
      stem: r`The value of $A$ is 30 percent greater than $B$, and $C$ is 20 percent less than $B$. By what percent is $A$ greater than $C$?`, answer: '62.5',
      explain: r`Let $B=100$. Then $A=130$ and $C=80$. $\frac{130-80}{80}=0.625$, or 62.5 percent. The base is $C$ because of the words "greater than $C$".` },
    { id: 'p-pct-5', topic: 'Percentages', level: 'hard', type: 'mc',
      stem: r`The value of $x$ is 40 percent of $y$, and $y$ is 150 percent of $z$. The value of $x$ is what percent of $z$?`,
      choices: [r`60 percent`, r`190 percent`, r`110 percent`, r`26.7 percent`],
      explain: r`$x=0.4y=0.4(1.5z)=0.6z$. Chained percents multiply.` },
    { id: 'p-pct-6', topic: 'Percentages', level: 'hard', type: 'num',
      stem: r`A store's revenue falls by 25 percent. By what percent must the new revenue increase to return to the original level? Round to the nearest tenth of a percent.`, answer: '33.3', tol: 0.05,
      explain: r`The new revenue is 0.75 of the original. It needs a multiplier of $\frac{1}{0.75}=\frac{4}{3}$, an increase of about 33.3 percent. The base has become smaller, so 25 percent is not enough.` },

    // Circles
    { id: 'p-circ-1', topic: 'Circles', level: 'easy', type: 'mc',
      stem: r`What are the center and radius of $(x-2)^2+(y+5)^2=49$?`,
      choices: [r`Center $(2,-5)$, radius $7$`, r`Center $(-2,5)$, radius $7$`, r`Center $(2,-5)$, radius $49$`, r`Center $(-2,5)$, radius $49$`],
      explain: r`The form is $(x-h)^2+(y-k)^2=r^2$, so the center is $(2,-5)$ and $r=\sqrt{49}=7$.` },
    { id: 'p-circ-2', topic: 'Circles', level: 'medium', type: 'num',
      stem: r`What is the radius of the circle $x^2+y^2-6x+10y=2$?`, answer: '6',
      explain: r`Add 9 and 25 to both sides: $(x-3)^2+(y+5)^2=2+9+25=36$. The radius is 6.` },
    { id: 'p-circ-3', topic: 'Circles', level: 'medium', type: 'mc',
      stem: r`What are the center and radius of $x^2+4x+y^2-2y=20$?`,
      choices: [r`Center $(-2,1)$, radius $5$`, r`Center $(2,-1)$, radius $5$`, r`Center $(-2,1)$, radius $25$`, r`Center $(-2,1)$, radius $\sqrt{20}$`],
      explain: r`Add 4 and 1 to both sides: $(x+2)^2+(y-1)^2=25$. The center is $(-2,1)$ and the radius is 5.` },
    { id: 'p-circ-4', topic: 'Circles', level: 'hard', type: 'mc',
      stem: r`A circle has center $(1,2)$ and passes through $(4,6)$. What is the slope of the line tangent to the circle at $(4,6)$?`,
      choices: [r`$-\frac{3}{4}$`, r`$\frac{4}{3}$`, r`$\frac{3}{4}$`, r`$-\frac{4}{3}$`],
      explain: r`The radius has slope $\frac{6-2}{4-1}=\frac{4}{3}$. The tangent is perpendicular to it, so its slope is the negative reciprocal, $-\frac{3}{4}$.` },
    { id: 'p-circ-5', topic: 'Circles', level: 'hard', type: 'mc',
      stem: r`A sector of a circle with radius 6 has a central angle of $150^\circ$. What is the area of the sector?`,
      choices: [r`$15\pi$`, r`$5\pi$`, r`$18\pi$`, r`$60\pi$`],
      explain: r`The sector is $\frac{150}{360}=\frac{5}{12}$ of the circle. $\frac{5}{12}\times 36\pi=15\pi$. The value $5\pi$ is the arc length.` },
    { id: 'p-circ-6', topic: 'Circles', level: 'hard', type: 'num',
      stem: r`The circle $x^2+y^2-10x-4y+k=0$ has a radius of 6. What is the value of $k$?`, answer: '-7',
      explain: r`Complete the squares: $(x-5)^2+(y-2)^2=25+4-k=29-k$. Set $29-k=36$, so $k=-7$.` },

    // Trig
    { id: 'p-trig-1', topic: 'Trig', level: 'easy', type: 'mc',
      stem: r`A right triangle has legs of lengths 8 and 15 and a hypotenuse of length 17. What is the sine of the angle opposite the side of length 8?`,
      choices: [r`$\frac{8}{17}$`, r`$\frac{15}{17}$`, r`$\frac{8}{15}$`, r`$\frac{15}{8}$`],
      explain: r`Sine is opposite over hypotenuse, which is $\frac{8}{17}$.` },
    { id: 'p-trig-2', topic: 'Trig', level: 'medium', type: 'num',
      stem: r`For acute angles, $\sin(x^\circ)=\cos((2x-30)^\circ)$. What is the value of $x$?`, answer: '40',
      explain: r`Sine and cosine are equal for complementary angles, so $x+2x-30=90$. Then $3x=120$ and $x=40$. Check: the angles are $40^\circ$ and $50^\circ$.` },
    { id: 'p-trig-3', topic: 'Trig', level: 'medium', type: 'mc',
      stem: r`A straight ramp is 15 feet long and makes a $20^\circ$ angle with level ground. Which expression gives $h$, the height in feet of the top of the ramp?`,
      choices: [r`$15\sin 20^\circ$`, r`$15\cos 20^\circ$`, r`$15\tan 20^\circ$`, r`$\dfrac{15}{\sin 20^\circ}$`],
      explain: r`The height is opposite the $20^\circ$ angle and the ramp is the hypotenuse. $\sin 20^\circ=\frac{h}{15}$, so $h=15\sin 20^\circ$.` },
    { id: 'p-trig-4', topic: 'Trig', level: 'hard', type: 'mc',
      stem: r`In right triangle $ABC$ with the right angle at $C$, $\tan A=\frac{7}{24}$ and $AB=75$. What is the length of $AC$?`,
      choices: [r`72`, r`21`, r`24`, r`25`],
      explain: r`The base triangle is 7-24-25. Since $AB=75$, the scale factor is 3. $AC$ is adjacent to $A$, so $AC=24\times 3=72$.` },
    { id: 'p-trig-5', topic: 'Trig', level: 'hard', type: 'mc',
      stem: r`For an acute angle $x$, $\cos x=\frac{3}{5}$. What is $\tan(90^\circ-x)$?`,
      choices: [r`$\frac{3}{4}$`, r`$\frac{4}{3}$`, r`$\frac{3}{5}$`, r`$\frac{4}{5}$`],
      explain: r`Draw a 3-4-5 triangle with 3 adjacent to $x$ and 4 opposite. The other acute angle is $90^\circ-x$. From that angle, the opposite side is 3 and the adjacent side is 4, so the tangent is $\frac{3}{4}$.` },
    { id: 'p-trig-6', topic: 'Trig', level: 'hard', type: 'num',
      stem: r`An equilateral triangle is inscribed in a circle of radius 8. The side of the triangle has length $k\sqrt{3}$. What is the value of $k$?`, answer: '8',
      explain: r`Draw a radius to a vertex and a perpendicular from the center to a side. That forms a 30-60-90 triangle with hypotenuse 8, so half the side is $4\sqrt{3}$. The side is $8\sqrt{3}$, so $k=8$.` },

    // Geometry
    { id: 'p-geo-1', topic: 'Geometry', level: 'easy', type: 'num',
      stem: r`Two triangles are similar. A triangle has sides 6 and 8, and the matching sides of the larger triangle are 15 and $s$. What is the value of $s$?`, answer: '20',
      explain: r`The scale factor is $\frac{15}{6}=2.5$, so $s=8\times 2.5=20$.` },
    { id: 'p-geo-2', topic: 'Geometry', level: 'medium', type: 'mc',
      stem: r`Two similar triangles have corresponding sides in the ratio 2 to 5. The smaller triangle has an area of 12. What is the area of the larger triangle?`,
      choices: [r`75`, r`30`, r`48`, r`187.5`],
      explain: r`Area scales by the square of the side ratio: $12\times\left(\frac{5}{2}\right)^2=12\times 6.25=75$. The value 30 uses the side ratio without squaring.` },
    { id: 'p-geo-3', topic: 'Geometry', level: 'medium', type: 'num',
      stem: r`In triangle $ABC$, $DE$ is parallel to $BC$, with $D$ on $AB$ and $E$ on $AC$. If $AD=4$, $DB=6$, and $AE=5$, what is the length of $EC$?`, answer: '7.5',
      explain: r`A parallel line cuts the sides proportionally: $\frac{AD}{DB}=\frac{AE}{EC}$. So $\frac{4}{6}=\frac{5}{EC}$, and $EC=7.5$.` },
    { id: 'p-geo-4', topic: 'Geometry', level: 'hard', type: 'mc',
      stem: r`The altitude to the hypotenuse of a right triangle splits the hypotenuse into segments of lengths 4 and 9. What is the area of the triangle?`,
      choices: [r`39`, r`78`, r`18`, r`26`],
      explain: r`The altitude creates similar triangles, so $\frac{4}{h}=\frac{h}{9}$ and $h^2=36$, which gives $h=6$. The hypotenuse is 13, and the area is $\frac{1}{2}(13)(6)=39$. The value 78 forgets the $\frac{1}{2}$.` },
    { id: 'p-geo-5', topic: 'Geometry', level: 'hard', type: 'num',
      stem: r`A cylinder's radius is increased by 50 percent and its height is decreased by 20 percent. The new volume is what percent of the original volume?`, answer: '180',
      explain: r`Volume is $\pi r^2 h$, so the radius multiplier gets squared. $1.5^2\times 0.8=2.25\times 0.8=1.8$, which is 180 percent.` },
    { id: 'p-geo-6', topic: 'Geometry', level: 'hard', type: 'mc',
      stem: r`Tangent lines from point $P$ touch a circle with center $O$ at points $A$ and $B$. If $\angle APB=50^\circ$, what is the measure of $\angle AOB$?`,
      choices: [r`$130^\circ$`, r`$50^\circ$`, r`$100^\circ$`, r`$65^\circ$`],
      explain: r`A radius meets a tangent at $90^\circ$, so quadrilateral $OAPB$ has angles of $90^\circ$ at $A$ and $B$. The four angles total $360^\circ$, so $\angle AOB=360^\circ-90^\circ-90^\circ-50^\circ=130^\circ$.` },

    // Data
    { id: 'p-data-1', topic: 'Data', level: 'easy', type: 'num',
      stem: r`What is the range of the data shown in the box plot?`, diagram: box(12, 20, 26, 34, 50, 10, 55), answer: '38',
      explain: r`The range is the maximum minus the minimum: $50-12=38$.` },
    { id: 'p-data-2', topic: 'Data', level: 'medium', type: 'mc',
      stem: r`What is the interquartile range of the data shown in the box plot?`, diagram: box(10, 18, 30, 36, 48, 5, 50),
      choices: [r`18`, r`38`, r`30`, r`6`],
      explain: r`IQR is the third quartile minus the first quartile: $36-18=18$. The value 38 is the range, and 30 is the median.` },
    { id: 'p-data-3', topic: 'Data', level: 'medium', type: 'mc',
      stem: r`In a survey, 24 ninth graders and 30 tenth graders are in a club, while 36 ninth graders and 10 tenth graders are not. If a club member is chosen at random, what is the probability that the member is a tenth grader?`,
      choices: [r`$\frac{5}{9}$`, r`$\frac{3}{4}$`, r`$\frac{3}{10}$`, r`$\frac{27}{50}$`],
      explain: r`The given group is club members, $24+30=54$. Of those, 30 are tenth graders. $\frac{30}{54}=\frac{5}{9}$.` },
    { id: 'p-data-4', topic: 'Data', level: 'hard', type: 'mc',
      stem: r`A data set is 10, 12, 14, 16, 18. The value 62 is added to the set. Which describes the change?`,
      choices: [r`The mean increases by 8 and the median increases by 1`, r`The mean increases by 8 and the median does not change`, r`The mean increases by 48 and the median increases by 1`, r`The mean and the median both increase by 8`],
      explain: r`The old mean is 14 and the old median is 14. The new mean is $\frac{70+62}{6}=22$. The new median is the average of the middle two, $\frac{14+16}{2}=15$.` },
    { id: 'p-data-5', topic: 'Data', level: 'hard', type: 'num',
      stem: r`Class A has 20 students with a mean score of 80. Class B has 30 students with a mean score of 90. What is the mean score of all 50 students?`, answer: '86',
      explain: r`Use total points: $20(80)+30(90)=1600+2700=4300$. Then $4300\div 50=86$. The value 85 ignores the class sizes.` },
    { id: 'p-data-6', topic: 'Data', level: 'hard', type: 'num',
      stem: r`At a gym, 60 percent of members are adults. Of the adults, 25 percent swim. Of the other members, 50 percent swim. If a swimmer is chosen at random, what is the probability that the swimmer is an adult?`, answer: '3/7', tol: 0.005,
      explain: r`Imagine 100 members. Adults who swim: $60\times 0.25=15$. Others who swim: $40\times 0.5=20$. There are 35 swimmers, so the probability is $\frac{15}{35}=\frac{3}{7}$.` },

    // Quadratics
    { id: 'p-quad-1', topic: 'Quadratics', level: 'easy', type: 'mc',
      stem: r`What are the zeros of $f(x)=(x-3)(x+7)$?`,
      choices: [r`$3$ and $-7$`, r`$-3$ and $7$`, r`$3$ and $7$`, r`$-3$ and $-7$`],
      explain: r`Set each factor to zero. $x-3=0$ gives 3, and $x+7=0$ gives $-7$.` },
    { id: 'p-quad-2', topic: 'Quadratics', level: 'medium', type: 'mc',
      stem: r`For $g(x)=(x-6)(x+1)$, $g(c-2)=0$. What is the greatest possible value of $c$?`,
      choices: [r`$8$`, r`$6$`, r`$4$`, r`$1$`],
      explain: r`The input $c-2$ must equal a zero of $g$. $c-2=6$ gives $c=8$, and $c-2=-1$ gives $c=1$. The greatest is 8. The value 4 subtracts 2 from 6 instead of adding.` },
    { id: 'p-quad-3', topic: 'Quadratics', level: 'medium', type: 'mc',
      stem: r`A parabola has zeros at $x=-2$ and $x=6$ and crosses the $y$-axis at $(0,-24)$. Which equation describes it?`,
      choices: [r`$y=2(x+2)(x-6)$`, r`$y=(x+2)(x-6)$`, r`$y=2(x-2)(x+6)$`, r`$y=-2(x+2)(x-6)$`],
      explain: r`Zeros give $y=a(x+2)(x-6)$. At $x=0$: $a(2)(-6)=-24$, so $a=2$. The form $2(x-2)(x+6)$ also passes through $(0,-24)$, but its zeros are 2 and $-6$.` },
    { id: 'p-quad-4', topic: 'Quadratics', level: 'hard', type: 'num',
      stem: r`The equation $x^2+bx+16=0$, where $b$ is a positive constant, has exactly one real solution. What is the value of $b$?`, answer: '8',
      explain: r`Exactly one solution means the discriminant is zero: $b^2-4(1)(16)=0$, so $b^2=64$. Since $b \gt 0$, $b=8$.` },
    { id: 'p-quad-5', topic: 'Quadratics', level: 'hard', type: 'mc',
      stem: r`The graphs of $y=x^2-6x+k$ and $y=2$ intersect at exactly one point. What is the value of $k$?`,
      choices: [r`$11$`, r`$9$`, r`$7$`, r`$2$`],
      explain: r`Set them equal: $x^2-6x+k-2=0$. The discriminant must be zero: $36-4(k-2)=0$, so $k-2=9$ and $k=11$. The value 9 ignores the line at $y=2$.` },
    { id: 'p-quad-6', topic: 'Quadratics', level: 'hard', type: 'num',
      stem: r`The solutions of $2x^2-12x+7=0$ are $r$ and $s$. What is the value of $r^2+s^2$?`, answer: '29',
      explain: r`Sum: $r+s=\frac{12}{2}=6$. Product: $rs=\frac{7}{2}$. Then $r^2+s^2=(r+s)^2-2rs=36-7=29$.` },

    // Lines
    { id: 'p-line-1', topic: 'Lines', level: 'easy', type: 'mc',
      stem: r`Which equation describes the line through $(0,4)$ and $(2,10)$?`,
      choices: [r`$y=3x+4$`, r`$y=4x+3$`, r`$y=3x+10$`, r`$y=\frac{1}{3}x+4$`],
      explain: r`The slope is $\frac{10-4}{2-0}=3$ and the point $(0,4)$ gives the $y$-intercept.` },
    { id: 'p-line-2', topic: 'Lines', level: 'medium', type: 'num',
      stem: r`A linear function has $f(1)=4$, $f(3)=10$, and $f(7)=22$. What is $f(20)$?`, answer: '61',
      explain: r`The slope is $\frac{10-4}{3-1}=3$. Then $f(0)=4-3=1$, so $f(x)=3x+1$ and $f(20)=61$.` },
    { id: 'p-line-3', topic: 'Lines', level: 'medium', type: 'mc',
      stem: r`A line has an $x$-intercept of 6 and a $y$-intercept of 4. Which equation describes it?`,
      choices: [r`$2x+3y=12$`, r`$3x+2y=12$`, r`$2x-3y=12$`, r`$x+y=10$`],
      explain: r`Test the intercepts. $(6,0)$ gives $2(6)=12$, and $(0,4)$ gives $3(4)=12$. The equation $3x+2y=12$ swaps the two intercepts.` },
    { id: 'p-line-4', topic: 'Lines', level: 'hard', type: 'mc',
      stem: r`A line passes through $(-3,-5)$ and $(6,1)$. What is its value at $x=0$?`,
      choices: [r`$-3$`, r`$-7$`, r`$-\frac{1}{2}$`, r`$3$`],
      explain: r`The slope is $\frac{1-(-5)}{6-(-3)}=\frac{6}{9}=\frac{2}{3}$. Moving 3 to the right from $(-3,-5)$ adds $3\times\frac{2}{3}=2$, so the value is $-3$.` },
    { id: 'p-line-5', topic: 'Lines', level: 'hard', type: 'mc',
      stem: r`The system $3x+ky=8$ and $6x-4y=5$ has no solution. What is the value of $k$?`,
      choices: [r`$-2$`, r`$2$`, r`$-8$`, r`$\frac{1}{2}$`],
      explain: r`No solution means parallel lines, so the coefficients must be proportional: $\frac{3}{6}=\frac{k}{-4}$, which gives $k=-2$. The constants are not in that ratio, since $\frac{8}{5}\ne\frac{1}{2}$, so the lines are distinct.` },
    { id: 'p-line-6', topic: 'Lines', level: 'hard', type: 'num',
      stem: r`Line $m$ is the perpendicular bisector of the segment from $(2,1)$ to $(6,7)$. What is the $y$-intercept of line $m$?`, answer: '20/3',
      explain: r`The midpoint is $(4,4)$. The segment has slope $\frac{6}{4}=\frac{3}{2}$, so line $m$ has slope $-\frac{2}{3}$. At $x=0$: $y=4+\frac{8}{3}=\frac{20}{3}$.` }
  ];

  LWS.mastery = [
    // Spot the error
    { id: 'm-spot-ineq', form: 'spot', topic: 'Inequalities', level: 'medium', type: 'mc',
      stem: r`Here is a worked solution for $-3x+4 \le 19$. Which line first goes wrong?<br>Line 1: $-3x \le 15$<br>Line 2: $x \le -5$<br>Line 3: The greatest possible value of $x$ is $-5$.`,
      choices: [r`Line 2: dividing by a negative number reverses the sign`, r`Line 1: the 4 should have been added to 19`, r`Line 3: the value should be $5$, not $-5$`, r`Line 2: both sides should be multiplied by 3, not divided`],
      explain: r`Line 1 is correct. In Line 2, dividing by $-3$ must reverse the sign, so $x \ge -5$. There is then no greatest value of $x$, only a least one.` },
    { id: 'm-spot-expr', form: 'spot', topic: 'Expressions', level: 'medium', type: 'mc',
      stem: r`Here is a worked simplification of $\dfrac{x^2-x-6}{x^2-9}$. Which line first goes wrong?<br>Line 1: The numerator factors as $(x-3)(x+2)$.<br>Line 2: The denominator factors as $(x-3)(x-3)$.<br>Line 3: The result is $\dfrac{x+2}{x-3}$.`,
      choices: [r`Line 2: $x^2-9$ factors as $(x-3)(x+3)$`, r`Line 1: the numerator factors as $(x+3)(x-2)$`, r`Line 3: the factor $x-3$ cannot be cancelled`, r`Line 2: $x^2-9$ cannot be factored`],
      explain: r`Line 1 is correct: $(x-3)(x+2)=x^2-x-6$. Line 2 is wrong because $x^2-9$ is a difference of squares, $(x-3)(x+3)$. The correct result is $\frac{x+2}{x+3}$.` },
    { id: 'm-spot-growth', form: 'spot', topic: 'Growth and Decay', level: 'hard', type: 'mc',
      stem: r`A sample of 1,200 units loses 10 percent every 2 years. Here is a worked solution for the amount after 6 years. Which line first goes wrong?<br>Line 1: The multiplier for one period is $0.90$.<br>Line 2: The time is 6 years, so the exponent is 6.<br>Line 3: The amount is $1200(0.90)^6$.`,
      choices: [r`Line 2: 6 years is only 3 two-year periods`, r`Line 1: the multiplier should be $1.10$`, r`Line 1: the multiplier should be $0.10$`, r`Line 3: the 1200 should be raised to the power too`],
      explain: r`The multiplier 0.90 is right for a 10 percent loss. The exponent counts periods, and a period is 2 years, so the exponent is 3. The amount is $1200(0.90)^3=874.8$.` },
    { id: 'm-spot-pct', form: 'spot', topic: 'Percentages', level: 'medium', type: 'mc',
      stem: r`A jacket's price was raised by 20 percent, then cut by 20 percent, ending at ¤192. Here is a worked solution for the original price. Which line first goes wrong?<br>Line 1: The two multipliers are $1.20$ and $0.80$.<br>Line 2: The net multiplier is $1.00$, because the changes cancel.<br>Line 3: The original price is ¤192.`,
      choices: [r`Line 2: the multipliers multiply to $0.96$`, r`Line 1: the second multiplier should be $0.20$`, r`Line 1: the first multiplier should be $0.20$`, r`Line 3: the original price should be $192\times 1.20$`],
      explain: r`$1.20\times 0.80=0.96$, so the changes do not cancel. The original price is $192\div 0.96=200$.` },
    { id: 'm-spot-circle', form: 'spot', topic: 'Circles', level: 'hard', type: 'mc',
      stem: r`Here is a worked solution for the radius of $x^2+y^2+6x-4y=12$. Which line first goes wrong?<br>Line 1: $(x^2+6x+9)+(y^2-4y+4)=12$<br>Line 2: $(x+3)^2+(y-2)^2=12$<br>Line 3: The radius is $\sqrt{12}$.`,
      choices: [r`Line 1: the 9 and the 4 must also be added to the right side`, r`Line 1: the numbers added should be 3 and 2`, r`Line 2: the factors should be $(x-3)^2$ and $(y+2)^2$`, r`Line 3: the radius should be 12, not its square root`],
      explain: r`Adding 9 and 4 on the left means adding them on the right too. The right side is $12+9+4=25$, so the radius is 5.` },

    // Trap
    { id: 'm-trap-pct', form: 'trap', topic: 'Percentages', level: 'hard', type: 'mc',
      stem: r`The value of $Y$ is 3 times the value of $X$. A tempting statement is that $Y$ is 300 percent greater than $X$. Is the statement right?`,
      choices: [r`No. 3 times means 200 percent greater, since the increase is $2X$`, r`Yes. 3 times is the same as 300 percent, so it is 300 percent greater`, r`No. 3 times means 150 percent greater, since $3X$ is halfway`, r`No. $Y$ is 33 percent greater, since $\frac{1}{3}$ is about 33 percent`],
      explain: r`The increase from $X$ to $3X$ is $2X$, and $\frac{2X}{X}=2$, so it is 200 percent greater. $Y$ is 300 percent of $X$, which is a different statement.` },
    { id: 'm-trap-growth', form: 'trap', topic: 'Growth and Decay', level: 'medium', type: 'mc',
      stem: r`A population of 3,000 doubles every 5 years. A tempting expression for the population after 15 years is $3000\cdot 2^{15}$. Is the expression right?`,
      choices: [r`No. There are only 3 doubling periods, so it should be $3000\cdot 2^{3}$`, r`Yes. The exponent is the number of years`, r`No. It should be $3000\cdot 15^{2}$, since 15 is the time`, r`No. It should be $3000\cdot 2\cdot 15$, since the growth is steady`],
      explain: r`The exponent counts doubling periods. $15\div 5=3$, so the population is $3000\cdot 2^3=24000$.` },
    { id: 'm-trap-expr', form: 'trap', topic: 'Expressions', level: 'hard', type: 'mc',
      stem: r`Consider $h(x)=\dfrac{x^2-25}{x-5}$. Since this looks like $x+5$, a tempting claim is that $h(5)=10$. Is the claim right?`,
      choices: [r`No. $h$ is undefined at $x=5$, since the original denominator is zero there`, r`Yes. The factor cancels, so $x=5$ is allowed`, r`No. $h(5)=0$, since the numerator is zero there`, r`No. $h(5)=5$, since the 25 and 5 reduce to 5`],
      explain: r`The simplified form agrees with $h$ everywhere except at $x=5$. At $x=5$ the original expression is $\frac{0}{0}$, so it is undefined. Excluded values come from the original denominator.` },
    { id: 'm-trap-trig', form: 'trap', topic: 'Trig', level: 'medium', type: 'mc',
      stem: r`For an acute angle $x$, $\sin x=0.6$. A tempting claim is that $\cos x=0.4$, because the two values should add to 1. Is the claim right?`,
      choices: [r`No. The squares add to 1, so $\cos x=0.8$`, r`Yes. Sine and cosine of an angle always add to 1`, r`No. $\cos x=0.6$, because they are always equal`, r`No. $\cos x=1.6$, because cosine is 1 more than sine`],
      explain: r`$\sin^2 x+\cos^2 x=1$, so $\cos^2 x=1-0.36=0.64$ and $\cos x=0.8$. This is a 3-4-5 triangle.` },
    { id: 'm-trap-circle', form: 'trap', topic: 'Circles', level: 'hard', type: 'mc',
      stem: r`A circle has the equation $x^2+y^2-6x+8y=0$. A tempting claim is that its radius is 0, because the right side is 0. Is the claim right?`,
      choices: [r`No. Completing the square makes the right side 25, so the radius is 5`, r`Yes. The right side of a circle equation is always $r^2$`, r`No. Completing the square makes the right side 14, so the radius is $\sqrt{14}$`, r`No. The radius is 10, since the coefficients are 6 and 8`],
      explain: r`The form must be completed first. Add 9 and 16 to both sides: $(x-3)^2+(y+4)^2=25$. The radius is 5.` },

    // Translate
    { id: 'm-tr-ineq', form: 'translate', topic: 'Inequalities', level: 'medium', type: 'mc',
      stem: r`A pool holds 12,000 gallons and drains at 300 gallons per hour. It must keep at least 3,000 gallons. Which inequality describes the possible number of hours $t$ it can drain?`,
      choices: [r`$12000-300t \ge 3000$`, r`$12000-300t \le 3000$`, r`$12000+300t \ge 3000$`, r`$300t-12000 \ge 3000$`],
      explain: r`The amount left is $12000-300t$, and "at least 3,000" means $\ge 3000$. Solving reverses the sign to give $t \le 30$.` },
    { id: 'm-tr-growth', form: 'translate', topic: 'Growth and Decay', level: 'hard', type: 'mc',
      stem: r`A newsletter has 4,000 subscribers. The number grows by 5 percent every 3 months. Which equation gives the number of subscribers $S$ after $y$ years?`,
      choices: [r`$S=4000(1.05)^{4y}$`, r`$S=4000(1.05)^{y/4}$`, r`$S=4000(1.05)^{3y}$`, r`$S=4000(1.5)^{4y}$`],
      explain: r`The multiplier is 1.05. There are 4 three-month periods per year, so the exponent is $4y$.` },
    { id: 'm-tr-pct', form: 'translate', topic: 'Percentages', level: 'hard', type: 'mc',
      stem: r`A shop's list price is 30 percent above its cost $c$. During a sale, the shop takes 10 percent off the list price. Which equation gives the sale price $s$?`,
      choices: [r`$s=0.9(1.3c)$`, r`$s=1.2c$`, r`$s=1.3c-0.1$`, r`$s=0.9(0.7c)$`],
      explain: r`List price is $1.3c$. Taking 10 percent off means multiplying that by 0.9, so $s=0.9(1.3c)=1.17c$. Adding the percents to get $1.2c$ uses the wrong base for the second change.` },
    { id: 'm-tr-trig', form: 'translate', topic: 'Trig', level: 'hard', type: 'mc',
      stem: r`A flagpole 9 meters tall stands on level ground. The sun's rays make an angle of $\theta$ with the ground. Which equation gives the length $s$ of the pole's shadow, in meters?`,
      choices: [r`$s=\dfrac{9}{\tan\theta}$`, r`$s=9\tan\theta$`, r`$s=\dfrac{9}{\sin\theta}$`, r`$s=9\cos\theta$`],
      explain: r`The pole is opposite $\theta$ and the shadow is adjacent. $\tan\theta=\frac{9}{s}$, so $s=\frac{9}{\tan\theta}$. The expression $\frac{9}{\sin\theta}$ gives the length of the ray, the hypotenuse.` },

    // Solve
    { id: 'm-so-ineq', form: 'solve', topic: 'Inequalities', level: 'hard', type: 'num',
      stem: r`What is the greatest possible value of $x$ if $-2(3x-1)+4 \ge 2x-26$?`, answer: '4',
      explain: r`Expand: $-6x+2+4 \ge 2x-26$. So $-6x+6 \ge 2x-26$. Subtract $2x$ and subtract 6: $-8x \ge -32$. Divide by $-8$ and reverse the sign: $x \le 4$.` },
    { id: 'm-so-expr', form: 'solve', topic: 'Expressions', level: 'hard', type: 'num',
      stem: r`What is the value of $\dfrac{\frac{1}{x}-\frac{1}{5}}{x-5}$ when $x=2$?`, answer: '-1/10',
      explain: r`The top is $\frac{5-x}{5x}$. Since $5-x=-(x-5)$, dividing by $x-5$ leaves $-\frac{1}{5x}$. At $x=2$ the value is $-\frac{1}{10}$.` },
    { id: 'm-so-circle', form: 'solve', topic: 'Circles', level: 'hard', type: 'num',
      stem: r`The circle $x^2+y^2-4x+2y-20=0$ passes through $(5,3)$. What is the $y$-intercept of the line tangent to the circle at $(5,3)$?`, answer: '27/4',
      explain: r`Complete the squares: $(x-2)^2+(y+1)^2=25$, so the center is $(2,-1)$. The radius to $(5,3)$ has slope $\frac{4}{3}$, so the tangent has slope $-\frac{3}{4}$. At $x=0$: $y=3+\frac{15}{4}=\frac{27}{4}$.` },
    { id: 'm-so-growth', form: 'solve', topic: 'Growth and Decay', level: 'hard', type: 'num',
      stem: r`A quantity grows by 10 percent every 5 years. By what percent does it grow in 15 years?`, answer: '33.1', tol: 0.05,
      explain: r`15 years is 3 periods, and $1.1^3=1.331$. The total growth is 33.1 percent, which is more than $3\times 10$ because each step grows the previous amount.` }
  ];
})();
