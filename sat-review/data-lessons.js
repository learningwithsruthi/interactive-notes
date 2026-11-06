window.LWS = window.LWS || {};
(function () {
  const LWS = window.LWS;
  const r = String.raw;

  // SVG helpers. Plain concatenation on purpose so math strings stay free of template interpolation.
  const ACC = ' style="stroke:var(--accent)"';
  const ACC2 = ' style="stroke:var(--accent2)"';
  const SVG = (w, h, b) => '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img">' + b + '</svg>';
  const T = (x, y, s, o) => '<text x="' + x + '" y="' + y + '" fill="currentColor" font-size="14"' + (o ? ' ' + o : '') + '>' + s + '</text>';
  const TM = (x, y, s) => T(x, y, s, 'text-anchor="middle"');
  const L = (x1, y1, x2, y2, o) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="currentColor" stroke-width="1.6"' + (o || '') + '/>';
  const PATH = (d, o) => '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="1.8"' + (o || '') + '/>';
  const POLY = (pts, o) => '<polygon points="' + pts + '" fill="none" stroke="currentColor" stroke-width="1.8"' + (o || '') + '/>';
  const PL = (pts, o) => '<polyline points="' + pts + '" fill="none" stroke="currentColor" stroke-width="1.3"' + (o || '') + '/>';
  const C = (x, y, rad, o) => '<circle cx="' + x + '" cy="' + y + '" r="' + rad + '" fill="none" stroke="currentColor" stroke-width="1.8"' + (o || '') + '/>';
  const DOT = (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="3" fill="currentColor"/>';
  const TB = (head, rows) => '<table><tr>' + head.map(h => '<th>' + h + '</th>').join('') + '</tr>' +
    rows.map(row => '<tr>' + row.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</table>';

  // Five-number box plot. X maps a data value to a pixel; y is the box center.
  const BX = (X, y, v, o) => {
    const h = 12;
    return L(X(v[0]), y, X(v[1]), y, o) + L(X(v[3]), y, X(v[4]), y, o) +
      L(X(v[0]), y - 7, X(v[0]), y + 7, o) + L(X(v[4]), y - 7, X(v[4]), y + 7, o) +
      '<rect x="' + X(v[1]) + '" y="' + (y - h) + '" width="' + (X(v[3]) - X(v[1])) + '" height="' + (2 * h) + '" fill="none" stroke="currentColor" stroke-width="1.8"' + (o || '') + '/>' +
      L(X(v[2]), y - h, X(v[2]), y + h, o);
  };
  // Horizontal number axis with tick labels.
  const AX = (X, y, ticks) => L(X(ticks[0]), y, X(ticks[ticks.length - 1]), y) +
    ticks.map(t => L(X(t), y, X(t), y + 5) + TM(X(t), y + 20, t)).join('');
  // Light grid with tick labels placed at the axes.
  const GRID = (xt, yt, X, Y) => {
    const y0 = Y(Math.max(yt[0], 0)), x0 = X(Math.max(xt[0], 0));
    return xt.map(t => L(X(t), Y(yt[0]), X(t), Y(yt[yt.length - 1]), ' opacity="0.18"')).join('') +
      yt.map(t => L(X(xt[0]), Y(t), X(xt[xt.length - 1]), Y(t), ' opacity="0.18"')).join('') +
      L(X(xt[0]), y0, X(xt[xt.length - 1]), y0) + L(x0, Y(yt[0]), x0, Y(yt[yt.length - 1])) +
      xt.filter(t => t !== 0).map(t => TM(X(t), y0 + 17, t)).join('') +
      yt.filter(t => t !== 0).map(t => T(x0 - 7, Y(t) + 5, t, 'text-anchor="end"')).join('');
  };

  const birdsGraph = (() => {
    const X = x => 40 + 30 * x, Y = y => 240 - 5 * y;
    return SVG(360, 290,
      GRID([0, 2, 4, 6, 8, 10], [0, 10, 20, 30, 40], X, Y) + TM(40, 257, 0) +
      PATH('M40 140 Q190 -60 340 240', ACC) +
      DOT(40, 140) + DOT(160, 60) + TM(160, 50, '(4, 36)') +
      TM(190, 282, 'x, months after March 1') + T(8, 26, 'Birds'));
  })();

  const regionGraph = (() => {
    const X = x => 70 + (x + 2) * 30, Y = y => 150 - 18 * y;
    return SVG(340, 280,
      GRID([-2, 0, 2, 4, 6], [-6, -4, -2, 0, 2, 4, 6], X, Y) +
      L(X(-1), Y(-6), X(5), Y(6), ACC + ' stroke-dasharray="7 5"') +
      T(X(5) - 66, Y(6) + 2, 'boundary'));
  })();

  const busBoxes = (() => {
    const X = v => 40 + (v - 10) * 7;
    return SVG(360, 208,
      T(40, 32, 'Route A') + BX(X, 58, [12, 20, 26, 31, 44], ACC) +
      T(40, 97, 'Route B') + BX(X, 123, [18, 24, 30, 38, 40], ACC2) +
      AX(X, 158, [10, 20, 30, 40, 50]) + TM(180, 200, 'Commute time (minutes)'));
  })();

  const inscribedRect = SVG(300, 215,
    C(150, 110, 90) + POLY('72.1,65 227.9,65 227.9,155 72.1,155') +
    L(72.1, 155, 227.9, 65, ACC) +
    T(80, 114, 'w') + T(166, 84, '2w') + TM(150, 174, 'longer side') + DOT(150, 110));

  const bowtie = SVG(340, 225,
    L(40, 40, 60, 190) + L(280, 30, 300, 180) +
    L(40, 40, 300, 180) + L(60, 190, 280, 30) +
    PATH('M42.9 61.8 A22 22 0 0 0 59.4 50.4', ACC) +
    PATH('M262.2 42.9 A22 22 0 0 0 282.9 51.8', ACC) +
    T(26, 36, 'P') + T(44, 205, 'Q') + T(166, 92, 'R') + T(288, 24, 'S') + T(306, 192, 'T') +
    T(106, 66, '8') + T(118, 170, '10') + T(238, 88, '12') + T(235, 170, '?') +
    TM(170, 218, 'Not drawn to scale. Marked angles are equal.'));

  const tangents91215 = SVG(260, 240,
    C(100, 120, 72) + DOT(100, 120) + DOT(220, 120) +
    L(100, 120, 143.2, 62.4) + L(100, 120, 143.2, 177.6) +
    L(143.2, 62.4, 220, 120) + L(143.2, 177.6, 220, 120) +
    L(100, 120, 220, 120, ACC + ' stroke-dasharray="6 4"') +
    PL('137.2,70.4 145.2,76.4 151.2,68.4') + PL('137.2,169.6 145.2,163.6 151.2,171.6') +
    T(84, 125, 'O') + T(226, 125, 'P') + T(150, 50, 'A') + T(150, 198, 'B') +
    T(102, 90, '9') + T(158, 113, '?'));

  const tangents81517 = SVG(250, 240,
    C(90, 120, 64) + DOT(90, 120) + DOT(226, 120) +
    L(90, 120, 120.1, 63.5) + L(90, 120, 120.1, 176.5) +
    L(120.1, 63.5, 226, 120) + L(120.1, 176.5, 226, 120) +
    L(90, 120, 226, 120, ACC + ' stroke-dasharray="6 4"') +
    PL('115.4,72.3 124.2,77 128.9,68.2') + PL('115.4,167.7 124.2,163 128.9,171.8') +
    T(74, 125, 'O') + T(232, 125, 'P') + T(124, 52, 'A') + T(124, 198, 'B') +
    T(88, 92, '8') + T(170, 113, '17'));

  const rightTriangle81517 = SVG(310, 205,
    POLY('60,180 270,180 60,68') + PL('60,168 72,168 72,180') +
    PATH('M240 180 A30 30 0 0 1 243.5 166', ACC) +
    T(44, 185, 'C') + T(276, 185, 'A') + T(54, 60, 'B') +
    T(42, 130, '8') + T(158, 198, '15'));

  const chainTriangle = SVG(300, 225,
    POLY('60,190 260,190 60,40') + L(60, 40, 122.5, 190, ACC) + PL('60,178 72,178 72,190') +
    T(44, 195, 'C') + T(266, 195, 'B') + T(54, 32, 'A') + T(117, 210, 'D') +
    T(40, 120, '12') + T(98, 112, '13') + T(185, 210, '11'));

  const nestedTriangle = SVG(340, 240,
    POLY('170,30 50,210 290,210') + L(122, 102, 218, 102, ACC) + L(50, 210, 290, 210, ACC) +
    T(165, 22, 'A') + T(36, 222, 'B') + T(296, 222, 'C') + T(106, 102, 'D') + T(224, 102, 'E') +
    T(126, 64, '6') + T(66, 156, '9') + T(165, 96, '8') + T(165, 230, '?'));

  const thalesCircle = SVG(340, 290,
    C(170, 150, 130) + POLY('40,150 300,150 133.6,25.2') + L(133.6, 25.2, 133.6, 150, ACC) +
    PL('133.6,138 145.6,138 145.6,150') +
    T(22, 155, 'A') + T(306, 155, 'B') + T(124, 18, 'C') + T(128, 170, 'D') +
    T(66, 84, '15'));

  const pipeline = SVG(340, 60,
    '<rect x="5" y="8" width="95" height="44" fill="none" stroke="currentColor" stroke-width="1.6" style="stroke:var(--accent)"/>' +
    '<rect x="120" y="8" width="95" height="44" fill="none" stroke="currentColor" stroke-width="1.6" style="stroke:var(--accent)"/>' +
    '<rect x="235" y="8" width="95" height="44" fill="none" stroke="currentColor" stroke-width="1.6" style="stroke:var(--accent)"/>' +
    L(101, 30, 119, 30) + L(216, 30, 234, 30) +
    PATH('M113 25 L119 30 L113 35') + PATH('M228 25 L234 30 L228 35') +
    T(52, 35, 'Factor fully', 'text-anchor="middle" font-size="13"').replace('font-size="14" ', '') +
    T(167, 35, 'List excluded', 'text-anchor="middle" font-size="13"').replace('font-size="14" ', '') +
    T(282, 35, 'Then cancel', 'text-anchor="middle" font-size="13"').replace('font-size="14" ', ''));

  const specialTriangles = SVG(340, 180,
    POLY('30,150 168.6,150 30,70') + PL('30,140 40,140 40,150') +
    T(14, 115, '1') + T(90, 170, '&#8730;3') + T(106, 100, '2') + T(122, 146, '30&#176;') + T(35, 98, '60&#176;') +
    POLY('215,150 315,150 215,50') + PL('215,140 225,140 225,150') +
    T(200, 105, '1') + T(262, 170, '1') + T(272, 92, '&#8730;2') + T(262, 146, '45&#176;') + T(219, 92, '45&#176;'));

  const tangentCard = SVG(260, 200,
    C(80, 100, 56) + DOT(80, 100) + DOT(220, 100) +
    L(80, 100, 112, 54) + L(80, 100, 112, 146) + L(112, 54, 220, 100, ACC) + L(112, 146, 220, 100, ACC) +
    PL('105,62.5 114,68 120,57') + PL('105,137.5 114,132 120,143') +
    T(64, 105, 'O') + T(226, 105, 'P') + T(156, 62, 'equal') + T(156, 148, 'equal'));

  const boxCard = (() => {
    const X = v => 40 + (v - 10) * 6;
    return SVG(340, 115,
      BX(X, 50, [10, 20, 30, 40, 55], ACC) +
      TM(X(10), 24, 'min') + TM(X(20), 24, 'Q1') + TM(X(30), 24, 'median') + TM(X(40), 24, 'Q3') + TM(X(55), 24, 'max') +
      TM(X(20) + 60, 92, 'Box = IQR, middle 50 percent') +
      TM(X(20) + 60, 110, 'Whisker tip to whisker tip = range'));
  })();

  const treeBoxes = (() => {
    const X = v => 40 + (v - 10) * 5;
    return SVG(365, 170,
      T(40, 26, 'List A') + BX(X, 50, [20, 30, 40, 50, 70], ACC) +
      T(40, 86, 'List B') + BX(X, 108, [25, 35, 40, 45, 60], ACC2) +
      AX(X, 138, [20, 30, 40, 50, 60, 70]));
  })();

  const singleBox = (() => {
    const X = v => 40 + (v - 10) * 6;
    return SVG(340, 100, BX(X, 36, [10, 18, 24, 36, 50], ACC) + AX(X, 66, [10, 20, 30, 40, 50]));
  })();

  LWS.twins = [
    {
      id: 'twin-parabola-start', title: 'Birds at the Wetland', skill: 'Reading a parabola at x = 0', level: 'medium',
      trap: r`Giving the height of the peak when the question asks for the value on the start date.`,
      stem: r`The graph models the number of birds at a wetland $x$ months after March 1. According to the model, how many birds were at the wetland on March 1?`,
      diagram: birdsGraph,
      steps: [
        { say: r`March 1 is the starting date. What value of $x$ stands for March 1?`, type: 'num', answer: '0', prefix: r`$x=$`, hint: r`How many months after March 1 is March 1 itself?`, after: r`Zero months have passed, so March 1 is $x=0$. You want the point on the $y$-axis.` },
        { say: r`For comparison, find the maximum number of birds. This is the number the trap wants you to give.`, type: 'num', answer: '36', hint: r`Read the $y$-value at the very top of the curve, a little below the 40 line.`, after: r`The peak is at $(4, 36)$. That tells you the most birds and when it happened, four months later. It does not describe March 1.` },
        { say: r`Now read the graph where $x=0$. How many birds were there on March 1?`, type: 'num', answer: '20', hint: r`Look where the curve crosses the vertical axis.`, after: r`The curve meets the $y$-axis at $(0, 20)$, so the model gives 20 birds on March 1.` }
      ],
      takeaway: r`"At the start" means $x=0$, the $y$-intercept. "The most" means the vertex. Check which one the question wants.`
    },
    {
      id: 'twin-table-standard-form', title: 'Pages in a Reading Log', skill: 'Linear equation from a table', level: 'medium',
      trap: r`Getting the slope right, then moving the terms and dropping a sign on the constant.`,
      stem: r`A reader's log shows the total pages $p$ read after $w$ weeks. The relationship is linear. Which equation represents it?` + TB([r`$w$`, r`$p$`], [['2', '99'], ['5', '240'], ['9', '428']]),
      steps: [
        { say: r`Find the slope using the first two rows. How many pages per week?`, type: 'num', answer: '47', hint: r`Change in $p$ divided by change in $w$.`, after: r`$\frac{240-99}{5-2}=\frac{141}{3}=47$ pages per week.` },
        { say: r`Use $p=47w+b$ and the row $w=2$, $p=99$. What is $b$?`, type: 'num', answer: '5', prefix: r`$b=$`, hint: r`$99=47(2)+b$`, after: r`$99=94+b$, so $b=5$. Check the last row: $47(9)+5=428$.` },
        { say: r`Rewrite $p=47w+5$ with both variables on the left. Which equation matches?`, type: 'mc', choices: [r`$47w-p=-5$`, r`$47w-p=5$`, r`$47w+p=-5$`, r`$5w-p=-47$`], hint: r`Subtract $p$ from both sides, then subtract 5 from both sides.`, after: r`$p=47w+5$ becomes $0=47w-p+5$, so $47w-p=-5$. Test $w=2$, $p=99$: $94-99=-5$.` }
      ],
      takeaway: r`Build slope-intercept first, rearrange second, then test one table row in your answer.`
    },
    {
      id: 'twin-boxplot-ranges', title: 'Two Bus Routes', skill: 'Range from box plots', level: 'easy',
      trap: r`Using the width of the box, which is the IQR, in place of the range.`,
      stem: r`The box plots summarize commute times for two bus routes. What is the positive difference between the range of Route A and the range of Route B, in minutes?`,
      diagram: busBoxes,
      steps: [
        { say: r`Route A: the whisker tips are at 12 and 44. What is the range of Route A?`, type: 'num', answer: '32', hint: r`Maximum minus minimum, whisker tip to whisker tip.`, after: r`$44-12=32$ minutes.` },
        { say: r`Route B: the whisker tips are at 18 and 40. What is the range of Route B?`, type: 'num', answer: '22', hint: r`Ignore the box. Use the two ends.`, after: r`$40-18=22$ minutes.` },
        { say: r`What is the positive difference of the two ranges?`, type: 'num', answer: '10', hint: r`Larger range minus smaller range.`, after: r`$32-22=10$ minutes. The box widths would give 11 and 14, a difference of 3, which is the trap answer.` }
      ],
      takeaway: r`Range uses the whisker tips. The box is the IQR.`
    },
    {
      id: 'twin-sum-of-w', title: 'Sum of All w', skill: 'Zeros and shifted inputs', level: 'hard',
      trap: r`Forgetting the zero that comes from the lone factor of $x$, or counting the squared factor twice.`,
      stem: r`The function $g$ is defined by $g(x)=x(x-6)(x+4)^2$. If $g(9-w)=0$, what is the sum of all possible values of $w$?`,
      steps: [
        { say: r`How many different zeros does $g$ have?`, type: 'num', answer: '3', hint: r`Each factor gives one zero. A squared factor still gives only one distinct value.`, after: r`The zeros are $x=0$, $x=6$, and $x=-4$. Three distinct values.` },
        { say: r`The input $9-w$ must equal one of the zeros. Set $9-w=0$. What is $w$?`, type: 'num', answer: '9', prefix: r`$w=$`, hint: r`The lone $x$ out front is a factor too.`, after: r`$9-w=0$ gives $w=9$.` },
        { say: r`Set $9-w=6$. What is $w$?`, type: 'num', answer: '3', prefix: r`$w=$`, hint: r`Subtract 6 from 9.`, after: r`$w=9-6=3$.` },
        { say: r`Set $9-w=-4$. What is $w$?`, type: 'num', answer: '13', prefix: r`$w=$`, hint: r`Watch the double negative.`, after: r`$w=9-(-4)=13$.` },
        { say: r`Add all the values of $w$.`, type: 'num', answer: '25', hint: r`Add your three answers. The squared factor does not add a second copy.`, after: r`$9+3+13=25$.` }
      ],
      takeaway: r`Set the whole input equal to each distinct zero, including the zero from a lone $x$.`
    },
    {
      id: 'twin-given-that-rows', title: 'Orchard Rows', skill: 'Conditional probability', level: 'medium',
      trap: r`Dividing by every tree in the orchard when "given that" has already narrowed the group.`,
      stem: r`An orchard has 12 rows with 20 trees in each row. Of the trees in rows 1 through 4, a total of 30 are marked for pruning. In the other rows, 18 trees are marked. If a tree is chosen at random, what is the probability it is marked, given that it is in rows 1 through 4?`,
      steps: [
        { say: r`"Given that it is in rows 1 through 4." Which group is the denominator?`, type: 'mc', choices: [r`Only the trees in rows 1 through 4`, r`All the trees in the orchard`, r`Only the marked trees`, r`The trees outside rows 1 through 4`], hint: r`"Given that" tells you what you already know about the chosen tree.`, after: r`"Given that" shrinks the world to rows 1 through 4. Everything else disappears.` },
        { say: r`How many trees are in that group?`, type: 'num', answer: '80', hint: r`Number of rows times trees per row.`, after: r`$4\times 20=80$ trees.` },
        { say: r`How many marked trees are inside that group?`, type: 'num', answer: '30', hint: r`The other 18 are outside the group.`, after: r`Only the 30 count. The 18 are in other rows.` },
        { say: r`What is the probability? Fraction or decimal is fine.`, type: 'num', answer: '3/8', hint: r`Marked trees in the group over all trees in the group.`, after: r`$\frac{30}{80}=\frac{3}{8}$. The trap answers are $\frac{30}{240}$ and $\frac{48}{240}$.` }
      ],
      takeaway: r`The group after "given that" is your denominator.`
    },
    {
      id: 'twin-rect-in-circle', title: 'Rectangle Inside a Circle', skill: 'Inscribed rectangle, special right triangle', level: 'hard',
      trap: r`Using the area as if it were a side, or stopping at $w$ when the question asks for the diameter.`,
      stem: r`A rectangle is inscribed in a circle. The diagonal of the rectangle is twice as long as its shortest side. The area of the rectangle is $49\sqrt{3}$ square units. What is the diameter of the circle, in units?`,
      diagram: inscribedRect,
      steps: [
        { say: r`Call the shortest side $w$, so the diagonal is $2w$. What is the longer side, in terms of $w$?`, type: 'mc', choices: [r`$\sqrt{3}\,w$`, r`$\sqrt{2}\,w$`, r`$3w$`, r`$\sqrt{5}\,w$`], hint: r`Pythagorean theorem: $w^2+(\text{longer})^2=(2w)^2$.`, after: r`$(\text{longer})^2=4w^2-w^2=3w^2$, so the longer side is $\sqrt{3}\,w$. This is a 30-60-90 triangle.` },
        { say: r`Area is $w\cdot\sqrt{3}\,w=49\sqrt{3}$. What is $w^2$?`, type: 'num', answer: '49', prefix: r`$w^2=$`, hint: r`Divide both sides by $\sqrt{3}$.`, after: r`$\sqrt{3}\,w^2=49\sqrt{3}$, so $w^2=49$.` },
        { say: r`What is $w$?`, type: 'num', answer: '7', prefix: r`$w=$`, hint: r`A length is positive.`, after: r`$w=7$.` },
        { say: r`The diagonal of an inscribed rectangle is a diameter of the circle. What is the diameter?`, type: 'num', answer: '14', hint: r`The diagonal is $2w$.`, after: r`Diameter $=2w=14$. Check: the sides $7$ and $7\sqrt{3}$ have product $49\sqrt{3}$.` }
      ],
      takeaway: r`The diagonal of an inscribed rectangle is the diameter. Name the short side, then build everything from it.`
    },
    {
      id: 'twin-chained-percent', title: 'Chained Percents', skill: 'Percent of a sum', level: 'hard',
      trap: r`Multiplying 120 percent by 40 percent directly, even though $a$ depends on $b+c$ and not on $b$ alone.`,
      stem: r`The positive number $a$ is 120 percent of the sum of $b$ and $c$, and $b$ is 40 percent of $c$. The number $a$ is what percent of $b$?`,
      steps: [
        { say: r`Pick an easy number for the base of the question. Let $b=100$. Since $b=0.4c$, what is $c$?`, type: 'num', answer: '250', prefix: r`$c=$`, hint: r`$100=0.4c$. Divide by 0.4.`, after: r`$c=\frac{100}{0.4}=250$. Note that $c$ is bigger than $b$.` },
        { say: r`What is $b+c$?`, type: 'num', answer: '350', prefix: r`$b+c=$`, hint: r`Add your two numbers.`, after: r`$100+250=350$.` },
        { say: r`$a$ is 120 percent of that sum. What is $a$?`, type: 'num', answer: '420', prefix: r`$a=$`, hint: r`Multiply the sum by 1.2.`, after: r`$1.2\times 350=420$.` },
        { say: r`So $a$ is what percent of $b$?`, type: 'num', answer: '420', hint: r`The answer is $\frac{a}{b}\times 100$, and $b=100$.`, after: r`$\frac{420}{100}\times 100=420$ percent. Over 100 percent makes sense because $a$ is larger than $b$.` }
      ],
      takeaway: r`With chained percents, set the "of" quantity to 100 and walk through each sentence.`
    },
    {
      id: 'twin-bowtie', title: 'Bowtie Triangles', skill: 'Similar triangles, matching by angle', level: 'hard',
      trap: r`Matching sides by where they look like they sit in the picture instead of by which angles are equal.`,
      stem: r`Segments $PT$ and $QS$ intersect at $R$. Angle $RPQ$ and angle $RST$ have equal measure. If $PR=8$, $QR=10$, and $SR=12$, what is the length of $TR$?`,
      diagram: bowtie,
      steps: [
        { say: r`Why are the angles at $R$ in the two triangles equal?`, type: 'mc', choices: [r`They are vertical angles`, r`They are alternate interior angles`, r`They are both right angles`, r`The triangles are isosceles`], hint: r`Two straight segments cross at $R$.`, after: r`Crossing lines make equal vertical angles, so $\angle PRQ=\angle TRS$. Two pairs of equal angles means the triangles are similar.` },
        { say: r`The marked angle at $P$ equals the marked angle at $S$. So triangle $PQR$ is similar to which triangle, in matching order?`, type: 'mc', choices: [r`$\triangle STR$`, r`$\triangle TSR$`, r`$\triangle RST$`, r`$\triangle TRS$`], hint: r`$P$ goes with $S$, and $R$ goes with $R$. What is left for $Q$?`, after: r`$P\to S$, $R\to R$, so $Q\to T$. That gives $\triangle PQR\sim\triangle STR$.` },
        { say: r`Which side corresponds to $PR$?`, type: 'mc', choices: [r`$SR$`, r`$TR$`, r`$ST$`, r`$QR$`], hint: r`Use the matching order. $P\to S$ and $R\to R$.`, after: r`$PR\leftrightarrow SR$ and $QR\leftrightarrow TR$. It does not matter that $TR$ looks like it lines up with $PR$.` },
        { say: r`What is the scale factor from the left triangle to the right triangle?`, type: 'num', answer: '3/2', hint: r`Use $\frac{SR}{PR}$.`, after: r`$\frac{12}{8}=\frac{3}{2}$.` },
        { say: r`What is $TR$?`, type: 'num', answer: '15', prefix: r`$TR=$`, hint: r`$TR$ corresponds to $QR=10$.`, after: r`$TR=10\cdot\frac{3}{2}=15$. Matching by look would give 9.6, the trap answer.` }
      ],
      takeaway: r`Write the similarity statement in angle order first. Do not trust the picture.`
    },
    {
      id: 'twin-rational-table', title: 'Recover the Hidden Line', skill: 'Function from a table', level: 'hard',
      trap: r`Plugging $x=0$ into $g$ and reporting $g(0)$, which is not the $y$-intercept of $f$.`,
      stem: r`The function $g$ is defined by $g(x)=\frac{f(x)}{x+3}$, where $f$ is a linear function. The table shows values of $g$. What is the $y$-coordinate of the $y$-intercept of the graph of $y=f(x)$?` + TB([r`$x$`, r`$g(x)$`], [['-1', '6'], ['2', '3'], ['7', '2']]),
      steps: [
        { say: r`Undo the fraction: $f(x)=g(x)\cdot(x+3)$. What is $f(-1)$?`, type: 'num', answer: '12', prefix: r`$f(-1)=$`, hint: r`$6\cdot(-1+3)$`, after: r`$6\cdot 2=12$.` },
        { say: r`What is $f(2)$?`, type: 'num', answer: '15', prefix: r`$f(2)=$`, hint: r`$3\cdot(2+3)$`, after: r`$3\cdot 5=15$.` },
        { say: r`What is the slope of $f$?`, type: 'num', answer: '1', hint: r`Use the points $(-1, 12)$ and $(2, 15)$.`, after: r`$\frac{15-12}{2-(-1)}=\frac{3}{3}=1$. Check with $x=7$: $f(7)=2\cdot 10=20$, which fits a slope of 1 from $(2, 15)$.` },
        { say: r`So $f(x)=x+b$. What is the $y$-coordinate of the $y$-intercept?`, type: 'num', answer: '13', hint: r`Use $f(2)=15$ and solve for $b$.`, after: r`$15=2+b$, so $b=13$ and $f(x)=x+13$. The value $g(0)=\frac{13}{3}$ is not what is being asked.` }
      ],
      takeaway: r`Multiply back to get points on $f$ itself, then treat $f$ as an ordinary line.`
    },
    {
      id: 'twin-times-reverse', title: 'River Lengths', skill: 'Reverse percent comparison', level: 'medium',
      trap: r`Subtracting 25 from 100 to say 75 percent. Going backward changes the base.`,
      stem: r`The length of River A is $1.25$ times the length of River B. The length of River B is what percent of the length of River A?`,
      steps: [
        { say: r`Choose a simple length. Let River B be 100 miles. How long is River A?`, type: 'num', answer: '125', hint: r`Multiply 100 by 1.25.`, after: r`$1.25\times 100=125$ miles.` },
        { say: r`The question says "what percent of the length of River A." Which number goes in the denominator?`, type: 'num', answer: '125', hint: r`The quantity after the word "of" is the base.`, after: r`River A, which is 125, is the base here.` },
        { say: r`Write $\frac{\text{River B}}{\text{River A}}$ as a simplified fraction.`, type: 'num', answer: '4/5', hint: r`$\frac{100}{125}$`, after: r`$\frac{100}{125}=\frac{4}{5}$.` },
        { say: r`What percent is that?`, type: 'num', answer: '80', hint: r`Convert $\frac{4}{5}$ to a percent.`, after: r`$\frac{4}{5}=80$ percent, not 75. Also $\frac{1}{1.25}=0.8$.` }
      ],
      takeaway: r`"A is $k$ times B" means B is $\frac{1}{k}$ of A. Divide, never subtract.`
    },
    {
      id: 'twin-two-tangents', title: 'Kite From Two Tangents', skill: 'Tangents and Pythagorean triples', level: 'hard',
      trap: r`Forgetting that the radius meets a tangent at a right angle, or counting only one radius in the perimeter.`,
      stem: r`A circle has center $O$ and radius 9. Segments $PA$ and $PB$ are tangent to the circle at $A$ and $B$. The perimeter of quadrilateral $OAPB$ is 42. What is the distance from $O$ to $P$?`,
      diagram: tangents91215,
      steps: [
        { say: r`The two radii $OA$ and $OB$ together contribute how much to the perimeter?`, type: 'num', answer: '18', hint: r`Each radius is 9.`, after: r`$9+9=18$.` },
        { say: r`So what do $PA$ and $PB$ add up to?`, type: 'num', answer: '24', hint: r`Subtract from the perimeter.`, after: r`$42-18=24$.` },
        { say: r`Two tangents from one point are equal. What is $PA$?`, type: 'num', answer: '12', prefix: r`$PA=$`, hint: r`Split the sum in half.`, after: r`$PA=PB=12$.` },
        { say: r`What is the measure of angle $OAP$, in degrees?`, type: 'num', answer: '90', hint: r`A radius drawn to a point of tangency has a special relationship to the tangent.`, after: r`The radius is perpendicular to the tangent, so triangle $OAP$ has a right angle at $A$.` },
        { say: r`Find $OP$, the hypotenuse.`, type: 'num', answer: '15', prefix: r`$OP=$`, hint: r`Legs 9 and 12. This is a scaled 3-4-5.`, after: r`$\sqrt{9^2+12^2}=\sqrt{225}=15$.` }
      ],
      takeaway: r`Tangent problems: right angle at the touch point, equal tangents from one point.`
    },
    {
      id: 'twin-a-plus-b', title: 'Which Could Be a + b', skill: 'Quadratic from intercepts', level: 'hard',
      trap: r`Choosing the value for $a=1$, which the condition $a \gt 1$ rules out.`,
      stem: r`The function $f$ is defined by $f(x)=ax^2+bx+c$, where $a$, $b$, and $c$ are constants and $a$ is an integer greater than 1. The graph of $y=f(x)$ passes through $(-2, 0)$ and $(5, 0)$. Which of the following could be the value of $a+b$?`,
      steps: [
        { say: r`Write $f$ in factored form using the intercepts. Which is correct?`, type: 'mc', choices: [r`$f(x)=a(x+2)(x-5)$`, r`$f(x)=a(x-2)(x+5)$`, r`$f(x)=(x+2)(x-5)$`, r`$f(x)=a(x+2)(x+5)$`], hint: r`A zero at $x=-2$ comes from the factor $x+2$. Keep $a$ out front.`, after: r`Zeros at $-2$ and $5$ give $(x+2)(x-5)$. The constant $a$ stretches the graph without moving the zeros.` },
        { say: r`Expand. What is $b$ in terms of $a$?`, type: 'mc', choices: [r`$b=-3a$`, r`$b=3a$`, r`$b=-10a$`, r`$b=-3$`], hint: r`$(x+2)(x-5)=x^2-3x-10$. Now multiply by $a$.`, after: r`$f(x)=ax^2-3ax-10a$, so $b=-3a$.` },
        { say: r`Then $a+b$ equals what?`, type: 'mc', choices: [r`$-2a$`, r`$-3a$`, r`$4a$`, r`$-2$`], hint: r`Replace $b$ with $-3a$.`, after: r`$a+(-3a)=-2a$.` },
        { say: r`Since $a$ is an integer greater than 1, which value could $a+b$ equal?`, type: 'mc', choices: [r`$-6$`, r`$-2$`, r`$-5$`, r`$4$`], hint: r`Set $-2a$ equal to each choice and test whether $a$ is an integer above 1.`, after: r`$-2a=-6$ gives $a=3$, which works. The value $-2$ needs $a=1$, $-5$ needs $a=2.5$, and $4$ needs $a=-2$.` }
      ],
      takeaway: r`Intercepts give factored form with an unknown $a$ out front. Express everything in $a$, then test.`
    }
  ];

  LWS.lessons = [
    {
      id: 'ineq', title: 'Linear Inequalities: The Flip',
      report: r`Linear inequalities: 2 of 4 correct, missed one easy and one hard.`,
      why: r`An easy miss here is a leak in the core rule, not a hard concept. Fixing the flip gets back points you already know how to earn.`,
      idea: [
        r`<p><b>The one rule.</b> Solve an inequality like an equation, with one exception. When you multiply or divide both sides by a negative number, the sign flips.</p><p>Why: $2 \lt 5$ is true. Multiply by $-1$ and you get $-2$ and $-5$, and now $-2 \gt -5$. The order reversed.</p>`,
        r`<p><b>Worked example.</b> Solve $-3x+5 \gt 17$.</p><p>Subtract 5: $-3x \gt 12$.</p><p>Divide by $-3$ and flip: $x \lt -4$.</p><p>Test $x=-5$: $-3(-5)+5=20$, and $20 \gt 17$. It works.</p>`,
        r`<p><b>Two variables.</b> Solve for $y$ first, flipping if you divide by a negative. Then $y \gt$ means above the line and $y \lt$ means below it. A strict sign gives a dashed line, so points on the line do not count.</p><p>Example: $2x-y \lt 3$ becomes $-y \lt -2x+3$, then $y \gt 2x-3$.</p>`,
        r`<p><b>Word problems.</b> "At least" means $\ge$. "At most" means $\le$. "More than" means $\gt$.</p><p>If the answer must be a whole number, round toward the allowed side. If $t \lt 8.5$, the greatest whole value is 8.</p>`
      ],
      widget: 'numberline',
      guided: [
        {
          id: 'ineq-g1', title: 'One Clean Flip', skill: 'Flip when dividing by a negative', level: 'easy',
          stem: r`What is the greatest integer $x$ that satisfies $-4x+7 \gt 23$?`,
          steps: [
            { say: r`Subtract 7 from both sides. Fill in the right side.`, type: 'num', answer: '16', prefix: r`$-4x \gt$`, hint: r`$23-7$`, after: r`$-4x \gt 16$. Subtracting a positive does not touch the sign.` },
            { say: r`You are about to divide by $-4$. What must happen to the inequality sign? One word.`, type: 'text', answers: ['flip', 'flips', 'reverse', 'reverses', 'switch', 'switches', 'change', 'changes'], hint: r`You are dividing by a negative number.`, after: r`It flips.` },
            { say: r`Which is the solution?`, type: 'mc', choices: [r`$x \lt -4$`, r`$x \gt -4$`, r`$x \lt 4$`, r`$x \gt 4$`], hint: r`$16\div(-4)=-4$, and the sign flips from $\gt$ to $\lt$.`, after: r`$x \lt -4$. Test $x=-5$: $20+7=27$, and $27 \gt 23$.` },
            { say: r`What is the greatest integer that satisfies it?`, type: 'num', answer: '-5', prefix: r`$x=$`, hint: r`$-4$ itself is not allowed. Which integer is just below it?`, after: r`The integers below $-4$ are $-5, -6, \ldots$, and $-5$ is the greatest.` }
          ],
          takeaway: r`Negative divisor, flip the sign. Then test a value.`
        },
        {
          id: 'ineq-g2', title: 'Which Side of the Line', skill: 'Two-variable inequality region', level: 'medium',
          stem: r`Which point $(x, y)$ is a solution to the inequality $6x-3y \lt 12$?`,
          diagram: regionGraph,
          steps: [
            { say: r`Subtract $6x$ from both sides. Which is correct?`, type: 'mc', choices: [r`$-3y \lt -6x+12$`, r`$-3y \gt -6x+12$`, r`$3y \lt -6x+12$`, r`$-3y \lt 6x+12$`], hint: r`Subtracting does not flip the sign.`, after: r`$-3y \lt -6x+12$. No flip yet.` },
            { say: r`Divide every term by $-3$. Which is correct?`, type: 'mc', choices: [r`$y \gt 2x-4$`, r`$y \lt 2x-4$`, r`$y \gt -2x+4$`, r`$y \lt -2x-4$`], hint: r`Divide each term by $-3$, and flip the sign.`, after: r`$y \gt 2x-4$. Every term changes sign and the inequality flips.` },
            { say: r`The boundary $y=2x-4$ is drawn. Which description is correct?`, type: 'mc', choices: [r`Above the line, line not included`, r`Above the line, line included`, r`Below the line, line not included`, r`Below the line, line included`], hint: r`$y$ is greater than the line's value, and the sign is strict.`, after: r`$y \gt$ means above. The strict sign means a dashed line, so a point exactly on it fails.` },
            { say: r`Which point is a solution?`, type: 'mc', choices: [r`$(1, 0)$`, r`$(2, 0)$`, r`$(3, 1)$`, r`$(4, 2)$`], hint: r`Substitute each point into $y \gt 2x-4$. A point on the line does not count.`, after: r`$(1, 0)$: $0 \gt -2$ is true. $(2, 0)$ is on the line, and $(3, 1)$ and $(4, 2)$ are below it.` }
          ],
          takeaway: r`Isolate $y$ with the flip, then above means greater and below means less.`
        },
        {
          id: 'ineq-g3', title: 'Two Tanks', skill: 'Inequality word problem', level: 'hard',
          stem: r`Tank A holds 480 liters and drains at 15 liters per minute. At the same moment, Tank B holds 60 liters and fills at 9 liters per minute. What is the greatest whole number of minutes $t$ for which Tank A still holds more water than Tank B?`,
          steps: [
            { say: r`Which inequality models "Tank A holds more than Tank B"?`, type: 'mc', choices: [r`$480-15t \gt 60+9t$`, r`$480+15t \gt 60-9t$`, r`$480-15t \lt 60+9t$`, r`$480-9t \gt 60+15t$`], hint: r`Draining subtracts from 480. Filling adds to 60.`, after: r`Tank A is $480-15t$ and Tank B is $60+9t$.` },
            { say: r`Move the $t$ terms to the left and the numbers to the right: $-24t \gt$ what?`, type: 'num', answer: '-420', prefix: r`$-24t \gt$`, hint: r`$60-480$`, after: r`Subtract $9t$ and subtract 480: $-24t \gt -420$.` },
            { say: r`Solve for $t$.`, type: 'mc', choices: [r`$t \lt 17.5$`, r`$t \gt 17.5$`, r`$t \lt -17.5$`, r`$t \gt -17.5$`], hint: r`Divide by $-24$. Negative over negative is positive, and the sign flips.`, after: r`$t \lt \frac{420}{24}=17.5$.` },
            { say: r`What is the greatest whole number of minutes?`, type: 'num', answer: '17', hint: r`Round toward the allowed side.`, after: r`At $t=17$: A has 225 and B has 213. At $t=18$: A has 210 and B has 222. So the answer is 17.` }
          ],
          takeaway: r`Write each quantity first, compare them second, and round toward the allowed side.`
        }
      ]
    },
    {
      id: 'equiv', title: 'Equivalent Expressions and Excluded Values',
      report: r`Equivalent expressions: 3 of 4 correct, missed one medium.`,
      why: r`You already know most of this. The last point comes from a fixed order of steps, so compound fractions and excluded values stop being a coin flip.`,
      idea: [
        r`<p><b>The order never changes.</b></p>` + pipeline + r`<p>Find excluded values before you cancel. A cancelled factor still makes the original expression undefined.</p>`,
        r`<p><b>Worked example.</b> Simplify $\frac{x^2-4x}{x^2-16}$.</p>` + TB(['Step', 'Result'], [['Factor fully', r`$\frac{x(x-4)}{(x-4)(x+4)}$`], ['Excluded values', r`$x\ne 4$, $x\ne -4$`], ['Cancel', r`$\frac{x}{x+4}$`]]),
        r`<p><b>Cancel factors, never terms.</b> Only a piece multiplied by everything can cancel. In $\frac{x+6}{6}$ the 6 does not cancel, because it is added.</p><p>Test with $x=6$: $\frac{6+6}{6}=2$, not 6.</p>`,
        r`<p><b>Compound fractions.</b> Combine the bottom into one fraction, then flip it.</p><p>$\frac{1}{\frac{1}{x}+\frac{1}{3}}=\frac{1}{\frac{3+x}{3x}}=\frac{3x}{x+3}$</p><p>Excluded: $x=0$ and $x=-3$. Check $x=3$: the original gives $\frac{1}{2/3}=\frac{3}{2}$, and $\frac{9}{6}=\frac{3}{2}$.</p>`
      ],
      widget: null,
      guided: [
        {
          id: 'equiv-g1', title: 'Pull Out the Common Factor', skill: 'Factor then cancel', level: 'easy',
          stem: r`Which expression is equivalent to $\frac{6x}{3x-12}$ for all values of $x$ where it is defined, and what value of $x$ makes the original undefined?`,
          steps: [
            { say: r`Factor the denominator as $k(x-4)$. What is $k$?`, type: 'num', answer: '3', prefix: r`$k=$`, hint: r`What divides both $3x$ and 12?`, after: r`$3x-12=3(x-4)$.` },
            { say: r`Now cancel. Which is the simplified form?`, type: 'mc', choices: [r`$\frac{2x}{x-4}$`, r`$\frac{2}{x-4}$`, r`$\frac{2x}{x-12}$`, r`$\frac{x}{x-4}$`], hint: r`$\frac{6x}{3(x-4)}$, and $6\div 3=2$.`, after: r`$\frac{6x}{3(x-4)}=\frac{2x}{x-4}$.` },
            { say: r`What value of $x$ makes the expression undefined?`, type: 'num', answer: '4', prefix: r`$x=$`, hint: r`Set the denominator equal to 0.`, after: r`$3x-12=0$ gives $x=4$.` }
          ],
          takeaway: r`Pull out the common number first. Undefined means the denominator is 0.`
        },
        {
          id: 'equiv-g2', title: 'The Cancelled Factor Still Counts', skill: 'Excluded values', level: 'medium',
          stem: r`The expression $\frac{x^2-9}{x^2-2x-15}$ is undefined for how many values of $x$, and what is the positive one?`,
          steps: [
            { say: r`Factor the numerator.`, type: 'mc', choices: [r`$(x-3)(x+3)$`, r`$(x-3)^2$`, r`$(x-9)(x+1)$`, r`$x(x-9)$`], hint: r`Difference of squares.`, after: r`$x^2-9=(x-3)(x+3)$.` },
            { say: r`Factor the denominator.`, type: 'mc', choices: [r`$(x-5)(x+3)$`, r`$(x+5)(x-3)$`, r`$(x-15)(x+1)$`, r`$(x-5)(x-3)$`], hint: r`Two numbers that multiply to $-15$ and add to $-2$.`, after: r`$-5$ and $3$ work, so the denominator is $(x-5)(x+3)$.` },
            { say: r`Which is the simplified form?`, type: 'mc', choices: [r`$\frac{x-3}{x-5}$`, r`$\frac{x+3}{x-5}$`, r`$\frac{x-3}{x+5}$`, r`$\frac{9}{2x+15}$`], hint: r`Cancel the common factor $(x+3)$.`, after: r`$\frac{(x-3)(x+3)}{(x-5)(x+3)}=\frac{x-3}{x-5}$.` },
            { say: r`How many values of $x$ make the original expression undefined?`, type: 'num', answer: '2', hint: r`Use the original denominator, before cancelling.`, after: r`$(x-5)(x+3)=0$ at $x=5$ and $x=-3$. The simplified form hides the $-3$.` },
            { say: r`What is the positive excluded value?`, type: 'num', answer: '5', prefix: r`$x=$`, hint: r`Of the two values, which is positive?`, after: r`$x=5$.` }
          ],
          takeaway: r`Read excluded values from the original denominator, before you cancel.`
        },
        {
          id: 'equiv-g3', title: 'Fraction Inside a Fraction', skill: 'Compound fractions', level: 'hard',
          stem: r`Consider the expression $\frac{1}{\frac{1}{x+2}+\frac{1}{x-2}}$. Which simplified form is equivalent, and how many real values of $x$ must be excluded from the original?`,
          steps: [
            { say: r`What common denominator do the two small fractions need?`, type: 'mc', choices: [r`$(x+2)(x-2)$`, r`$2x$`, r`$x+2$`, r`$4$`], hint: r`Multiply the two different denominators.`, after: r`Use $(x+2)(x-2)$, which equals $x^2-4$.` },
            { say: r`Add the small fractions. What is the new numerator?`, type: 'mc', choices: [r`$2x$`, r`$2$`, r`$4$`, r`$-4$`], hint: r`$(x-2)+(x+2)$`, after: r`$(x-2)+(x+2)=2x$, so the bottom is $\frac{2x}{x^2-4}$.` },
            { say: r`Flip it. Which form is equivalent to the whole expression?`, type: 'mc', choices: [r`$\frac{x^2-4}{2x}$`, r`$\frac{2x}{x^2-4}$`, r`$\frac{x^2-4}{2}$`, r`$2x\left(x^2-4\right)$`], hint: r`1 divided by a fraction is its reciprocal.`, after: r`$\frac{1}{\frac{2x}{x^2-4}}=\frac{x^2-4}{2x}$.` },
            { say: r`Which value is the easy one to miss, because it only appears after you combine the fractions?`, type: 'num', answer: '0', prefix: r`$x=$`, hint: r`When does the combined bottom $\frac{2x}{x^2-4}$ equal 0?`, after: r`At $x=0$ the bottom is $\frac{1}{2}+\frac{1}{-2}=0$, so the whole expression divides by 0.` },
            { say: r`How many real values must be excluded from the original?`, type: 'num', answer: '3', hint: r`Count each small denominator being 0, plus the bottom sum being 0.`, after: r`$x=-2$, $x=2$, and $x=0$. Three values.` }
          ],
          takeaway: r`Combine the bottom, flip, and count every place a division by 0 can happen.`
        }
      ]
    },
    {
      id: 'growth', title: 'Growth and Decay Word Problems',
      report: r`Nonlinear functions: 4 of 8 correct, missed two medium and two hard, mostly word problems.`,
      why: r`This is your largest group of missed points, and the misses cluster on word problems. The work here is translating the sentence into a multiplier and an exponent.`,
      idea: [
        r`<p><b>Percent to multiplier.</b> Say the sentence, then write one number.</p>` + TB(['Sentence', 'Multiplier'], [['Grows 7 percent', r`$1.07$`], ['Falls 7 percent', r`$0.93$`], ['Doubles', r`$2$`], ['Halves', r`$0.5$`]]),
        r`<p><b>The model.</b> Amount $=$ start $\times$ (multiplier)$^{\text{number of periods}}$.</p><p>Everything hard in these problems lives in the exponent, because the exponent counts periods and not always units of time.</p>`,
        r`<p><b>Time intervals.</b></p>` + TB(['Sentence', 'Exponent'], [['Every 3 years, $t$ in years', r`$\frac{t}{3}$`], ['Every month, $t$ in years', r`$12t$`], ['Half-life 5 days, $t$ in days', r`$\frac{t}{5}$`]]) + r`<p>Check: plug in one period of time. The exponent should come out to 1. With $t=3$, $\frac{t}{3}=1$.</p>`,
        r`<p><b>Worked example.</b> A pond has 400 fish and the count grows 50 percent every 2 years.</p><p>Model: $400(1.5)^{t/2}$.</p><p>After 4 years: $400(1.5)^2=400(2.25)=900$ fish.</p>`,
        r`<p><b>Linear or exponential?</b> Same amount each period means linear. Same percent each period means exponential.</p>`
      ],
      widget: 'growth',
      guided: [
        {
          id: 'growth-g1', title: 'Yearly Growth', skill: 'Percent to multiplier', level: 'easy',
          stem: r`A town has 5,000 residents, and the population grows by 10 percent each year. What will the population be after 2 years?`,
          steps: [
            { say: r`What is the yearly multiplier?`, type: 'num', answer: '1.1', hint: r`Keep the original 100 percent and add 10 percent.`, after: r`$100\%+10\%=110\%$, which is $1.10$.` },
            { say: r`Which model gives the population after $t$ years?`, type: 'mc', choices: [r`$5000(1.1)^t$`, r`$5000(0.1)^t$`, r`$5000+1.1t$`, r`$5000(1.1t)$`], hint: r`Same percent each year means exponential.`, after: r`Start times multiplier to the number of years: $5000(1.1)^t$.` },
            { say: r`What is the population after 2 years?`, type: 'num', answer: '6050', hint: r`$5000(1.1)^2$, and $(1.1)^2=1.21$.`, after: r`$5000(1.21)=6050$. Adding 500 each year would wrongly give 6000.` }
          ],
          takeaway: r`Percent growth multiplies. It does not add the same amount each time.`
        },
        {
          id: 'growth-g2', title: 'Every Three Years', skill: 'Exponent t/3', level: 'medium',
          stem: r`A machine is worth ¤50,000 when new. Its value drops by 20 percent every 3 years. What is it worth 9 years after it is new, in dollars?`,
          steps: [
            { say: r`What is the multiplier for each 3-year period?`, type: 'num', answer: '0.8', hint: r`Falling 20 percent leaves what percent?`, after: r`$100\%-20\%=80\%$, which is $0.8$. The trap is writing $0.2$.` },
            { say: r`With $t$ in years, which exponent counts the periods?`, type: 'mc', choices: [r`$\frac{t}{3}$`, r`$3t$`, r`$t$`, r`$t-3$`], hint: r`When $t=3$, exactly one drop should have happened.`, after: r`$\frac{3}{3}=1$. So $V=50000(0.8)^{t/3}$.` },
            { say: r`How many 3-year periods are in 9 years?`, type: 'num', answer: '3', hint: r`$\frac{9}{3}$`, after: r`$\frac{9}{3}=3$ periods.` },
            { say: r`What is the value after 9 years?`, type: 'num', answer: '25600', prefix: r`¤`, hint: r`$50000(0.8)^3$, and $(0.8)^3=0.512$.`, after: r`$50000(0.512)=25600$.` }
          ],
          takeaway: r`The exponent counts drops, not years. Plug in one period to check it equals 1.`
        },
        {
          id: 'growth-g3', title: 'Half-Life in Days', skill: 'Half-life with a unit change', level: 'hard',
          stem: r`A lab sample starts at 640 milligrams and has a half-life of 6 hours. Which function gives the mass $M$ after $d$ days, and what is the mass after 1.5 days?`,
          steps: [
            { say: r`What is the multiplier for each half-life period?`, type: 'num', answer: '1/2', hint: r`Half-life means half remains.`, after: r`Each period multiplies the mass by $\frac{1}{2}$.` },
            { say: r`How many 6-hour periods are in one day?`, type: 'num', answer: '4', hint: r`$\frac{24}{6}$`, after: r`$\frac{24}{6}=4$ periods per day.` },
            { say: r`Which function gives the mass after $d$ days?`, type: 'mc', choices: [r`$M=640\left(\frac{1}{2}\right)^{4d}$`, r`$M=640\left(\frac{1}{2}\right)^{d/4}$`, r`$M=640\left(\frac{1}{2}\right)^{6d}$`, r`$M=640\left(\frac{1}{4}\right)^{d}$`], hint: r`In $d$ days there are 4 times $d$ halvings.`, after: r`Check $d=1$: four halvings in one day, and $4(1)=4$.` },
            { say: r`How many halvings happen in 1.5 days?`, type: 'num', answer: '6', hint: r`Use the exponent $4d$ with $d=1.5$.`, after: r`$4(1.5)=6$. That matches 36 hours divided by 6.` },
            { say: r`What is the mass after 1.5 days, in milligrams?`, type: 'num', answer: '10', hint: r`Halve 640 six times.`, after: r`$640\to 320\to 160\to 80\to 40\to 20\to 10$.` }
          ],
          takeaway: r`Convert units inside the exponent: periods per unit of time, times the time.`
        }
      ]
    },
    {
      id: 'percent', title: 'Percent Change and Working Backward',
      report: r`Percentages: 1 of 2 correct, missed one medium.`,
      why: r`Percents show up inside word problems across the whole test. Choosing the right base and using multipliers will help in more than one question type.`,
      idea: [
        r`<p><b>The base is the starting value.</b> Percent change $=\frac{\text{change}}{\text{original}}\times 100$.</p><p>50 to 60 is up 20 percent. 60 to 50 is down about 16.7 percent. Same gap, different base.</p>`,
        r`<p><b>Successive changes multiply.</b> Up 10 percent then down 10 percent is $1.1\times 0.9=0.99$. That is a net loss of 1 percent, not zero.</p>`,
        r`<p><b>Working backward.</b> Divide by the multiplier.</p><p>After 25 percent off, a price is ¤60. So $0.75x=60$ and $x=80$. Adding 25 percent back gives 75, which is wrong because the 25 percent was taken from the original and not from 60.</p>`,
        r`<p><b>Pick 100.</b> When no actual amounts are given, let the starting value be 100 and follow the sentences.</p>`
      ],
      widget: 'percent',
      guided: [
        {
          id: 'percent-g1', title: 'Same Gap, Different Base', skill: 'Choosing the base', level: 'easy',
          stem: r`A membership rose from ¤80 to ¤100. Later it fell from ¤100 back to ¤80. What was the percent increase, and what was the percent decrease?`,
          steps: [
            { say: r`What was the change in dollars?`, type: 'num', answer: '20', prefix: r`¤`, hint: r`$100-80$`, after: r`The change is 20 both ways.` },
            { say: r`For the increase, which number is the base?`, type: 'mc', choices: [r`$80$, the value it started from`, r`$100$, the value it ended at`, r`$20$, the change`, r`$180$, the sum`], hint: r`Percent change compares to where it started.`, after: r`The rise started at 80, so the base is 80.` },
            { say: r`What is the percent increase?`, type: 'num', answer: '25', hint: r`$\frac{20}{80}\times 100$`, after: r`$\frac{20}{80}=25$ percent.` },
            { say: r`What is the percent decrease from 100 back to 80?`, type: 'num', answer: '20', hint: r`The drop starts at 100 now.`, after: r`$\frac{20}{100}=20$ percent. Same dollars, new base.` }
          ],
          takeaway: r`The base is always where the change started.`
        },
        {
          id: 'percent-g2', title: 'Up Then Down', skill: 'Successive percent changes', level: 'medium',
          stem: r`The number of visitors to a museum rose 30 percent in spring and then fell 30 percent in summer. The final count is what percent less than the original count?`,
          steps: [
            { say: r`What is the multiplier for the rise?`, type: 'num', answer: '1.3', hint: r`$100\%+30\%$`, after: r`$1.30$.` },
            { say: r`What is the multiplier for the fall?`, type: 'num', answer: '0.7', hint: r`$100\%-30\%$`, after: r`$0.70$.` },
            { say: r`What is the combined multiplier?`, type: 'num', answer: '0.91', hint: r`Multiply them. Do not add the percents.`, after: r`$1.3\times 0.7=0.91$.` },
            { say: r`The final count is what percent less than the original?`, type: 'num', answer: '9', hint: r`Compare 0.91 to 1.`, after: r`$1-0.91=0.09$, so 9 percent less. With 100 visitors: 130, then 91.` }
          ],
          takeaway: r`Successive percents multiply. Plus 30 and minus 30 do not cancel.`
        },
        {
          id: 'percent-g3', title: 'Back to the Tag Price', skill: 'Reverse a chain of percents', level: 'hard',
          stem: r`A store takes 20 percent off the tag price of a backpack. Then an 8 percent sales tax is added to the reduced price. The customer pays ¤108. What was the tag price, in dollars?`,
          steps: [
            { say: r`What is the multiplier for 20 percent off?`, type: 'num', answer: '0.8', hint: r`20 percent off leaves what percent?`, after: r`$0.80$.` },
            { say: r`What is the multiplier for 8 percent tax?`, type: 'num', answer: '1.08', hint: r`Keep the price and add 8 percent.`, after: r`$1.08$.` },
            { say: r`What is the combined multiplier?`, type: 'num', answer: '0.864', hint: r`$0.8\times 1.08$`, after: r`$0.864$. Adding the percents would give 0.88, and that is the trap.` },
            { say: r`Solve $0.864x=108$. What was the tag price?`, type: 'num', answer: '125', prefix: r`¤`, hint: r`Divide 108 by the combined multiplier.`, after: r`$\frac{108}{0.864}=125$. Check: $125\to 100\to 108$.` }
          ],
          takeaway: r`Build the multiplier forward, then divide to go backward.`
        }
      ]
    },
    {
      id: 'circle', title: 'Circle Equations: Completing the Square',
      report: r`Circles: 1 of 3 correct, missed two hard.`,
      why: r`These look long but follow one routine every time. Hard questions on circles become reliable points once the routine is automatic.`,
      idea: [
        r`<p><b>Standard form.</b> $(x-h)^2+(y-k)^2=r^2$ has center $(h, k)$ and radius $r$.</p><p>The signs inside flip for the center. The right side is $r^2$, not $r$.</p>`,
        r`<p><b>Completing the square.</b> Halve the coefficient, square it, add it to both sides.</p><p>For $x^2+8x$: half of 8 is 4, and $4^2=16$. So $x^2+8x+16=(x+4)^2$.</p>`,
        r`<p><b>Worked example.</b> $x^2+y^2+4x-6y-3=0$</p><p>Move the constant: $x^2+4x+y^2-6y=3$.</p><p>Add 4 and 9 to both sides: $(x+2)^2+(y-3)^2=16$.</p><p>Center $(-2, 3)$, radius $4$.</p>`,
        r`<p><b>Two traps.</b> The $x^2$ and $y^2$ coefficients must be 1, so divide first if they are not. And whatever you add on the left must also go on the right.</p>`
      ],
      widget: 'circle',
      guided: [
        {
          id: 'circle-g1', title: 'Find the Radius', skill: 'Completing the square', level: 'medium',
          stem: r`A circle has the equation $x^2+y^2-6x+4y-12=0$. What is its radius?`,
          steps: [
            { say: r`For $x^2-6x$: halve $-6$ and square it. What do you add?`, type: 'num', answer: '9', hint: r`Half of $-6$ is $-3$.`, after: r`$(-3)^2=9$, so $x^2-6x+9=(x-3)^2$.` },
            { say: r`For $y^2+4y$: what do you add?`, type: 'num', answer: '4', hint: r`Half of 4 is 2.`, after: r`$2^2=4$, so $y^2+4y+4=(y+2)^2$.` },
            { say: r`Move the 12 to the right, and add both numbers there too. What is $r^2$?`, type: 'num', answer: '25', prefix: r`$r^2=$`, hint: r`$12+9+4$`, after: r`$(x-3)^2+(y+2)^2=25$.` },
            { say: r`What is the radius?`, type: 'num', answer: '5', prefix: r`$r=$`, hint: r`The right side is $r^2$.`, after: r`$r=5$. The center is $(3, -2)$.` }
          ],
          takeaway: r`Halve, square, add to both sides, then square root the right side.`
        },
        {
          id: 'circle-g2', title: 'Center and Radius', skill: 'Reading the center', level: 'hard',
          stem: r`A circle has the equation $x^2+y^2+10x-8y+5=0$. Find its center and radius. What is the radius?`,
          steps: [
            { say: r`Complete the square for $x^2+10x$. What is the $x$-coordinate of the center?`, type: 'num', answer: '-5', prefix: r`$h=$`, hint: r`$x^2+10x+25=(x+5)^2$. The center sign flips.`, after: r`$(x+5)^2=(x-(-5))^2$, so $h=-5$.` },
            { say: r`Complete the square for $y^2-8y$. What is the $y$-coordinate of the center?`, type: 'num', answer: '4', prefix: r`$k=$`, hint: r`$y^2-8y+16=(y-4)^2$.`, after: r`$k=4$.` },
            { say: r`Move the 5 and add 25 and 16 to the right side. What is $r^2$?`, type: 'num', answer: '36', prefix: r`$r^2=$`, hint: r`The 5 moves over as $-5$.`, after: r`$-5+25+16=36$.` },
            { say: r`What is the radius?`, type: 'num', answer: '6', prefix: r`$r=$`, hint: r`Square root of $r^2$.`, after: r`$r=6$. Center $(-5, 4)$.` }
          ],
          takeaway: r`A positive constant on the left becomes negative on the right.`
        },
        {
          id: 'circle-g3', title: 'Leading Coefficient of 2', skill: 'Divide first, then complete the square', level: 'hard',
          stem: r`The graph of $2x^2+2y^2-12x+20y=c$ in the $xy$-plane is a circle with radius 7. What is the value of $c$?`,
          steps: [
            { say: r`Divide every term by 2. What is the coefficient of $x$ now?`, type: 'num', answer: '-6', hint: r`$-12\div 2$`, after: r`$x^2+y^2-6x+10y=\frac{c}{2}$.` },
            { say: r`What do you add to complete the square for $x^2-6x$?`, type: 'num', answer: '9', hint: r`$(-3)^2$`, after: r`$(x-3)^2$ needs a 9.` },
            { say: r`What do you add to complete the square for $y^2+10y$?`, type: 'num', answer: '25', hint: r`$5^2$`, after: r`$(y+5)^2$ needs a 25.` },
            { say: r`Now $(x-3)^2+(y+5)^2=\frac{c}{2}+34$, and the radius is 7. What is $\frac{c}{2}$?`, type: 'num', answer: '15', prefix: r`$\frac{c}{2}=$`, hint: r`$\frac{c}{2}+34=7^2$`, after: r`$\frac{c}{2}+34=49$, so $\frac{c}{2}=15$.` },
            { say: r`What is $c$?`, type: 'num', answer: '30', prefix: r`$c=$`, hint: r`Do not stop at $\frac{c}{2}$.`, after: r`$c=30$.` }
          ],
          takeaway: r`Make the squared coefficients 1 before anything else, and track what the question calls $c$.`
        }
      ]
    },
    {
      id: 'trig', title: 'Right Triangles and Trig',
      report: r`Right triangles and trigonometry: 1 of 2 correct, missed one medium.`,
      why: r`The test uses a small set of moves. Choose the ratio from the angle, chain the Pythagorean theorem, and use the cofunction rule.`,
      idea: [
        r`<p><b>Label from the angle.</b> Opposite and adjacent depend on which angle you stand at. Sine is opposite over hypotenuse, cosine is adjacent over hypotenuse, tangent is opposite over adjacent.</p>`,
        r`<p><b>Cofunctions.</b> In a right triangle the two small angles add to $90^\circ$, so $\sin(x^\circ)=\cos((90-x)^\circ)$.</p><p>Example: $\sin 25^\circ=\cos 65^\circ$.</p>`,
        r`<p><b>Special triangles.</b> Sides in these ratios.</p>` + specialTriangles,
        r`<p><b>Chaining.</b> When two right triangles share a side, find that side in one and carry it to the other. Learn these triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25.</p>`
      ],
      widget: 'trig',
      guided: [
        {
          id: 'trig-g1', title: 'Choosing the Ratio', skill: 'Sine from sides', level: 'easy',
          stem: r`In right triangle $ABC$, angle $C$ is the right angle, $BC=8$, and $AC=15$. What is the value of $\sin A$?`,
          diagram: rightTriangle81517,
          steps: [
            { say: r`Find the hypotenuse $AB$.`, type: 'num', answer: '17', prefix: r`$AB=$`, hint: r`$8^2+15^2$, then take the square root.`, after: r`$\sqrt{64+225}=\sqrt{289}=17$.` },
            { say: r`Standing at angle $A$, which side is opposite?`, type: 'mc', choices: [r`$BC$`, r`$AC$`, r`$AB$`], hint: r`The opposite side does not touch $A$.`, after: r`$BC=8$ is across from $A$.` },
            { say: r`What is $\sin A$? Fraction or decimal.`, type: 'num', answer: '8/17', hint: r`Opposite over hypotenuse.`, after: r`$\sin A=\frac{8}{17}$. Notice $\cos B$ is also $\frac{8}{17}$.` }
          ],
          takeaway: r`Stand at the angle first, then label the sides.`
        },
        {
          id: 'trig-g2', title: 'Sine Meets Cosine', skill: 'Cofunction identity', level: 'medium',
          stem: r`In a right triangle, the acute angles measure $(2k+10)^\circ$ and $(3k+5)^\circ$, and $\sin((2k+10)^\circ)=\cos((3k+5)^\circ)$. What is the value of $k$?`,
          steps: [
            { say: r`If $\sin(a^\circ)=\cos(b^\circ)$ for acute angles, what do $a$ and $b$ add up to?`, type: 'num', answer: '90', prefix: r`$a+b=$`, hint: r`Cofunctions go with complementary angles.`, after: r`Complementary angles: $a+b=90$.` },
            { say: r`Add the two expressions: $(2k+10)+(3k+5)=5k+15$. Set it to 90. What is $5k$?`, type: 'num', answer: '75', prefix: r`$5k=$`, hint: r`Subtract 15 from 90.`, after: r`$5k=75$.` },
            { say: r`What is $k$?`, type: 'num', answer: '15', prefix: r`$k=$`, hint: r`Divide by 5.`, after: r`$k=15$. The angles are $40^\circ$ and $50^\circ$, which add to $90^\circ$.` }
          ],
          takeaway: r`Sine equals cosine means the angles add to 90. Do not set them equal.`
        },
        {
          id: 'trig-g3', title: 'Two Triangles, One Shared Side', skill: 'Chaining the Pythagorean theorem', level: 'hard',
          stem: r`In the figure, angle $C$ is a right angle and $D$ lies on $BC$. If $AC=12$, $AD=13$, and $DB=11$, what is the value of $\sin B$?`,
          diagram: chainTriangle,
          steps: [
            { say: r`Use triangle $ACD$. What is $CD$?`, type: 'num', answer: '5', prefix: r`$CD=$`, hint: r`Legs 12 and $CD$, hypotenuse 13.`, after: r`$\sqrt{169-144}=\sqrt{25}=5$.` },
            { say: r`What is the whole leg $CB$?`, type: 'num', answer: '16', prefix: r`$CB=$`, hint: r`$CD+DB$`, after: r`$5+11=16$.` },
            { say: r`Use triangle $ACB$. What is $AB$?`, type: 'num', answer: '20', prefix: r`$AB=$`, hint: r`Legs 12 and 16, a scaled 3-4-5.`, after: r`$\sqrt{144+256}=\sqrt{400}=20$.` },
            { say: r`What is $\sin B$? Fraction or decimal.`, type: 'num', answer: '3/5', hint: r`Opposite of $B$ over the hypotenuse of triangle $ACB$.`, after: r`$\sin B=\frac{12}{20}=\frac{3}{5}$.` }
          ],
          takeaway: r`Find the shared side in the triangle you can solve, then carry it over.`
        }
      ]
    },
    {
      id: 'geo', title: 'Similar Triangles, Tangents and Inscribed Shapes',
      report: r`Packet misses: similar triangles, two tangents from a point, and a rectangle inside a circle.`,
      why: r`All three come down to a fact the picture does not state. Once you know the fact to look for, the arithmetic is short.`,
      idea: [
        r`<p><b>Match by angles.</b> Two pairs of equal angles make triangles similar. Vertical angles and angles along parallel lines give you those pairs.</p><p>Write the similarity statement in matching order, then read off the sides. Do not trust the drawing.</p>`,
        r`<p><b>Use whole sides.</b> In a triangle cut by a parallel segment, compare the small triangle to the whole triangle. Use $\frac{AD}{AB}$, not $\frac{AD}{DB}$.</p>`,
        r`<p><b>Tangents.</b> The radius meets the tangent at $90^\circ$, and two tangents from one point are equal.</p>` + tangentCard,
        r`<p><b>Inscribed shapes.</b> The diagonal of an inscribed rectangle is a diameter. A triangle with a diameter as one side has a right angle at the third point on the circle.</p>`
      ],
      widget: null,
      guided: [
        {
          id: 'geo-g1', title: 'Parallel Cut', skill: 'Similar triangles, whole sides', level: 'medium',
          stem: r`In triangle $ABC$, $D$ is on $AB$ and $E$ is on $AC$, with $DE$ parallel to $BC$. If $AD=6$, $DB=9$, and $DE=8$, what is the length of $BC$?`,
          diagram: nestedTriangle,
          steps: [
            { say: r`The large triangle uses all of side $AB$. What is $AB$?`, type: 'num', answer: '15', prefix: r`$AB=$`, hint: r`$AD+DB$`, after: r`$6+9=15$.` },
            { say: r`What is the scale factor from the small triangle to the large one?`, type: 'num', answer: '5/2', hint: r`$\frac{AB}{AD}$, not $\frac{DB}{AD}$.`, after: r`$\frac{15}{6}=\frac{5}{2}$.` },
            { say: r`What is $BC$?`, type: 'num', answer: '20', prefix: r`$BC=$`, hint: r`Multiply $DE$ by the scale factor.`, after: r`$8\cdot\frac{5}{2}=20$. Using $\frac{9}{6}$ gives 12, the trap answer.` }
          ],
          takeaway: r`Compare the small triangle to the whole triangle, not to the leftover piece.`
        },
        {
          id: 'geo-g2', title: 'Perimeter From Two Tangents', skill: 'Tangents', level: 'medium',
          stem: r`A circle has center $O$ and radius 8. Point $P$ is 17 units from $O$. Segments $PA$ and $PB$ are tangent to the circle at $A$ and $B$. What is the perimeter of quadrilateral $OAPB$?`,
          diagram: tangents81517,
          steps: [
            { say: r`What is the measure of angle $OAP$, in degrees?`, type: 'num', answer: '90', hint: r`Radius to a point of tangency.`, after: r`Radius and tangent are perpendicular.` },
            { say: r`Find $PA$.`, type: 'num', answer: '15', prefix: r`$PA=$`, hint: r`Hypotenuse 17, leg 8.`, after: r`$\sqrt{289-64}=\sqrt{225}=15$.` },
            { say: r`What is $PB$?`, type: 'num', answer: '15', prefix: r`$PB=$`, hint: r`Tangents from one point.`, after: r`$PB=PA=15$.` },
            { say: r`What is the perimeter of $OAPB$?`, type: 'num', answer: '46', hint: r`Add two radii and two tangents. $OP$ is not on the outside.`, after: r`$8+15+15+8=46$. The segment $OP$ is inside, so it does not count.` }
          ],
          takeaway: r`The perimeter uses radii and tangents. The segment to the center is the hypotenuse, not a side.`
        },
        {
          id: 'geo-g3', title: 'Height to the Diameter', skill: 'Inscribed right triangle', level: 'hard',
          stem: r`In the figure, $AB$ is a diameter of the circle with length 25, and $C$ is on the circle with $AC=15$. Point $D$ is on $AB$ and $CD$ is perpendicular to $AB$. What is the length of $CD$?`,
          diagram: thalesCircle,
          steps: [
            { say: r`$AB$ is a diameter. What is the measure of angle $ACB$, in degrees?`, type: 'num', answer: '90', hint: r`The angle at the circle opposite a diameter.`, after: r`A triangle on a diameter has a right angle at the third point.` },
            { say: r`Find $BC$.`, type: 'num', answer: '20', prefix: r`$BC=$`, hint: r`Hypotenuse 25, leg 15. A scaled 3-4-5.`, after: r`$\sqrt{625-225}=\sqrt{400}=20$.` },
            { say: r`Find the area of triangle $ABC$ using legs $AC$ and $BC$.`, type: 'num', answer: '150', hint: r`$\frac{1}{2}\cdot 15\cdot 20$`, after: r`Area $=150$.` },
            { say: r`The same area is $\frac{1}{2}\cdot AB\cdot CD$. What is $CD$?`, type: 'num', answer: '12', prefix: r`$CD=$`, hint: r`$\frac{1}{2}\cdot 25\cdot CD=150$`, after: r`$CD=\frac{300}{25}=12$.` }
          ],
          takeaway: r`Find the same area two ways to get a height you cannot reach directly.`
        }
      ]
    },
    {
      id: 'data', title: 'Box Plots and "Given That" Probability',
      report: r`Packet misses: range from two box plots, and a "given that" probability.`,
      why: r`Both skills depend on reading one word or one mark correctly. They are quick points once you know what each part means.`,
      idea: [
        r`<p><b>Reading the plot.</b></p>` + boxCard,
        r`<p><b>Quarters.</b> Each of the four sections holds about 25 percent of the data, whether the section is wide or narrow. A wide section means spread out, not more values.</p>`,
        r`<p><b>"Given that" shrinks the denominator.</b> Of 50 students, 20 play piano, and 5 of those also sing. The probability a student sings, given that the student plays piano, is $\frac{5}{20}=\frac{1}{4}$. The 50 is gone.</p>`
      ],
      widget: 'boxplot',
      guided: [
        {
          id: 'data-g1', title: 'Read One Box Plot', skill: 'Range and IQR', level: 'easy',
          stem: r`The box plot summarizes a data set with minimum 10, first quartile 18, median 24, third quartile 36, and maximum 50. About what percent of the values lie inside the box?`,
          diagram: singleBox,
          steps: [
            { say: r`What is the range?`, type: 'num', answer: '40', hint: r`Whisker tip to whisker tip.`, after: r`$50-10=40$.` },
            { say: r`What is the interquartile range?`, type: 'num', answer: '18', hint: r`The width of the box.`, after: r`$36-18=18$.` },
            { say: r`About what percent of the values lie inside the box?`, type: 'num', answer: '50', hint: r`Each of the four sections holds about 25 percent.`, after: r`Two quarters: about 50 percent.` }
          ],
          takeaway: r`Range is the full width. IQR is the box, and the box holds the middle half.`
        },
        {
          id: 'data-g2', title: 'Clubs by Grade', skill: 'Conditional probability from a table', level: 'medium',
          stem: r`The table shows club membership by grade. One student who is in the debate club is chosen at random. What is the probability that the student is in grade 11?` + TB(['', 'Grade 10', 'Grade 11'], [['Robotics', '30', '18'], ['Debate', '10', '22']]),
          steps: [
            { say: r`Which group is the denominator?`, type: 'mc', choices: [r`The debate club members`, r`All 80 students`, r`The grade 11 students`, r`The robotics members`], hint: r`What do you already know about the chosen student?`, after: r`You know the student is in debate, so that row is your whole world.` },
            { say: r`How many students are in debate?`, type: 'num', answer: '32', hint: r`Add across the Debate row.`, after: r`$10+22=32$.` },
            { say: r`How many of those are in grade 11?`, type: 'num', answer: '22', hint: r`Find the Debate row, Grade 11 column.`, after: r`22 students.` },
            { say: r`What is the probability? Fraction or decimal.`, type: 'num', answer: '11/16', hint: r`Part over the debate total.`, after: r`$\frac{22}{32}=\frac{11}{16}$. Using grade 11 as the group would give $\frac{22}{40}$, which answers a different question.` }
          ],
          takeaway: r`Circle the row or column named by the given fact. That total is the denominator.`
        },
        {
          id: 'data-g3', title: 'Box Plots Meet Given That', skill: 'Range, quartiles and conditional probability', level: 'hard',
          stem: r`The box plots show two lists, each with 200 values. Assume exactly 25 percent of the values lie in each section of a plot. What is the positive difference of the ranges? And if a value from List A is chosen at random, given that it is greater than the median of List A, what is the probability that it is greater than 50?`,
          diagram: treeBoxes,
          steps: [
            { say: r`What is the range of List A?`, type: 'num', answer: '50', hint: r`Whisker tips at 20 and 70.`, after: r`$70-20=50$.` },
            { say: r`What is the range of List B?`, type: 'num', answer: '35', hint: r`Whisker tips at 25 and 60.`, after: r`$60-25=35$.` },
            { say: r`What is the positive difference of the ranges?`, type: 'num', answer: '15', hint: r`Larger minus smaller.`, after: r`$50-35=15$.` },
            { say: r`How many values in List A are greater than the median, 40?`, type: 'num', answer: '100', hint: r`Half of 200.`, after: r`Half the values: 100. This is your new denominator.` },
            { say: r`How many values in List A are greater than 50, the third quartile?`, type: 'num', answer: '50', hint: r`The top section holds 25 percent of 200.`, after: r`$0.25\times 200=50$.` },
            { say: r`What is the probability, given that the value is greater than the median?`, type: 'num', answer: '1/2', hint: r`Greater-than-50 count over greater-than-median count.`, after: r`$\frac{50}{100}=\frac{1}{2}$, even though only a quarter of the whole list is above 50.` }
          ],
          takeaway: r`Each section is 25 percent. A "given that" changes the group you divide by.`
        }
      ]
    },
    {
      id: 'quad', title: 'Quadratics: Zeros, Factored Form, Shifted Inputs',
      report: r`Packet misses: zeros of a factored function with a shifted input, and a quadratic from its intercepts.`,
      why: r`Hard quadratic questions disguise one idea: a zero is an input that makes the function 0. The input can be something other than plain $x$.`,
      idea: [
        r`<p><b>Factored form shows the zeros.</b> $f(x)=(x-a)(x+b)$ has zeros $x=a$ and $x=-b$. The signs flip. A squared factor gives one distinct zero.</p>`,
        r`<p><b>Vertex halfway.</b> A parabola is symmetric, so the vertex $x$-coordinate is the midpoint of the zeros.</p>`,
        r`<p><b>Shifted inputs.</b> For $f(\text{inner})=0$, set the inner expression equal to each zero.</p><p>Example: $f$ has zeros 1 and 4, and $f(x+3)=0$. Then $x+3=1$ gives $x=-2$, and $x+3=4$ gives $x=1$.</p>`,
        r`<p><b>Unknown stretch.</b> Given only the intercepts, write $a(x-r)(x-s)$ and keep $a$. With zeros 1 and 2: $a(x^2-3x+2)$, so $b=-3a$ and $c=2a$.</p>`
      ],
      widget: 'zeros',
      guided: [
        {
          id: 'quad-g1', title: 'Zeros and the Vertex', skill: 'Factored form', level: 'easy',
          stem: r`The function $f$ is defined by $f(x)=(x-3)(x+7)$. What is the $x$-coordinate of the vertex of the graph of $y=f(x)$?`,
          steps: [
            { say: r`What is the positive zero?`, type: 'num', answer: '3', prefix: r`$x=$`, hint: r`Set $x-3=0$.`, after: r`$x=3$.` },
            { say: r`What is the negative zero?`, type: 'num', answer: '-7', prefix: r`$x=$`, hint: r`Set $x+7=0$. The sign flips.`, after: r`$x=-7$.` },
            { say: r`The vertex is halfway between the zeros. What is its $x$-coordinate?`, type: 'num', answer: '-2', prefix: r`$x=$`, hint: r`Average the two zeros.`, after: r`$\frac{3+(-7)}{2}=-2$.` }
          ],
          takeaway: r`Vertex $x$ is the average of the zeros.`
        },
        {
          id: 'quad-g2', title: 'Shift the Input', skill: 'Shifted inputs', level: 'medium',
          stem: r`The function $f$ is defined by $f(x)=(x-2)(x+5)$. What is the sum of all values of $x$ for which $f(x-3)=0$?`,
          steps: [
            { say: r`What are the zeros of $f$?`, type: 'mc', choices: [r`$2$ and $-5$`, r`$-2$ and $5$`, r`$2$ and $5$`, r`$-2$ and $-5$`], hint: r`Set each factor equal to 0.`, after: r`$x=2$ and $x=-5$.` },
            { say: r`Set the inner expression equal to the first zero: $x-3=2$. What is $x$?`, type: 'num', answer: '5', prefix: r`$x=$`, hint: r`Add 3 to both sides.`, after: r`$x=5$.` },
            { say: r`Now $x-3=-5$. What is $x$?`, type: 'num', answer: '-2', prefix: r`$x=$`, hint: r`Add 3 to both sides.`, after: r`$x=-2$.` },
            { say: r`What is the sum of the values of $x$?`, type: 'num', answer: '3', hint: r`Add the two new values.`, after: r`$5+(-2)=3$. Each zero moved right by 3, because of $x-3$.` }
          ],
          takeaway: r`Inside the function, solve inner $=$ each zero. $f(x-3)$ moves zeros right by 3.`
        },
        {
          id: 'quad-g3', title: 'Inner Expression with a Coefficient', skill: 'Factor and solve shifted input', level: 'hard',
          stem: r`The function $f$ is defined by $f(x)=x^2-4x-21$, and the function $g$ is defined by $g(x)=f(2x+1)$. What is the sum of the zeros of $g$?`,
          steps: [
            { say: r`Factor $f$.`, type: 'mc', choices: [r`$(x-7)(x+3)$`, r`$(x+7)(x-3)$`, r`$(x-21)(x+1)$`, r`$(x-7)(x-3)$`], hint: r`Two numbers that multiply to $-21$ and add to $-4$.`, after: r`$-7$ and $3$ work. The zeros of $f$ are $7$ and $-3$.` },
            { say: r`Set $2x+1=7$. What is $x$?`, type: 'num', answer: '3', prefix: r`$x=$`, hint: r`Subtract 1, then divide by 2.`, after: r`$2x=6$, so $x=3$.` },
            { say: r`Set $2x+1=-3$. What is $x$?`, type: 'num', answer: '-2', prefix: r`$x=$`, hint: r`Subtract 1, then divide by 2.`, after: r`$2x=-4$, so $x=-2$.` },
            { say: r`What is the sum of the zeros of $g$?`, type: 'num', answer: '1', hint: r`Add the two values you just found.`, after: r`$3+(-2)=1$. Check: $f(2(3)+1)=f(7)=0$.` }
          ],
          takeaway: r`No matter how the input is built, set it equal to each zero and solve for $x$.`
        }
      ]
    },
    {
      id: 'lines', title: 'Graphing Lines From Intercepts',
      report: r`Homework topic: graphing lines in standard form, including fractional coefficients, and interpreting intercepts.`,
      why: r`Intercepts are the fastest way to graph a standard form line. In a word problem, each intercept also has a meaning you can state.`,
      idea: [
        r`<p><b>Two substitutions.</b> For the $x$-intercept, set $y=0$. For the $y$-intercept, set $x=0$.</p><p>Example: $5x+2y=20$. With $y=0$, $x=4$, so the point is $(4, 0)$. With $x=0$, $y=10$, so the point is $(0, 10)$.</p>`,
        r`<p><b>Fractional coefficients.</b> Multiply through by the least common denominator first.</p><p>$\frac{1}{3}x+\frac{1}{4}y=2$ becomes $4x+3y=24$. Intercepts: $(6, 0)$ and $(0, 8)$.</p>`,
        r`<p><b>Slope from standard form.</b> $Ax+By=C$ has slope $-\frac{A}{B}$. You can also get it from the two intercepts as rise over run.</p>`,
        r`<p><b>Meaning in context.</b> An intercept means all of one thing and none of the other.</p><p>A hall arranges 120 chairs in rows of 4 and rows of 6: $4r+6s=120$. The intercept $r=30$ means 30 rows of 4 and no rows of 6.</p>`
      ],
      widget: null,
      guided: [
        {
          id: 'lines-g1', title: 'Plot From the Intercepts', skill: 'Intercepts of a standard form line', level: 'easy',
          stem: r`Graph the line $4x-3y=24$ using its intercepts.`,
          steps: [
            { say: r`Set $y=0$. What is the $x$-intercept?`, type: 'num', answer: '6', prefix: r`$x=$`, hint: r`$4x=24$`, after: r`$x=6$, so the point is $(6, 0)$.` },
            { say: r`Set $x=0$. What is the $y$-intercept?`, type: 'num', answer: '-8', prefix: r`$y=$`, hint: r`$-3y=24$. Keep the sign.`, after: r`$y=-8$, so the point is $(0, -8)$.` },
            { say: 'Click both intercepts on the grid.', type: 'plot', a: 4, b: -3, c: 24, xmax: 10, ymax: 10, hint: r`Plot $(6, 0)$ on the $x$-axis and $(0, -8)$ on the $y$-axis.`, after: r`A line through $(6, 0)$ and $(0, -8)$ has slope $\frac{4}{3}$, which matches $-\frac{A}{B}=-\frac{4}{-3}$.` }
          ],
          takeaway: r`Zero out one variable at a time, then connect the two points.`
        },
        {
          id: 'lines-g2', title: 'Clear the Fractions', skill: 'Standard form with fractional coefficients', level: 'medium',
          stem: r`A line has the equation $\frac{1}{2}x+\frac{1}{3}y=4$. What is the slope of the line?`,
          steps: [
            { say: r`Set $y=0$. What is the $x$-intercept?`, type: 'num', answer: '8', prefix: r`$x=$`, hint: r`$\frac{1}{2}x=4$`, after: r`$x=8$.` },
            { say: r`Set $x=0$. What is the $y$-intercept?`, type: 'num', answer: '12', prefix: r`$y=$`, hint: r`$\frac{1}{3}y=4$`, after: r`$y=12$.` },
            { say: r`What number clears both fractions?`, type: 'num', answer: '6', hint: r`The least common denominator of 2 and 3.`, after: r`Multiplying by 6 gives $3x+2y=24$. The intercepts are unchanged.` },
            { say: r`What is the slope of the line? Fraction or decimal.`, type: 'num', answer: '-3/2', hint: r`From $(8, 0)$ to $(0, 12)$, or use $-\frac{A}{B}$.`, after: r`$\frac{12-0}{0-8}=-\frac{3}{2}$, and $-\frac{3}{2}$ also comes from $3x+2y=24$.` }
          ],
          takeaway: r`Clear fractions to simplify. The line itself does not change.`
        },
        {
          id: 'lines-g3', title: 'Bike Wheels', skill: 'Interpreting intercepts in context', level: 'hard',
          stem: r`A repair shop has exactly 60 wheels for bicycles and tricycles. Each bicycle uses 2 wheels and each tricycle uses 3 wheels. The equation $2b+3t=60$ describes the number of bicycles $b$ and tricycles $t$ the shop can build using all the wheels. If the shop builds 12 bicycles, how many tricycles does it build?`,
          steps: [
            { say: r`Set $t=0$. What is the $b$-intercept?`, type: 'num', answer: '30', prefix: r`$b=$`, hint: r`$2b=60$`, after: r`$b=30$.` },
            { say: r`Set $b=0$. What is the $t$-intercept?`, type: 'num', answer: '20', prefix: r`$t=$`, hint: r`$3t=60$`, after: r`$t=20$.` },
            { say: r`What does the $t$-intercept mean in this context?`, type: 'mc', choices: [r`The shop can build 20 tricycles and no bicycles using all the wheels.`, r`Each tricycle uses 20 wheels.`, r`The shop builds 20 more tricycles than bicycles.`, r`The shop has 20 wheels left over after building bicycles.`], hint: r`On the $t$-axis, $b=0$.`, after: r`An intercept means none of the other item, so this is all tricycles.` },
            { say: r`Now substitute $b=12$. How many tricycles does the shop build?`, type: 'num', answer: '12', prefix: r`$t=$`, hint: r`$2(12)+3t=60$`, after: r`$24+3t=60$, so $3t=36$ and $t=12$.` }
          ],
          takeaway: r`Each intercept means all of one thing and none of the other.`
        }
      ]
    }
  ];
})();
